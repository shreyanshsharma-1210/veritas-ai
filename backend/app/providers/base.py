import abc
import json
import re
from typing import Type, TypeVar, Optional, Dict, Any
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class LLMProvider(abc.ABC):
    @abc.abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_model: Type[T]
    ) -> T:
        """Generates a structured Pydantic response conforming to response_model."""
        pass

    @staticmethod
    def extract_json(raw_text: str) -> Dict[str, Any]:
        """Extracts JSON from text, stripping markdown code blocks if present."""
        cleaned = raw_text.strip()
        # Look for markdown code fence
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
        if match:
            cleaned = match.group(1).strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            # Fallback: attempt to find first '{' and last '}'
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1:
                return json.loads(cleaned[start:end + 1])
            raise ValueError(f"Failed to parse JSON from LLM output: {str(e)}\nRaw output: {raw_text[:300]}")

