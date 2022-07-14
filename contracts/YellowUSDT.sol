// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./BridgeAppBase.sol";
import "./IDeBridgeGate.sol";

/// @custom:security-contact mistin7@gmail.com
contract YellowUSDT is ERC20Upgradeable, ERC20BurnableUpgradeable, AccessControlUpgradeable, BridgeAppBase {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // --- bridge ---
    using Flags for uint256;

    function initialize(IDeBridgeGate _deBridgeGate) external initializer {
        __ERC20_init("YellowUSDT", "yUSDT");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        __BridgeAppBase_init(_deBridgeGate);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }

    function transferCrossChain(address to, uint256 amount, uint256 toChainId) public payable returns (bool) {
        address owner = _msgSender();
        if (toChainId == block.chainid) {
            _transfer(owner, to, amount);
            return true;
        }
        burn(amount);
        _send(toChainId, to, amount, address(this), 0);
        return true;
    }

    // --- bridge ---
    /// @param _toChainId Receiving chain id
    /// @param _fallback Address to call in case call to _receiver reverts and to send deTokens
    /// @param _executionFee Fee to pay (in native token)
    function _send(
        uint256 _toChainId,
        address _to,
        uint256 _amount,
        address _fallback,
        uint256 _executionFee
    ) public payable whenNotPaused {
        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.flags = autoParams.flags.setFlag(Flags.REVERT_IF_EXTERNAL_FAIL, true);
        autoParams.flags = autoParams.flags.setFlag(Flags.PROXY_WITH_SENDER, true);
        autoParams.executionFee = _executionFee;
        autoParams.fallbackAddress = abi.encodePacked(_fallback);
        autoParams.data = abi.encodeWithSignature("mint(address,uint256)", _to, _amount);

        address contractAddressTo = chainIdToContractAddress[_toChainId];
        if (contractAddressTo == address(0)) {
            revert ChainToIsNotSupported();
        }

        deBridgeGate.send{value: msg.value}(
            address(0),
            msg.value,
            _toChainId,
            abi.encodePacked(contractAddressTo),
            "",
            false,
            0,
            abi.encode(autoParams)
        );
    }
    // --- /bridge ---
}
