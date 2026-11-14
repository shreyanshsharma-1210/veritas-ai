import logging
from typing import Optional
from app.core.config import settings
from app.providers.base import LLMProvider
from app.providers.groq_provider import GroqLLMProvider
from app.providers.gemini_provider import GeminiLLMProvider
from app.providers.mock_provider import MockLLMProvider

logger = logging.getLogger(__name__)


def get_llm_provider(preferred_provider: Optional[str] = None) -> LLMProvider:
    provider_name = (preferred_provider or settings.DEFAULT_LLM_PROVIDER).lower()

    if provider_name == "groq" and settings.GROQ_API_KEY:
        try:
            return GroqLLMProvider(api_key=settings.GROQ_API_KEY)
        except Exception as e:
            logger.warning(f"Failed to initialize Groq provider: {e}. Falling back to Mock.")

    if provider_name == "gemini" and settings.GEMINI_API_KEY:
        try:
            return GeminiLLMProvider()
        except Exception as e:
            logger.warning(f"Failed to initialize Gemini provider: {e}. Falling back to Mock.")

    if settings.GROQ_API_KEY:
        return GroqLLMProvider(api_key=settings.GROQ_API_KEY)
    if settings.GEMINI_API_KEY:
        return GeminiLLMProvider()

    logger.info("Using Veritas AI Deterministic Mock LLM Provider.")
    return MockLLMProvider()


def get_closer_provider() -> LLMProvider:
    """Closer Agent is dedicated to Groq API Key 1."""
    if settings.GROQ_API_KEY:
        logger.info("Instantiating Closer Agent with Groq Key 1")
        return GroqLLMProvider(api_key=settings.GROQ_API_KEY)
    return get_llm_provider()


def get_skeptic_provider() -> LLMProvider:
    """Skeptic Agent is dedicated to Groq API Key 2."""
    key = settings.GROQ_API_KEY_SECONDARY or settings.GROQ_API_KEY
    if key:
        logger.info("Instantiating Skeptic Agent with Groq Key 2")
        return GroqLLMProvider(api_key=key)
    return get_llm_provider()


def get_evaluator_provider() -> LLMProvider:
    """Evaluator Agent uses primary Groq Key."""
    return get_closer_provider()
