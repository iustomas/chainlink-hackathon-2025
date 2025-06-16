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

.PHONY: compile clean test
