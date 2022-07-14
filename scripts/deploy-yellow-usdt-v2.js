const { ethers, upgrades } = require("hardhat");
// import { getImplementationAddress } from '@openzeppelin/upgrades-core';
const {parseEther} = require("ethers/lib/utils");

const { ecsign } = require('@ethereumjs/util')

async function main() {
	const [deployer, wallet2, wallet3] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);
	console.log("Account balance:", (await deployer.getBalance()).toString());

	const DE_BRIDGE_GATE_ADDRESS = "0x68D936Cb4723BdD38C488FD50514803f96789d2D";

	const YellowUSDTv2 = await ethers.getContractFactory("YellowUSDTv2");
	const yellowUSDTv2 = await upgrades.deployProxy(YellowUSDTv2, [DE_BRIDGE_GATE_ADDRESS]);
	await yellowUSDTv2.deployed();
	// const yellowUSDT = await YellowUSDT.attach("0x20840330E859778732e5426e23802e07152eC84B")
	// const yellowUSDT = await YellowUSDT.attach("0x20840330E859778732e5426e23802e07152eC84B")

	console.log("YellowUSDTv2 address:", yellowUSDTv2.address);

	// подписываем транзакцию с переводом средств с аккаунта deployer на другой аккаунт
	// с другого аккаунта инициализируем транзакцию
	// проверяем что токены дошли на третий аккаунт

	const TEST_AMOUNT = Math.pow(10, 6);

	const nonce = await token.nonces(wallet.address)
	const deadline = ethers.constants.MaxUint256
	const digest = await getApprovalDigest(
		yellowUSDTv2,
		{ owner: deployer.address, spender: wallet2.address, value: TEST_AMOUNT },
		nonce,
		deadline
	)

	const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(deployer.privateKey.slice(2), 'hex'))
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});