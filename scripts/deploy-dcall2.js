async function main() {
    const [deployer] = await ethers.getSigners();

    const DCall2 = await ethers.getContractFactory("DCall2");
    const dcall2 = await DCall2.deploy("0xAE067c1dd0E4b98e62eDd7c4C04aaf200Fc3c498");
    console.log("DCall2 address:", dcall2.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });