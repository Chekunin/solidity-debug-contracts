async function main() {
	const [deployer] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);
	console.log("Account balance:", (await deployer.getBalance()).toString());

	const naughtCoinAbi = [
		"function transferFrom(\n" +
		"        address from,\n" +
		"        address to,\n" +
		"        uint256 amount\n" +
		"    ) public returns (bool)",
		"function balanceOf(address account) public view returns (uint256)"
	];
	const naughtCoinAddress = "0x3305cf32670F081080BEa193cDaE591F888DE57a";
	const naughtCoinContract = new ethers.Contract(naughtCoinAddress, naughtCoinAbi, deployer);

	// todo:

	console.log("my balance is :", await naughtCoinContract.balanceOf(deployer.address))
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});