import logging
from typing import Type, TypeVar, Optional, List
from pydantic import BaseModel
from groq import AsyncGroq
from app.providers.base import LLMProvider
from app.core.config import settings

logger = logging.getLogger(__name__)
T = TypeVar("T", bound=BaseModel)

FALLBACK_MODELS = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
]


class GroqLLMProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.model = model or settings.GROQ_MODEL or "openai/gpt-oss-20b"
        
        # Build available keys pool
        keys: List[str] = []
        if api_key:
            keys.append(api_key)
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY not in keys:
            keys.append(settings.GROQ_API_KEY)
        if settings.GROQ_API_KEY_SECONDARY and settings.GROQ_API_KEY_SECONDARY not in keys:
            keys.append(settings.GROQ_API_KEY_SECONDARY)

        self.keys = keys
        self.current_key_idx = 0
        self.clients = [AsyncGroq(api_key=k) for k in keys if k]

        if not self.clients:
            logger.warning("No valid Groq API keys found.")

    def _get_client(self) -> Optional[AsyncGroq]:
        if not self.clients:
            return None
        return self.clients[self.current_key_idx % len(self.clients)]

    def _rotate_client(self):
        if len(self.clients) > 1:
            self.current_key_idx = (self.current_key_idx + 1) % len(self.clients)
            logger.info(f"Rotated to Groq API Key #{self.current_key_idx + 1}")

    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_model: Type[T]
    ) -> T:
        if not self.clients:
            raise ValueError("Groq API key is not configured.")

        schema_json = response_model.model_json_schema()
        enforced_prompt = (
            f"{prompt}\n\n"
            f"CRITICAL: You MUST return a single valid JSON object strictly matching this JSON Schema:\n"
            f"{schema_json}"
        )

        models_to_try = [self.model] + [m for m in FALLBACK_MODELS if m != self.model]

        last_error = None
        for target_model in models_to_try:
            attempts = len(self.clients)
            for _ in range(attempts):
                client = self._get_client()
                if not client:
                    break

                try:
                    response = await client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": enforced_prompt}
                        ],
                        model=target_model,
                        response_format={"type": "json_object"},
                        temperature=0.1,
                        max_tokens=900,
                        timeout=25.0
                    )

                    raw_text = response.choices[0].message.content or "{}"
                    parsed_json = self.extract_json(raw_text)
                    return response_model.model_validate(parsed_json)

                except Exception as e:
                    last_error = e
                    err_msg = str(e)
                    logger.warning(
                        f"Groq API call with model '{target_model}' on key #{self.current_key_idx + 1} error: {err_msg}."
                    )
                    if "model_not_found" in err_msg or "404" in err_msg:
                        break
                    self._rotate_client()

        logger.error(f"All Groq models and keys exhausted: {last_error}")
        raise last_error or RuntimeError("Groq API call failed across all keys and models.")
