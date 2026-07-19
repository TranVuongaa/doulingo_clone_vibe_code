import os
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

from dotenv import load_dotenv
from vision_agents.core import Agent, Runner, User
from vision_agents.core.agents import AgentLauncher
from vision_agents.plugins import getstream, openai


SERVICE_DIRECTORY = Path(__file__).resolve().parent
PARENT_ENV_FILE = SERVICE_DIRECTORY.parent / ".env"
SERVICE_ENV_FILE = SERVICE_DIRECTORY / ".env"

# The Expo app already keeps Stream credentials in the repository-level .env.
# A service-local .env can override values when the agent runs independently.
load_dotenv(PARENT_ENV_FILE)
load_dotenv(SERVICE_ENV_FILE, override=True)

LANGUAGE_NAMES = {
    "de": "German",
    "es": "Spanish",
    "fr": "French",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
}
DEFAULT_LANGUAGE_CODE = "es"

TEACHER_INSTRUCTIONS = """
You are a warm, encouraging AI language teacher for beginner learners.
Always speak English when explaining, asking questions, giving feedback, or
correcting the learner. Use the selected target language only for short words,
phrases, pronunciation examples, and exercises. Never switch the teaching
language away from English, even if the learner asks you to.

Keep each spoken response concise and conversational. Teach one small idea at a
time, ask only one question at a time, and give the learner space to answer.
Correct mistakes gently: first acknowledge the attempt, then model the improved
target-language phrase, and briefly explain the correction in English.
""".strip()


@dataclass(frozen=True)
class LessonContext:
    language_code: str
    language_name: str
    lesson_title: str | None = None


def required_environment_variable(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"{name} is not configured. Add it to {PARENT_ENV_FILE}."
        )
    return value


def lesson_context_from_custom(
    custom: Mapping[str, object] | None,
) -> LessonContext:
    language_code = DEFAULT_LANGUAGE_CODE
    lesson_title = None

    if custom:
        custom_language_code = custom.get("languageCode")
        custom_lesson_title = custom.get("lessonTitle")

        if (
            isinstance(custom_language_code, str)
            and custom_language_code in LANGUAGE_NAMES
        ):
            language_code = custom_language_code

        if isinstance(custom_lesson_title, str) and custom_lesson_title.strip():
            lesson_title = custom_lesson_title.strip()

    return LessonContext(
        language_code=language_code,
        language_name=LANGUAGE_NAMES[language_code],
        lesson_title=lesson_title,
    )


def opening_prompt(context: LessonContext) -> str:
    lesson_detail = (
        f' The lesson is titled "{context.lesson_title}".'
        if context.lesson_title
        else ""
    )
    return (
        f"Begin a beginner {context.language_name} lesson now.{lesson_detail} "
        "Greet the learner in English, state today's goal in one sentence, "
        f"then teach one short {context.language_name} phrase through English."
    )


async def create_agent(**_kwargs: object) -> Agent:
    required_environment_variable("STREAM_API_KEY")
    required_environment_variable("STREAM_API_SECRET")
    required_environment_variable("OPENAI_API_KEY")

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Language Teacher", id="language-teacher"),
        instructions=TEACHER_INSTRUCTIONS,
        llm=openai.Realtime(
            model="gpt-realtime-2",
            voice="marin",
            send_video=False,
        ),
    )


async def join_call(
    agent: Agent,
    call_type: str,
    call_id: str,
    **_kwargs: object,
) -> None:
    call = await agent.create_call(call_type, call_id)
    call_response = await call.get()
    context = lesson_context_from_custom(call_response.data.call.custom)

    async with agent.join(call):
        await agent.simple_response(text=opening_prompt(context))
        await agent.finish()


runner = Runner(
    AgentLauncher(
        create_agent=create_agent,
        join_call=join_call,
        max_sessions_per_call=1,
    )
)


if __name__ == "__main__":
    runner.cli()
