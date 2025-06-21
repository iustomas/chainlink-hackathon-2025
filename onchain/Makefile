# =============================================================================
# Chainlink Hackathon 2025 - Onchainb Makefile
# =============================================================================
# This Makefile provides all necessary commands to work with the project
# during the hackathon presentation and development.

# Configuration
NETWORK=base
MODULE=IntakePayment
CHAIN_ID=8453
DEPLOYMENT_FILE=ignition/deployments/chain-$(CHAIN_ID)/deployed_addresses.json

# Colors for better output
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
BLUE=\033[0;34m
NC=\033[0m # No Color

# =============================================================================
# SETUP & INSTALLATION
# =============================================================================

# Complete project setup (run this first)
setup:
	@echo "$(BLUE)🚀 Setting up Chainlink Hackathon 2025 project...$(NC)"
	@echo "$(YELLOW)📦 Installing dependencies...$(NC)"
	@npm install
	@echo "$(YELLOW)🔧 Checking Node.js version...$(NC)"
	@node --version
	@echo "$(YELLOW)📋 Checking npm version...$(NC)"
	@npm --version
	@echo "$(GREEN)✅ Setup completed! You can now run: make help$(NC)"

# Install dependencies
install:
	@echo "$(BLUE)🔍 Installing dependencies...$(NC)"
	@npm install
	@echo "$(GREEN)✅ Dependencies installed!$(NC)"

# =============================================================================
# LOCAL DEVELOPMENT
# =============================================================================

# Start local Chainlink Functions testnet
start-local-functions:
	@echo "$(BLUE)🚀 Starting local Chainlink Functions testnet...$(NC)"	
	@echo "$(YELLOW)📡 Starting testnet (this may take a moment)...$(NC)"
	@node -e "import('@chainlink/functions-toolkit').then(m => m.startLocalFunctionsTestnet())"

# =============================================================================
# SMART CONTRACT OPERATIONS
# =============================================================================

# Compile smart contracts
compile:
	@echo "$(BLUE)💻 Compiling smart contracts...$(NC)"
	@npx hardhat compile
	@echo "$(GREEN)✅ Compilation completed!$(NC)"

# Clean build artifacts
clean:
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(NC)"
	@rm -rf build/ artifacts/ cache/ typechain-types/
	@echo "$(GREEN)✅ Clean completed!$(NC)"

# Run tests
test:
	@echo "$(BLUE)🧪 Running tests...$(NC)"
	@npx hardhat test
	@echo "$(GREEN)✅ Tests completed!$(NC)"

# Run tests with coverage
test-coverage:
	@echo "$(BLUE)🧪 Running tests with coverage...$(NC)"
	@npx hardhat coverage
	@echo "$(GREEN)✅ Test coverage completed!$(NC)"

# =============================================================================
# DEPLOYMENT
# =============================================================================

# Deploy with verification (interactive)
deploy:
	@echo "$(BLUE)🚀 Starting full deployment & verification process...$(NC)"
	@echo "$(YELLOW)⚠️  Are you sure you want to deploy to $(NETWORK)? (Yes/No)$(NC)"
	@read -p "> " confirm; \
	if [ "$$confirm" != "Yes" ]; then \
		echo "$(RED)❌ Deployment cancelled$(NC)"; \
		exit 1; \
	fi
	@npx hardhat ignition deploy ignition/modules/$(MODULE).ts --network $(NETWORK)
	@echo "$(BLUE)📡 Extracting deployed contract address...$(NC)"
	@ADDRESS=$$(cat $(DEPLOYMENT_FILE) | jq -r '.["$(MODULE)#$(MODULE)"]'); \
	if [ -z "$$ADDRESS" ]; then \
		echo "$(RED)❌ Failed to get contract address$(NC)"; \
		exit 1; \
	fi; \
	echo "$(GREEN)✅ Contract deployed at: $$ADDRESS$(NC)"; \
	echo "$(BLUE)🔍 Verifying smart contract...$(NC)"; \
	npx hardhat verify --network $(NETWORK) $$ADDRESS "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70"
	@echo "$(GREEN)🎯 All done!$(NC)"

# Deploy without verification (non-interactive)
deploy-quick:
	@echo "$(BLUE)🚀 Deploying to $(NETWORK)...$(NC)"
	@npx hardhat ignition deploy ignition/modules/$(MODULE).ts --network $(NETWORK)
	@echo "$(GREEN)✅ Deployment completed!$(NC)"

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

# Show project status
status:
	@echo "$(BLUE)📊 Project Status:$(NC)"
	@echo "$(YELLOW)Node.js version:$(NC)" && node --version
	@echo "$(YELLOW)npm version:$(NC)" && npm --version
	@echo "$(YELLOW)Hardhat version:$(NC)" && npx hardhat --version
	@echo "$(YELLOW)Network:$(NC) $(NETWORK)"
	@echo "$(YELLOW)Module:$(NC) $(MODULE)"
	@echo "$(YELLOW)Chain ID:$(NC) $(CHAIN_ID)"

# Show help
help:
	@echo "$(BLUE)============================================$(NC)"
	@echo "$(BLUE)Chainlink Hackathon 2025 - Available Commands$(NC)"
	@echo "$(BLUE)============================================$(NC)"
	@echo ""
	@echo "$(GREEN)Setup:$(NC)"
	@echo "  setup                    Complete project setup (run first)"
	@echo "  install                  Install dependencies"
	@echo ""
	@echo "$(GREEN)Local Development:$(NC)"
	@echo "  start-local-functions    Start local Chainlink Functions testnet"
	@echo "  start-local-functions-silent  Start testnet (silent mode)"
	@echo ""
	@echo "$(GREEN)Smart Contracts:$(NC)"
	@echo "  compile                  Compile smart contracts"
	@echo "  clean                    Clean build artifacts"
	@echo "  test                     Run tests"
	@echo "  test-coverage            Run tests with coverage"
	@echo ""
	@echo "$(GREEN)Deployment:$(NC)"
	@echo "  deploy                   Deploy with verification (interactive)"
	@echo "  deploy-quick             Deploy without verification"
	@echo ""
	@echo "$(GREEN)Utility:$(NC)"
	@echo "  status                   Show project status"
	@echo "  help                     Show this help message"
	@echo ""
	@echo "$(YELLOW)Quick Start:$(NC)"
	@echo "  1. make setup"
	@echo "  2. make compile"
	@echo "  3. make test"
	@echo "  4. make start-local-functions"
	@echo ""

# Default target
.DEFAULT_GOAL := help

.PHONY: setup install start-local-functions start-local-functions-silent compile clean test test-coverage deploy deploy-quick status help
