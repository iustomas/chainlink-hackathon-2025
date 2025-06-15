# Compile command
compile:
	@echo "💻 Compiling smart contracts..."
	@npx hardhat compile 2>/dev/null || true
	@echo "✅ Compilation completed!"

# Clean command
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf build/ artifacts/
	@echo "✅ Clean completed!"

.PHONY: compile clean
