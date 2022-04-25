// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "hardhat/console.sol";

/// @title A Vault SC
/// @author abhi3700
/// @notice A ERC20 Token
/// @dev A ERC20 token
contract Vault is Ownable, Pausable {

    using SafeMath for uint256;
    // ==========State variables====================================
    address public depositToken;

    address public usdCoin;

    uint256 public apy;

    struct VaultDetails {
        uint256 depositedAt;
        uint256 depositedAmt;
        // uint256 totInterestAmt;
        // uint256 withdrawableAmt;
    }
    mapping(address => VaultDetails) private userMapping;

    // ==========Events=============================================
    event DepositedPRIME(address indexed depositor, uint256 amount);
    event WithdrawnPUSD(address indexed withdrawer);

    // ==========Constructor========================================
    constructor(address _token, address _usdcoin, uint256 _apy){
        depositToken = _token;
        usdCoin = _usdcoin;
        apy = _apy;
    }

    // ==========Functions==========================================
    function deposit(uint256 _amount) external {
        require(_amount > 0, "amount must be positive");
        
        userMapping[_msgSender()].depositedAt = block.timestamp;
        userMapping[_msgSender()].depositedAmt = _amount;

        // transfer from caller to SC
        IERC20(depositToken).transferFrom(_msgSender(), address(this), _amount);

        emit DepositedPRIME(_msgSender(), _amount);
    }

    function withdrawPUSD() external {
        uint256 _depositAmt = userMapping[_msgSender()].depositedAmt;
        require(_depositAmt > 0, "No amount deposited");

        uint256 interestAmt = getInterest(_depositAmt);

        IERC20(usdCoin).transfer(_msgSender(), interestAmt);

        emit WithdrawnPUSD(_msgSender());
    }

    function getInterest(uint256 _depositAmt) public view returns (uint256) {
        uint256 interestAmt = apy.mul(_depositAmt).mul(block.timestamp - userMapping[_msgSender()].depositedAt).div(365 * 24 * 3600 * 100);

        return interestAmt;
    }

    function getDepositedAmt() public view returns (uint256) {
        return userMapping[_msgSender()].depositedAmt;
    }


    // ------------------------------------------------------------------------------------------
    /// @notice Pause contract 
    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    /// @notice Unpause contract
    function unpause() public onlyOwner whenPaused {
        _unpause();
    }


}