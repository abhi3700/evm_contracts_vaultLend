import { ethers } from "hardhat";
import chai from "chai";
import {
  BigNumber,
  Contract /* , Signer */ /* , Wallet */,
  ContractFactory,
} from "ethers";
import { /* deployContract, */ solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  MAX_UINT256,
  // TIME,
  ZERO_ADDRESS,
  // asyncForEach,
  // deployContractWithLibraries,
  getCurrentBlockTimestamp,
  // getUserTokenBalance,
  // getUserTokenBalances,
  setNextTimestamp,
  // setTimestamp,
} from "./testUtils";

chai.use(solidity);
const { expect } = chai;

export function testVault(): void {
  describe("ERC20 Token contract", () => {
    // let erc20TokenAddress: string;
    // let signers: Array<Signer>;
    let owner: SignerWithAddress,
      owner2: SignerWithAddress,
      addr1: SignerWithAddress,
      addr2: SignerWithAddress,
      addr3: SignerWithAddress;
    let primeTokenContract: Contract,
      pusdCoinContract: Contract,
      vaultContract: Contract;

    beforeEach(async () => {
      // get signers
      [owner, owner2, addr1, addr2, addr3] = await ethers.getSigners();

      // ---------------------------------------------------
      // deploy PRIME token contract
      const primeTokenFactory: ContractFactory =
        await ethers.getContractFactory("ERC20Token");
      primeTokenContract = await primeTokenFactory.deploy(
        "Prime Token",
        "PRIME"
      );
      await primeTokenContract.deployed();

      // deploy pUSD token contract
      const pusdCoinFactory: ContractFactory = await ethers.getContractFactory(
        "ERC20Token"
      );
      pusdCoinContract = await pusdCoinFactory.deploy("pUSD Coin", "pUSD");
      await pusdCoinContract.deployed();

      // erc20TokenAddress = erc20TokenContract.address;
      // console.log(`ERC20 Token contract address: ${erc20TokenContract.address}`);

      // expect(erc20TokenAddress).to.not.eq(0);

      // console.log(`ERC20 Token SC owner: ${await erc20TokenContract.owner()}`);

      // deploy Vault contract
      const vaultFactory: ContractFactory = await ethers.getContractFactory(
        "Vault"
      );
      vaultContract = await vaultFactory.deploy(
        primeTokenContract.address,
        pusdCoinContract.address,
        1 // 1% APY
      );
      await vaultContract.deployed();

      // Mint some tokens (2000 PRIME) to each of addresses
      await primeTokenContract.mint(
        addr1.address,
        BigNumber.from("2000000000000000000000")
      );
      await primeTokenContract.mint(
        addr2.address,
        BigNumber.from("2000000000000000000000")
      );
      await primeTokenContract.mint(
        addr3.address,
        BigNumber.from("2000000000000000000000")
      );

      // addr1 approve PRIME tokens
      await primeTokenContract
        .connect(addr1)
        .approve(vaultContract.address, MAX_UINT256);

      // verify balance of each address
      const addresses = [addr1, addr2, addr3];
      for (let index = 0; index < addresses.length; index++) {
        expect(
          await primeTokenContract.balanceOf(addresses[index].address)
        ).to.eq(BigNumber.from("2000000000000000000000"));
      }

      // Mint some tokens (1,000,000 pUSD) to vault contract
      await pusdCoinContract.mint(
        vaultContract.address,
        BigNumber.from("1000000000000000000000000")
      );
    });

    describe("All: Ownable", async () => {
      it("Should have the correct owner", async () => {
        expect(await primeTokenContract.owner()).to.equal(owner.address);
        expect(await pusdCoinContract.owner()).to.equal(owner.address);
        expect(await vaultContract.owner()).to.equal(owner.address);
      });

      it("Owner is able to transfer ownership", async () => {
        await expect(primeTokenContract.transferOwnership(owner2.address))
          .to.emit(primeTokenContract, "OwnershipTransferred")
          .withArgs(owner.address, owner2.address);
        await expect(pusdCoinContract.transferOwnership(owner2.address))
          .to.emit(pusdCoinContract, "OwnershipTransferred")
          .withArgs(owner.address, owner2.address);
        await expect(vaultContract.transferOwnership(owner2.address))
          .to.emit(vaultContract, "OwnershipTransferred")
          .withArgs(owner.address, owner2.address);
      });
    });

    describe("All: Pausable", async () => {
      it("Owner is able to pause when NOT paused", async () => {
        await expect(primeTokenContract.pause())
          .to.emit(primeTokenContract, "Paused")
          .withArgs(owner.address);
        await expect(pusdCoinContract.pause())
          .to.emit(pusdCoinContract, "Paused")
          .withArgs(owner.address);
        await expect(vaultContract.pause())
          .to.emit(vaultContract, "Paused")
          .withArgs(owner.address);
      });

      it("Owner is able to unpause when already paused", async () => {
        primeTokenContract.pause();

        await expect(primeTokenContract.unpause())
          .to.emit(primeTokenContract, "Unpaused")
          .withArgs(owner.address);

        pusdCoinContract.pause();

        await expect(pusdCoinContract.unpause())
          .to.emit(pusdCoinContract, "Unpaused")
          .withArgs(owner.address);

        vaultContract.pause();

        await expect(vaultContract.unpause())
          .to.emit(vaultContract, "Unpaused")
          .withArgs(owner.address);
      });

      it("Owner is NOT able to pause when already paused", async () => {
        primeTokenContract.pause();

        await expect(primeTokenContract.pause()).to.be.revertedWith(
          "Pausable: paused"
        );

        pusdCoinContract.pause();

        await expect(pusdCoinContract.pause()).to.be.revertedWith(
          "Pausable: paused"
        );

        vaultContract.pause();

        await expect(vaultContract.pause()).to.be.revertedWith(
          "Pausable: paused"
        );
      });

      it("Owner is NOT able to unpause when already unpaused", async () => {
        primeTokenContract.pause();

        primeTokenContract.unpause();

        await expect(primeTokenContract.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );

        pusdCoinContract.pause();

        pusdCoinContract.unpause();

        await expect(pusdCoinContract.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );
        vaultContract.pause();

        vaultContract.unpause();

        await expect(vaultContract.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );
      });
    });

    describe("PRIME token: Mint", async () => {
      it("Succeeds when owner mints token", async () => {
        // get the balance of addr2 before mint
        const balanceAddr2Before: BigNumber =
          await primeTokenContract.balanceOf(addr2.address);

        // owner mint 1000 PRIME to addr2
        await expect(
          primeTokenContract
            .connect(owner)
            .mint(addr2.address, BigNumber.from("100000000000000000000000"))
        )
          .to.emit(primeTokenContract, "TokenMinted")
          .withArgs(addr2.address, BigNumber.from("100000000000000000000000"));

        // get the balance of addr2 after mint
        const balanceAddr2After: BigNumber = await primeTokenContract.balanceOf(
          addr2.address
        );

        expect(balanceAddr2After.sub(balanceAddr2Before)).to.eq(
          BigNumber.from("100000000000000000000000")
        );
      });

      it("Reverts when non-owner mints token", async () => {
        await expect(
          primeTokenContract.connect(addr1).mint(addr2.address, 1)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Reverts when owner mints zero token", async () => {
        await expect(
          primeTokenContract.connect(owner).mint(addr2.address, 0)
        ).to.be.revertedWith("amount must be positive");
      });

      it("Reverts when owner mints token to zero address", async () => {
        await expect(
          primeTokenContract.connect(owner).mint(ZERO_ADDRESS, 1)
        ).to.be.revertedWith("ERC20: mint to the zero address");
      });

      it("Reverts when paused", async () => {
        primeTokenContract.pause();

        // owner mint 1 wei to addr2
        await expect(
          primeTokenContract.connect(owner).mint(addr2.address, 1)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("Vault: Deposit PRIME", async () => {
      it("Succeeds when PRIME is deposited", async () => {
        // addr1 deposit 1000 PRIME
        await expect(
          vaultContract
            .connect(addr1)
            .deposit(BigNumber.from("1000000000000000000000"))
        )
          .to.emit(vaultContract, "DepositedPRIME")
          .withArgs(addr1.address, BigNumber.from("1000000000000000000000"));
      });

      it("Reverts when zero amount deposited", async () => {
        // addr1 deposit 0 PRIME
        await expect(
          vaultContract.connect(addr1).deposit(0)
        ).to.be.revertedWith("amount must be positive");
      });
    });

    describe.only("Vault: Withdraw pUSD", async () => {
      beforeEach(async () => {
        // addr1 deposit 1000 PRIME
        await expect(
          vaultContract
            .connect(addr1)
            .deposit(BigNumber.from("1000000000000000000000"))
        )
          .to.emit(vaultContract, "DepositedPRIME")
          .withArgs(addr1.address, BigNumber.from("1000000000000000000000"));

        // set time as 4 months from deposit
        const currentTimestamp = await getCurrentBlockTimestamp();
        // console.log(`${currentTimestamp}`);
        await setNextTimestamp(currentTimestamp + 12 * 30 * 24 * 3600);

        // addr1 deposit 100 PRIME after 4 months
        await expect(
          vaultContract
            .connect(addr1)
            .deposit(BigNumber.from("100000000000000000000"))
        )
          .to.emit(vaultContract, "DepositedPRIME")
          .withArgs(addr1.address, BigNumber.from("100000000000000000000"));
      });

      it("Succeeds when withdrawn pUSD after deposit of PRIME", async () => {
        // verify the deposited
        const depositedAmt = await vaultContract
          .connect(addr1)
          .getDepositedAmt();
        console.log(`Deposited Amt: ${depositedAmt}`);
        // expect(depositedAmt).to.eq(BigNumber.from("1000000000000000000000"));

        // get the pUSD balance of addr1 after withdraw pUSD
        const balance1Pre = await pusdCoinContract.balanceOf(addr1.address);
        console.log(`balance before withdraw pUSD: ${balance1Pre}`);

        // addr1 withdraw pUSD as accrued Interest from contract
        await expect(vaultContract.connect(addr1).withdrawPUSD())
          .to.emit(vaultContract, "WithdrawnPUSD")
          .withArgs(addr1.address);

        // get the pUSD balance of addr1 after withdraw pUSD
        const balance1Post = await pusdCoinContract.balanceOf(addr1.address);
        console.log(`balance after withdraw pUSD: ${balance1Post}`);

        expect(parseInt(balance1Post.sub(balance1Pre))).to.be.lessThan(
          parseInt(depositedAmt)
        );
      });
    });
  });
}
