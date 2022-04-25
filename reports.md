# Reports

## Coverage

```console
❯ yarn coverage                                                                                                                                                                       ⏎
yarn run v1.22.18
$ hardhat coverage --solcoverjs ./.solcover.js --temp build --network hardhat

Version
=======
> solidity-coverage: v0.7.21

Instrumenting for coverage...
=============================

> ERC20Token.sol
> Vault.sol

Compilation:
============

Generating typings for: 10 artifacts in dir: ./build/typechain/ for target: ethers-v5
Successfully generated 17 typings!
Compiled 10 Solidity files successfully

Network Info
============
> HardhatEVM: v2.9.3
> network:    hardhat

No need to generate any newer typings.


  ERC20 Token contract
    All: Ownable
      ✔ Should have the correct owner
      ✔ Owner is able to transfer ownership
    All: Pausable
      ✔ Owner is able to pause when NOT paused
      ✔ Owner is able to unpause when already paused (65ms)
      ✔ Owner is NOT able to pause when already paused (61ms)
      ✔ Owner is NOT able to unpause when already unpaused (73ms)
    PRIME token: Mint
      ✔ Succeeds when owner mints token
      ✔ Reverts when non-owner mints token
      ✔ Reverts when owner mints zero token
      ✔ Reverts when owner mints token to zero address
      ✔ Reverts when paused
    Vault: Deposit PRIME
      ✔ Succeeds when PRIME is deposited
      ✔ Reverts when zero amount deposited
    Vault: Withdraw pUSD
      ✔ Succeeds when withdrawn pUSD after 1 time deposit of PRIME token
      ✔ Succeeds when withdrawn pUSD after 2 times deposit of PRIME token (41ms)
      ✔ Reverts when no deposit of PRIME token


  16 passing (4s)

-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts/      |      100 |       90 |      100 |      100 |                |
  ERC20Token.sol |      100 |      100 |      100 |      100 |                |
  Vault.sol      |      100 |     87.5 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|
All files        |      100 |       90 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
✨  Done in 12.01s.
```

## Deployment

```console
❯ yarn hardhat deploy:All --network rinkeby
yarn run v1.22.18
$ /Users/abhi3700/F/coding/github_repos/evm_contracts_vaultLend/node_modules/.bin/hardhat deploy:All --network rinkeby
PRIME token SC deployed to:  0x89C1142bF7Ef439367F8F414D54B5F6a3021EeEc
The transaction that was sent to the network to deploy the PRIME token contract: 0xe2331532c3576b798efba673924c2a20dd42a60f01da991f36d163f15c2cead4
pUSD Coin SC deployed to:  0x0b451Ed67bB203f998c69d66f2Cd32f89E452bc9
The transaction that was sent to the network to deploy the pUSD Coin contract: 0xd4c98bba1a1ea41934bbbd2e41af621d39b3c38fb7b7b8a9503a57a1b3f896f6
Vault SC deployed to:  0x4939463F9285097d7BfCB5B72B0649c59BF5C637
The transaction that was sent to the network to deploy the Vault contract: 0x754fc5bcfd63d2f1f9748564fc95569083f60975dfe86121591a2f3e04249efd
✨  Done in 42.99s.
```

## Verify

```console
❯ yarn verify rinkeby 0x4939463F9285097d7BfCB5B72B0649c59BF5C637 "0x89C1142bF7Ef439367F8F414D54B5F6a3021EeEc" "0x0b451Ed67bB203f998c69d66f2Cd32f89E452bc9" "1"                        ⏎
yarn run v1.22.18
$ hardhat verify --network rinkeby 0x4939463F9285097d7BfCB5B72B0649c59BF5C637 0x89C1142bF7Ef439367F8F414D54B5F6a3021EeEc 0x0b451Ed67bB203f998c69d66f2Cd32f89E452bc9 1
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Vault.sol:Vault at 0x4939463F9285097d7BfCB5B72B0649c59BF5C637
for verification on Etherscan. Waiting for verification result...

Successfully verified contract Vault on Etherscan.
https://rinkeby.etherscan.io/address/0x4939463F9285097d7BfCB5B72B0649c59BF5C637#code
✨  Done in 26.52s.
```
