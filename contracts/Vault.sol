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
        uint256 totInterestAmt;
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
    /// @notice Anyone can deposit PRIME token
    /// @dev Anyone can deposit PRIME token
    /// @param _amount PRIME token amount
    function deposit(uint256 _amount) external {
        require(_amount > 0, "amount must be positive");
        
        // read the vault data
        VaultDetails storage _vaultDetails = userMapping[_msgSender()];

        // calculate the interest
        uint256 interestAmt = 0;

        if (_vaultDetails.depositedAmt > 0 && _vaultDetails.depositedAt > 0) {
            interestAmt = _calcInterest(_vaultDetails.depositedAmt, _vaultDetails.depositedAt);
            _vaultDetails.totInterestAmt = _vaultDetails.totInterestAmt.add(interestAmt);
        }

        // set the current timestamp as latest deposit timestamp & add the amount to deposit Amt
        _vaultDetails.depositedAt = block.timestamp;
        _vaultDetails.depositedAmt = _vaultDetails.depositedAmt.add(_amount);

        // transfer PRIME token from caller to SC
        IERC20(depositToken).transferFrom(_msgSender(), address(this), _amount);

        emit DepositedPRIME(_msgSender(), _amount);
    }

    /// @notice Anyone can withdraw pUSD token as accrued interest
    /// @dev Anyone can withdraw pUSD token as accrued interest
    function withdrawPUSD() external {
        // read the vault details for the caller
        VaultDetails storage _vaultDetails = userMapping[_msgSender()];

        // calculate the interest when withdrawing pUSD after 1st/nth deposit of PRIME
        uint256 interestAmt = 0;

        if (_vaultDetails.depositedAmt > 0 && _vaultDetails.depositedAt > 0) {
            // withdraw both the pending interest since deposit of PRIME & acrued interest as per last deposit PRIME timestamp
            interestAmt = _calcInterest(_vaultDetails.depositedAmt, _vaultDetails.depositedAt).add(_vaultDetails.totInterestAmt);
        } else if (_vaultDetails.totInterestAmt > 0) {
            // withdraw only acrued interest as per last deposit PRIME timestamp
            interestAmt = _vaultDetails.totInterestAmt;
        } else {
            require(false, "No accrued interest for withdrawal");
        }

        _vaultDetails.depositedAt = block.timestamp;        // set the new timestamp & collect the accrued interest based on 1st deposit

        // reset the total interest amount as all the amount is withdrawn after this execution
        _vaultDetails.totInterestAmt = 0;
        
        IERC20(usdCoin).transfer(_msgSender(), interestAmt);

        emit WithdrawnPUSD(_msgSender());
    }

    function _calcInterest(uint256 _depositedAmt, uint256 _depositedAt) private view returns (uint256) {
        uint256 interestAmt = apy.mul(_depositedAmt).mul(block.timestamp - _depositedAt).div(365 * 24 * 3600 * 100);

        return interestAmt;
    }

    // function getInterest() public view returns (uint256) {
    //     return userMapping[_msgSender()].totInterestAmt;
    // }

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