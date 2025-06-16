NETWORK=base
MODULE=IntakePayment
CHAIN_ID=8453
DEPLOYMENT_FILE=ignition/deployments/chain-$(CHAIN_ID)/deployed_addresses.json

# Install dependencies
install:
	@echo "🔍 Installing dependencies..."
	@npm install
	@echo "✅ Dependencies installed!"

# Compile command
compile:
	@echo "💻 Compiling smart contracts..."
	@npx hardhat compile
	@echo "✅ Compilation completed!"

# Clean command
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf build/ artifacts/ cache/ typechain-types/
	@echo "✅ Clean completed!"

# Test command
test:
	@echo "🧪 Running tests..."
	@npx hardhat test
	@echo "✅ Tests completed!"

# Deploy command with verification
deploy:
	@echo "🚀 Starting full deployment & verification process..."
	@echo "⚠️  Are you sure you want to deploy to $(NETWORK)? (Yes/No)"
	@read -p "> " confirm; \
	if [ "$$confirm" != "Yes" ]; then \
		echo "❌ Deployment cancelled"; \
		exit 1; \
	fi
	@npx hardhat ignition deploy ignition/modules/$(MODULE).ts --network $(NETWORK)
	@echo "📡 Extracting deployed contract address from deployed_addresses.json..."
	@ADDRESS=$$(cat $(DEPLOYMENT_FILE) | jq -r '.["$(MODULE)#$(MODULE)"]'); \
	if [ -z "$$ADDRESS" ]; then \
		echo "❌ Failed to get contract address"; \
		exit 1; \
	fi; \
	echo "✅ Contract deployed at: $$ADDRESS"; \
	echo "🔍 Verifying smart contract..."; \
	npx hardhat verify --network $(NETWORK) $$ADDRESS "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70"
	@echo "🎯 All done!"

.PHONY: compile clean test deploy
