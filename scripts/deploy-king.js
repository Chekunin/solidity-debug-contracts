async function main() {
    const [deployer] = await ethers.getSigners();

    const King = await ethers.getContractFactory("King");
    // const king = await King.deploy("0x534104c1174A1f4d3FbA6b1Eef34431F2B4945F7", {value: "20000000000000000", gasLimit: "200000000"});
    const king = await King.deploy("0x534104c1174A1f4d3FbA6b1Eef34431F2B4945F7");
    await king.deployed()
    console.log("king address:", king.address);
    console.log("king balance:", await ethers.provider.getBalance(king.address));
    console.log("deployer address:", deployer.address);
    console.log("deployer balance:", await deployer.getBalance());
    // tx = await deployer.sendTransaction({to: force.address, value: ethers.utils.parseEther("0.001")});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// https://ethernaut.openzeppelin.com/level/0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea
// https://github.com/STYJ/Ethernaut-Solutions