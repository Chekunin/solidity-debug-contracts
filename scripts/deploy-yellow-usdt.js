const { ethers, upgrades } = require("hardhat");
// import { getImplementationAddress } from '@openzeppelin/upgrades-core';
const {parseEther} = require("ethers/lib/utils");

// kovan_old (42) address:    0x74bCf93E0e2d2F2130Ca95048c69f4a0507F673d
// bnb_test_old (97) address: 0x0EB5e050147e72c809E8e459C1409E3aCf057600

// async function main() {
// 	const [deployer] = await ethers.getSigners();
//
// 	console.log("Deploying contracts with the account:", deployer.address);
// 	console.log("Account balance:", (await deployer.getBalance()).toString());
//
// 	// kovan address:    0x32f4f308a658c887F01aBcb1c8E212bc80d794eF
// 	// bnb_test address: 0xf19bc138De4905e895819214120e962fD3c81A63
//
// 	const DE_BRIDGE_GATE_ADDRESS = "0x68D936Cb4723BdD38C488FD50514803f96789d2D";
//
// 	const YellowUSDT = await ethers.getContractFactory("YellowUSDT");
// 	// const yellowUSDT = await YellowUSDT.deploy();
// 	const yellowUSDT = await YellowUSDT.attach("0xf19bc138De4905e895819214120e962fD3c81A63")
//
// 	// await yellowUSDT.mint("0x83281dC8ba163a0Aa803e794184ffd504409E947", 100000000);
//
// 	await yellowUSDT.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), DE_BRIDGE_GATE_ADDRESS)
//
// 	// console.log("Token address:", token.address);
// 	console.log("YellowUSDT address:", yellowUSDT.address);
// }

async function main() {
	const [deployer] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);
	console.log("Account balance:", (await deployer.getBalance()).toString());

	const DE_BRIDGE_GATE_ADDRESS = "0x68D936Cb4723BdD38C488FD50514803f96789d2D";

	const YellowUSDT = await ethers.getContractFactory("YellowUSDT");
	// const yellowUSDT = await upgrades.deployProxy(YellowUSDT, [DE_BRIDGE_GATE_ADDRESS]);
	// await yellowUSDT.deployed();
	// const yellowUSDT = await YellowUSDT.attach("0x20840330E859778732e5426e23802e07152eC84B")
	const yellowUSDT = await YellowUSDT.attach("0x20840330E859778732e5426e23802e07152eC84B")

	console.log("YellowUSDT address:", yellowUSDT.address);

	// kovan (42) address:    0x20840330E859778732e5426e23802e07152eC84B
	// bnb_test (97) address: 0x63Cf10f53d3ea1d6359A5287f2AC6Ed913629825

	// await yellowUSDT.setContractAddressOnChainId("0x20840330E859778732e5426e23802e07152eC84B", "42");
	// await yellowUSDT.addControllingAddress("0x20840330E859778732e5426e23802e07152eC84B", "42", {gasLimit: 999000});
	// console.log(await yellowUSDT.isAddressFromChainIdControlling("41", "0x20840330E859778732e5426e23802e07152eC84B"));

	// await yellowUSDT.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), DE_BRIDGE_GATE_ADDRESS)
	// await yellowUSDT.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), "0xEF3B092e84a2Dbdbaf507DeCF388f7f02eb43669")
	// console.log(await yellowUSDT.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), DE_BRIDGE_GATE_ADDRESS));

	// await yellowUSDT.mint("0x83281dC8ba163a0Aa803e794184ffd504409E947", 100000000);

	// 0x83281dC8ba163a0Aa803e794184ffd504409E947
	// 0xA35438d640f3f874d574c112a78C2d004309BcA8
	console.log(await yellowUSDT.transferCrossChain("0xA35438d640f3f874d574c112a78C2d004309BcA8", 3000000, 97, {
		// 	// executionFee + commissions + a little more
		// 	// ~0,1% + 0.01
			value: parseEther('0.021'),
			gasLimit: 999000
		}));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});