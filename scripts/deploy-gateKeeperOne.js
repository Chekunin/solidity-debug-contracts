async function main() {
    const [deployer] = await ethers.getSigners();

    const GatekeeperOne = await ethers.getContractFactory("GatekeeperOne");
    const gatekeeperOne = await GatekeeperOne.deploy("0x7b1e437eeeb772eF6B7078244c357a79D7a0Ba14");
    console.log("gatekeeperOne address:", gatekeeperOne.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });