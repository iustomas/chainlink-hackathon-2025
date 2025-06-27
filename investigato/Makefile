# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
GOOGLE_CLOUD_PROJECT_ID := $(shell grep '^GOOGLE_CLOUD_PROJECT_ID=' .env | cut -d '=' -f2)
REGION              ?= us-central1
RESEARCH_APP_NAME   ?= investigato
GIT_SHA             ?= $(shell git rev-parse --short HEAD)

RESEARCH_IMAGE      := gcr.io/$(GOOGLE_CLOUD_PROJECT_ID)/$(RESEARCH_APP_NAME):$(GIT_SHA)

# ---------------------------------------------------------------------------
# Dev local
# ---------------------------------------------------------------------------
dev:
	@echo "[dev] Running Investigato in local…"
	uvx --refresh --from "langgraph-cli[inmem]" \
	    --with-editable . --python 3.11 \
	    langgraph dev --allow-blocking

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
build:
	@echo "[build] Building $(RESEARCH_IMAGE)…"
	docker build --platform=linux/amd64 -t $(RESEARCH_IMAGE) .

# ---------------------------------------------------------------------------
# Push 
# ---------------------------------------------------------------------------
push: build
	@echo "[push] Pushing $(RESEARCH_IMAGE)…"
	docker push $(RESEARCH_IMAGE)

# ---------------------------------------------------------------------------
# Deploy 
# ---------------------------------------------------------------------------
deploy: push
	@echo "[deploy] Deploying $(RESEARCH_APP_NAME) in Cloud Run…"
	@export $$(grep -v '^#' .env | xargs) && \
	gcloud run deploy $(RESEARCH_APP_NAME) \
		--image $(RESEARCH_IMAGE) \
		--region $(REGION) \
		--platform managed \
		--allow-unauthenticated \
		--memory 2Gi \
		--cpu 4 \
		--port 8080 \
		--min-instances 1 \
		--max-instances 3 \
		--timeout 900 \
		--concurrency 10 \
		--set-env-vars "$$(grep -v '^#' .env | xargs | sed 's/ /,/g'),PYTHONUNBUFFERED=1"

.PHONY: dev build push deploy
