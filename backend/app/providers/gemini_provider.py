import logging
from typing import Type, TypeVar, Optional
from pydantic import BaseModel
from google import genai
from app.providers.base import LLMProvider
from app.core.config import settings

logger = logging.getLogger(__name__)
T = TypeVar("T", bound=BaseModel)


class GeminiLLMProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_model: Type[T]
    ) -> T:
        if not self.client:
            raise ValueError("Gemini API key is not configured.")

        schema_json = response_model.model_json_schema()
        enforced_prompt = (
            f"{prompt}\n\n"
            f"CRITICAL: You MUST return a single valid JSON object strictly matching this JSON Schema:\n"
            f"{schema_json}"
        )

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=enforced_prompt,
                config={
                    "system_instruction": system_prompt,
                    "response_mime_type": "application/json",
                    "temperature": 0.2
                }
            )

            raw_text = response.text or "{}"
            parsed_json = self.extract_json(raw_text)
            return response_model.model_validate(parsed_json)

        except Exception as e:
            logger.error(f"Gemini API call error: {str(e)}")
            raise e

