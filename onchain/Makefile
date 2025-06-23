# =============================================================================
# Chainlink Hackathon 2025 - Onchain Makefile
# =============================================================================
# This Makefile provides all necessary commands to work with the project
# during the hackathon presentation and development.

# Configuration
NETWORK=base
CHAIN_ID=8453
DEPLOYMENT_FILE=ignition/deployments/chain-$(CHAIN_ID)/deployed_addresses.json

# =============================================================================
# SETUP & INSTALLATION
# =============================================================================

# Complete project setup (run this first)
setup:
	@echo "Setting up Chainlink Hackathon 2025 project..."
	@echo "Installing dependencies..."
	@npm install
	@echo "Checking Node.js version..."
	@node --version
	@echo "Checking npm version..."
	@npm --version
	@echo "Setup completed! You can now run: make help"

# Install dependencies
install:
	@echo "Installing dependencies..."
	@npm install
	@echo "Dependencies installed!"

# =============================================================================
# LOCAL DEVELOPMENT
# =============================================================================

# Start local Chainlink Functions testnet
start-local-functions:
	@echo "Starting local Chainlink Functions testnet..."
	@echo "Starting testnet (this may take a moment)..."
	@node -e "import('@chainlink/functions-toolkit').then(m => m.startLocalFunctionsTestnet())"

# =============================================================================
# SMART CONTRACT OPERATIONS
# =============================================================================

# Compile smart contracts
compile:
	@echo "Compiling smart contracts..."
	@npx hardhat compile
	@echo "Compilation completed!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf build/ artifacts/ cache/ typechain-types/
	@echo "Clean completed!"

# Run tests
test:
	@echo "Running tests..."
	@npx hardhat test
	@echo "Tests completed!"

# =============================================================================
# DEPLOYMENT
# =============================================================================

# Deploy with verification (interactive)
deploy:
	@echo "Starting full deployment and verification process..."

    # -------- 1. Select contract to deploy ---------
	@echo "Select the contract to deploy:"
	@select opt in "IntakePayment" "ConsumerSimpleImproved" "Exit"; do \
		case $$REPLY in \
			1) MODULE="IntakePayment"; break;; \
			2) MODULE="ConsumerSimpleImproved"; break;; \
			3) echo "Operation cancelled."; exit 1;; \
		esac; \
	done; \

    # -------- 2. Confirm deployment ---------
	echo "Are you sure you want to deploy to $(NETWORK)? (Yes/No)"; \
	read -p "> " confirm; \
	if [ "$$confirm" != "Yes" ]; then \
		echo "Deployment cancelled"; \
		exit 1; \
	fi; \

    # -------- 3. Deploy contract ---------
	npx hardhat ignition deploy ignition/modules/$$MODULE.ts --network $(NETWORK); \

    # -------- 4. Extract deployed contract address ---------
	echo "Extracting deployed contract address..."
	ADDRESS=$$(jq -r --arg module "$$MODULE" '.[$$module + "#" + $$module]' \
		"$(DEPLOYMENT_FILE)")

	if [[ -z "$$ADDRESS" || "$$ADDRESS" == "null" ]]; then
		echo "❌ Failed to get contract address"
		exit 1
	fi
	echo "Contract deployed at: $$ADDRESS"

    # -------- 5. Verify contract ---------
	echo "Contract deployed at: $$ADDRESS"; \
	echo "Verifying smart contract..."; \
	npx hardhat verify --network $(NETWORK) $$ADDRESS "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70"; \
	echo "All done!"

# Deploy without verification (non-interactive)
deploy-quick:
	@echo "Select the contract to deploy:"
	@select opt in "IntakePayment" "ConsumerSimpleImproved8" "Exit"; do \
		case $$REPLY in \
			1) MODULE="IntakePayment"; break;; \
			2) MODULE="ConsumerSimpleImproved8"; break;; \
			3) echo "Operation cancelled."; exit 1;; \
			*) echo "Invalid option.";; \
		esac; \
	done; \
	npx hardhat ignition deploy ignition/modules/$$MODULE.ts --network $(NETWORK); \
	echo "Deployment completed!"

verify-quick:
	@echo "Verifying smart contract..."
	@npx hardhat verify --network base 0x43Ce8aFC7d03b4fBF4F24A36bd66cE1cc34d1063 0xf9b8fc078197181c841c296c876945aaa425b278 0x66756e2d626173652d6d61696e6e65742d310000000000000000000000000000 60 200000 0 1750715443
	echo "All done!"

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

# Show project status
status:
	@echo "Project Status:"
	@echo "Node.js version:" && node --version
	@echo "npm version:" && npm --version
	@echo "Hardhat version:" && npx hardhat --version
	@echo "Network: $(NETWORK)"
	@echo "Module: $(MODULE)"
	@echo "Chain ID: $(CHAIN_ID)"

# Show help
help:
	@echo "============================================"
	@echo "Chainlink Hackathon 2025 - Available Commands"
	@echo "============================================"
	@echo ""
	@echo "Setup:"
	@echo "  setup                    Complete project setup (run first)"
	@echo "  install                  Install dependencies"
	@echo ""
	@echo "Local Development:"
	@echo "  start-local-functions    Start local Chainlink Functions testnet"
	@echo "  start-local-functions-silent  Start testnet (silent mode)"
	@echo ""
	@echo "Smart Contracts:"
	@echo "  compile                  Compile smart contracts"
	@echo "  clean                    Clean build artifacts"
	@echo "  test                     Run tests"
	@echo "  test-coverage            Run tests with coverage"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy                   Deploy with verification (interactive, choose contract)"
	@echo "  deploy-quick             Deploy without verification (choose contract)"
	@echo ""
	@echo "Utility:"
	@echo "  status                   Show project status"
	@echo "  help                     Show this help message"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. make setup"
	@echo "  2. make compile"
	@echo "  3. make test"
	@echo "  4. make start-local-functions"
	@echo ""

# Default target
.DEFAULT_GOAL := help

.PHONY: setup install start-local-functions start-local-functions-silent compile clean test test-coverage deploy deploy-quick status help
