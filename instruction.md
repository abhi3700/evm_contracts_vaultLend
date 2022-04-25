# Interview Exercise: Smart Contracts

## Part 1

In this exercise, you will be depositing a token PRIME into a vault that accrues interest in PUSD and testing the functionality

1. (Contracts) (Contracts) Create an ERC-20 Token named PRIME - you can use Open Zeppelin for this
2. (Test) In a test, deploy the contract, mint 1000 PRIME tokens for a user in a test, and use expect to test that the user indeed received 1000 PRIME
3. (Contracts) Create a Vault that takes deposits of PRIME and accrues interest in PUSD over time at 1% APY. To do this, you will also need to create an ERC-20 Token named PUSD that is only mintable by the Vault.
4. (Test) In a test, deposit 1000 PRIME tokens into the Vault and ensure that interest is indeed accruing. Also check that the person is able to take out some amount of PUSD after several blocks have passed.
