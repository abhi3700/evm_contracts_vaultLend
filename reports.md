# Reports

## Coverage

```console
❯ yarn coverage
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
    Ownable for Vault
      ✔ Should have the correct owner
      ✔ Owner is able to transfer ownership
    Pausable for Vault
      ✔ Owner is able to pause when NOT paused
      ✔ Owner is able to unpause when already paused
      ✔ Owner is NOT able to pause when already paused
      ✔ Owner is NOT able to unpause when already unpaused
    Mint for PRIME token
      ✔ Succeeds when owner mints token
      ✔ Reverts when non-owner mints token
      ✔ Reverts when owner mints zero token
      ✔ Reverts when owner mints token to zero address
      ✔ Reverts when paused
    Vault: Deposit PRIME
      ✔ Succeeds when PRIME is deposited
    Vault: Withdraw pUSD
1650919576
      ✔ Succeeds when withdrawn pUSD after deposit of PRIME


  13 passing (3s)

-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts/      |    82.14 |       50 |    83.33 |    82.14 |                |
  ERC20Token.sol |       50 |       50 |       60 |       50 | 37,38,40,42,53 |
  Vault.sol      |      100 |       50 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|
All files        |    82.14 |       50 |    83.33 |    82.14 |                |
-----------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
✨  Done in 11.20s.
```

## Deployment

```console
❯ yarn hardhat deploy:All --network rinkeby                                                                                                                           ⏎
yarn run v1.22.18
$ /Users/abhi3700/F/coding/github_repos/x/x/node_modules/.bin/hardhat deploy:All --network rinkeby
PRIME token SC deployed to:  0x516F6C907f840A733de05b962FD7bA1E1d5f5ed8
The transaction that was sent to the network to deploy the PRIME token contract: 0xf29f44194acd33ad9a13bb5652bbf14c7290c91c0b33523c23cfeaec12b41d21
pUSD Coin SC deployed to:  0x9975Bb4628824540e3E722090b05E33554c9738e
The transaction that was sent to the network to deploy the pUSD Coin contract: 0xfb9d85c9dbef24e7ef4cf081f15590b14d9b54f7a17bd2eb10bae04f80e76208
Vault SC deployed to:  0xaD8aAFE5D6e74d88f079fb10A5E82a55B93CD016
The transaction that was sent to the network to deploy the Vault contract: 0x8299843dc17e2125c69eaa3ded32916f5ccfc06c73fafd9851861b4c74dcb302
✨  Done in 44.48s.
```

## Verify

```console
❯ yarn verify rinkeby 0xaD8aAFE5D6e74d88f079fb10A5E82a55B93CD016 "0x516F6C907f840A733de05b962FD7bA1E1d5f5ed8" "0x9975Bb4628824540e3E722090b05E33554c9738e" "1"                                                  ⏎
yarn run v1.22.18
$ hardhat verify --network rinkeby 0xaD8aAFE5D6e74d88f079fb10A5E82a55B93CD016 0x516F6C907f840A733de05b962FD7bA1E1d5f5ed8 0x9975Bb4628824540e3E722090b05E33554c9738e 1
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Vault.sol:Vault at 0xaD8aAFE5D6e74d88f079fb10A5E82a55B93CD016
for verification on Etherscan. Waiting for verification result...

Successfully verified contract Vault on Etherscan.
https://rinkeby.etherscan.io/address/0xaD8aAFE5D6e74d88f079fb10A5E82a55B93CD016#code
✨  Done in 40.82s.
```
