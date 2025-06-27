GIT_SHA := $(shell git rev-parse --short=7 HEAD)
GOOGLE_CLOUD_PROJECT_ID := $(shell grep '^GOOGLE_CLOUD_PROJECT_ID=' .env | cut -d '=' -f2)
REGION=us-central1
APP_NAME=investigato

build:
	@echo "[build] Cleaning and building..."
	@rm -rf dist
	@npm run build

dev:
	@echo "[dev] Starting development server..."
	@npm run dev

deploy: build
	@echo "[deploy] Building and deploying $(APP_NAME)..."
	@docker build --platform=linux/amd64 -t gcr.io/$(GOOGLE_CLOUD_PROJECT_ID)/$(APP_NAME):$(GIT_SHA) .
	@docker push gcr.io/$(GOOGLE_CLOUD_PROJECT_ID)/$(APP_NAME):$(GIT_SHA)
	@export $(shell grep -v '^#' .env | xargs) && \
	gcloud run deploy $(APP_NAME) \
		--image gcr.io/$(GOOGLE_CLOUD_PROJECT_ID)/$(APP_NAME):$(GIT_SHA) \
		--region $(REGION) \
		--platform managed \
		--allow-unauthenticated \
		--memory 512Mi \
		--cpu 1 \
		--port 3000 \
		--timeout 300 \
		--set-env-vars "$$(cat .env | grep -v '^#' | xargs | sed 's/ /,/g'),NODE_ENV=production"

