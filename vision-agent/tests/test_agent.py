import asyncio

import pytest

import agent


def test_lesson_context_uses_selected_language_and_title() -> None:
    context = agent.lesson_context_from_custom(
        {"languageCode": "ja", "lessonTitle": "Warm introductions"}
    )

    assert context.language_code == "ja"
    assert context.language_name == "Japanese"
    assert context.lesson_title == "Warm introductions"


def test_lesson_context_defaults_to_spanish_for_invalid_metadata() -> None:
    context = agent.lesson_context_from_custom(
        {"languageCode": "invalid", "lessonTitle": 42}
    )

    assert context.language_code == "es"
    assert context.language_name == "Spanish"
    assert context.lesson_title is None


def test_opening_prompt_keeps_english_as_teaching_language() -> None:
    context = agent.LessonContext(
        language_code="fr",
        language_name="French",
        lesson_title="Cafe greetings",
    )

    prompt = agent.opening_prompt(context)

    assert "beginner French lesson" in prompt
    assert "through English" in prompt
    assert "Cafe greetings" in prompt


def test_agent_is_voice_only(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("STREAM_API_KEY", "test-stream-key")
    monkeypatch.setenv("STREAM_API_SECRET", "test-stream-secret")
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai-key")

    async def create_and_close_teacher() -> bool:
        teacher = await agent.create_agent()
        sends_video = teacher.llm.rtc.send_video
        await teacher.close()
        return sends_video

    assert asyncio.run(create_and_close_teacher()) is False
