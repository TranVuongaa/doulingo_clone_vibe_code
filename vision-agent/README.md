# AI language teacher service

This Python service joins the Stream lesson calls created by the Expo app and
provides a voice-only AI teacher using OpenAI Realtime.

The teacher reads `languageCode` and `lessonTitle` from the Stream call's custom
metadata. It explains and corrects in English while using the selected language
for short examples and exercises.

## Configure

The service loads the repository-level `../.env` automatically. That file
already contains the Stream credentials; add the OpenAI key alongside them:

```dotenv
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
OPENAI_API_KEY=your_openai_api_key
```

For a standalone deployment, inject the same three environment variables or
copy `.env.example` to `.env` inside this directory.

## Run locally

Install [uv](https://docs.astral.sh/uv/) and run:

```bash
cd vision-agent
uv sync
uv run agent.py run
```

Console mode prints a browser demo link. To run the HTTP service used by an app
or backend integration:

```bash
uv run agent.py serve --host 0.0.0.0 --port 8000
```

Run the unit tests with:

```bash
uv run pytest
```

