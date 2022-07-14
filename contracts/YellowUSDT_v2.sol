// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

//import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./BridgeAppBase.sol";
import "./IDeBridgeGate.sol";

/// @custom:security-contact mistin7@gmail.com
contract YellowUSDTv2 is ERC20Upgradeable, ERC20BurnableUpgradeable, AccessControlUpgradeable, BridgeAppBase {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 public DOMAIN_SEPARATOR;
    // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    mapping(address => uint) public nonces;

    // --- bridge ---
    using Flags for uint256;

    function initialize(IDeBridgeGate _deBridgeGate) external initializer {
        __ERC20_init("YellowUSDT", "yUSDT");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        __BridgeAppBase_init(_deBridgeGate);

        uint chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                keccak256(bytes(name())),
                keccak256(bytes('1')),
                chainId,
                address(this)
            )
        );
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

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        uint chainId;
        assembly {
            chainId := chainid()
        }
//        console.log("chainId=%s", chainId);

//        console.logBytes32(DOMAIN_SEPARATOR);


        require(deadline >= block.timestamp, 'YellowPayment: EXPIRED');
        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline))
            )
        );
        address recoveredAddress = ecrecover(digest, v, r, s);
//        console.log("recoveredAddress = %s", recoveredAddress);
//        console.log("owner = %s", owner);
        require(recoveredAddress != address(0) && recoveredAddress == owner, 'YellowPayment: INVALID_SIGNATURE');
        _approve(owner, spender, value);
    }
}
