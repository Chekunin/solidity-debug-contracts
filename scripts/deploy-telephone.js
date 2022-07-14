async function main() {
    const [deployer] = await ethers.getSigners();

    const Telephone = await ethers.getContractFactory("Telephone");
    const telephone = await Telephone.deploy("0x902Fe351c387BFC035699E7b897a1D66EB224cef");
    console.log("Telephone address:", telephone.address);
    await telephone.change("0x83281dC8ba163a0Aa803e794184ffd504409E947");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });