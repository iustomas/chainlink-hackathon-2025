GIT_SHA := $(shell git rev-parse --short=7 HEAD)
PROJECT_ID=favorable-tree-459616-i0
REGION=us-central1
APP_NAME=tomas-web3-api

build:
	@echo "[build] Cleaning and building..."
	@rm -rf dist
	@npm run build

dev:
	@echo "[dev] Starting development server..."
	@npm run dev

deploy: build
	@echo "[deploy] Building and deploying $(APP_NAME)..."
	@docker build --platform=linux/amd64 -t gcr.io/$(PROJECT_ID)/$(APP_NAME):$(GIT_SHA) .
	@docker push gcr.io/$(PROJECT_ID)/$(APP_NAME):$(GIT_SHA)
	@gcloud run deploy $(APP_NAME) \
		--image gcr.io/$(PROJECT_ID)/$(APP_NAME):$(GIT_SHA) \
		--region $(REGION) \
		--platform managed \
		--allow-unauthenticated \
		--memory 512Mi \
		--cpu 1 \
		--port 3000 \
		--timeout 300 \
		--set-env-vars "NODE_ENV=production"

