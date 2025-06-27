FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PORT=8080
WORKDIR /app

# 🔧 paquetes de sistema mínimos
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential gcc && rm -rf /var/lib/apt/lists/*

# 1️⃣  Copia SOLO el manifest para cachear deps
COPY pyproject.toml uv.lock ./

RUN pip install --upgrade pip && \
    pip install "langgraph-cli[inmem]" "uvicorn[standard]"

# 2️⃣  Copia el código real y registra editable
COPY . .

RUN pip install -e .

EXPOSE 8080
CMD ["langgraph", "dev", "--host", "0.0.0.0", "--port", "8080", "--allow-blocking"]  