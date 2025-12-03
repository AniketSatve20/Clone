.PHONY: install build test deploy-testnet clean

install:
	forge install foundry-rs/forge-std
	forge install OpenZeppelin/openzeppelin-contracts@v5.0.0

build:
	forge build --skip test script

test:
	forge clean
	forge test -vvv

deploy-testnet:
	forge script script/Deploy.s.sol --rpc-url hedera_testnet --broadcast

clean:
	forge clean

