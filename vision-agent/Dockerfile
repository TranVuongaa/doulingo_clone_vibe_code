FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:0.11.29 /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY agent.py ./

EXPOSE 8000

CMD ["uv", "run", "--no-dev", "agent.py", "serve", "--host", "0.0.0.0", "--port", "8000"]

