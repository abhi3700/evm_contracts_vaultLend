# Vault Contract

A Vault SC with PRIME token used for deposit & pUSD token as acrued Interest.

## About

* A Vault SC with PRIME token used for deposit & pUSD token as acrued Interest.
* **ARCHITECTURE**:
  * Every time when there is a deposit of PRIME, it does these:
    * resets the deposit timestamp `depositedAt` to current timestamp
    * adds the deposit amount to `depositedAmt` with the previous deposited amount.
    * calculates the accrued interest since last deposit timestamp till now & update the `totInterestAmt`.
    * `transferFrom` the deposit amount from user.
  * Every time when there is a withdrawal of pUSD, it does these:
    * resets the deposit timestamp `depositedAt` to current timestamp
    * Based on condition, calculate the pending interest since last deposit timestamp till now or the `totInterestAmt` or both.
    * reset the `totInterestAmt` to zero.
    * transfer the local interest amount as per situation to the person.
* [**Instruction**](./instruction.md).
* Get the **coverage** report [here](./reports.md#coverage).
* The Vault SC is **deployed** in Rinkeby testnet. Check the details [here](./reports.md#deployment)
* The Vault SC is **verified** in Rinkeby testnet. Check the details [here](./reports.md#verify)

## Installation

```console
yarn install
```

## Usage

### Build

```console
yarn compile
```

### Test

```console
yarn test
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```console
yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```console
yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```console
yarn lint:ts
```

### Coverage

Generate the code coverage report:

```console
yarn coverage
```

### Report Gas

See the gas usage per unit test and averate gas per method call:

```console
REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```console
yarn clean
```

### Verify

```console
yarn verify <network_name> <deployed_contract_address> <constructor params>
```

For multiple arguments, follow this [guide](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers).

### Deploy

#### localhost

```console
// on terminal-1
$ npx hardhat node

// on terminal-2
$ yarn hardhat deploy:Escrow --network localhost
```

#### ETH Testnet - Rinkeby

* Environment variables: Create a `.env` file with its values in [.env.example](./.env.example)
* Deploy the contracts

```console
yarn hardhat deploy:Escrow --network rinkeby
```

#### ETH Mainnet

* Environment variables: Create a `.env` file with its values in [.env.example](./.env.example)
* Deploy the contracts

```console
yarn hardhat deploy:Escrow --network mainnet
```
