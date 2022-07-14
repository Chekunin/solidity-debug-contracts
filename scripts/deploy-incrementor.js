const { ethers, upgrades } = require("hardhat");
// import { getImplementationAddress } from '@openzeppelin/upgrades-core';
const {parseEther} = require("ethers/lib/utils");

async function main() {
	const [deployer] = await ethers.getSigners();

	// console.log("Deploying contracts with the account:", deployer.address);
	// console.log("Account balance:", (await deployer.getBalance()).toString());
	//
	// const DE_BRIDGE_GATE_ADDRESS = "0x68D936Cb4723BdD38C488FD50514803f96789d2D";
	//
	// const Incrementor = await ethers.getContractFactory("Incrementor");
	// const incrementor = await upgrades.deployProxy(Incrementor, [DE_BRIDGE_GATE_ADDRESS]);
	// await incrementor.deployed();
	//
	// console.log("Incrementor address:", incrementor.address);


	// Incrementor old address:    0x6ab74E9acd35C3565A30078f379CD6c4A0a6b531
	// Incrementor old kovan  address:   0x6Dcdc07Fe36c529E1B672E57fC32fe979cc21571
	// Incrementor old bnb_test address: 0xE529101c6A81F04156fE44a401b936ceDC7131d0
	// Incrementor kovan address: 0x8DB0b37dA2ACa6Ab615785967c5a65B0455D3660
	// Incrementor bnb_test address: 0x427bE2Cf94c0233212E3b16d7787D5bb03442eFF


	const Incrementor = await ethers.getContractFactory("Incrementor")
	const incrementor = await Incrementor.attach("0x8DB0b37dA2ACa6Ab615785967c5a65B0455D3660")
	// await incrementor.setContractAddressOnChainId("0x8DB0b37dA2ACa6Ab615785967c5a65B0455D3660", "42");
	// await incrementor.addControllingAddress("0x427bE2Cf94c0233212E3b16d7787D5bb03442eFF", "97");

	// await incrementor.send(42, deployer.address, parseEther('0.01'), {
	// 	// executionFee + commissions + a little more
	// 	// ~0,1% + 0.01
	// 	value: parseEther('0.021'),
	// 	gasLimit: 999000
	// });

	console.log("incrementor claimedTimes =", await incrementor.claimedTimes())
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});