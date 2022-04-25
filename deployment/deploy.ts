// import { ethers } from "hardhat";
// import { Contract, ContractFactory /* , BigNumber */ } from "ethers";
// import { config as dotenvConfig } from "dotenv";
// import { resolve } from "path";
// dotenvConfig({ path: resolve(__dirname, "./.env") });

// async function main(): Promise<void> {
//   // ==============================================================================
//   // We get the token contract to deploy
//   const Erc20TokenFactory = await ethers.getContractFactory("ERC20Token");
//    erc20TokenContract = await Erc20TokenFactory.deploy(
//      "Health Token",
//      "HLT"
//    );
//   await erc20TokenContract.deployed();
//   console.log("ERC20 token SC deployed to: ", erc20TokenContract.address);
//   console.log(
//     `The transaction that was sent to the network to deploy the erc20 token contract: ${erc20TokenContract.deployTransaction.hash}`
//   );
// }

// // // We recommend this pattern to be able to use async/await everywhere
// // // and properly handle errors.
// main()
//   .then(() => new Error("Exit: 0"))
//   .catch((error: Error) => {
//     console.error(error);
//     // process.exit(1);
//     throw new Error("Exit: 1");
//   });

// M-2
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { Contract, ContractFactory /* , BigNumber */ } from "ethers";

task("deploy:All", "Deploy Vault Contract").setAction(async function (
  taskArguments: TaskArguments,
  { ethers }
) {
  // deploy PRIME token contract
  const primeTokenFactory: ContractFactory = await ethers.getContractFactory(
    "ERC20Token"
  );
  const primeTokenContract: Contract = await primeTokenFactory.deploy(
    "Prime Token",
    "PRIME"
  );
  await primeTokenContract.deployed();
  console.log("PRIME token SC deployed to: ", primeTokenContract.address);
  console.log(
    `The transaction that was sent to the network to deploy the PRIME token contract: ${primeTokenContract.deployTransaction.hash}`
  );

  // deploy pUSD Coin contract
  const pusdCoinFactory: ContractFactory = await ethers.getContractFactory(
    "ERC20Token"
  );
  const pusdCoinContract: Contract = await pusdCoinFactory.deploy(
    "pUSD Coin",
    "pUSD"
  );

  await pusdCoinContract.deployed();
  console.log("pUSD Coin SC deployed to: ", pusdCoinContract.address);
  console.log(
    `The transaction that was sent to the network to deploy the pUSD Coin contract: ${pusdCoinContract.deployTransaction.hash}`
  );

  // deploy Vault contract
  const vaultFactory: ContractFactory = await ethers.getContractFactory(
    "Vault"
  );
  const vaultContract: Contract = await vaultFactory.deploy(
    primeTokenContract.address,
    pusdCoinContract.address,
    1 // 1% APY
  );
  await vaultContract.deployed();
  console.log("Vault SC deployed to: ", vaultContract.address);
  console.log(
    `The transaction that was sent to the network to deploy the Vault contract: ${vaultContract.deployTransaction.hash}`
  );
});
