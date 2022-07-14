async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // const CoinFlip = await ethers.getContractFactory("CoinFlip");
    // const coinflip = await CoinFlip.deploy();
    // console.log("coinflip address:", coinflip.address);

    const CoinFlipBooster = await ethers.getContractFactory("CoinFlipBooster");
    // const coinflipbooster = await CoinFlipBooster.deploy(coinflip.address);
    const coinflipbooster = await CoinFlipBooster.deploy("0x3696eCB88D0A2F787a31353698fc261f696C688c");
    console.log("coinflipbooster address:", coinflipbooster.address);

    // здесь (в цикле) я должен вызывать метод flip у СК coinflipbooster
    for (i = 0; i < 10; i++) {
        console.log(i);
        await new Promise(r => setTimeout(r, 1000));
        res = await coinflipbooster.flip();
        if (res) {
            console.log("OK");
        } else {
            console.log("BAD");
            i -= 1;
        }
    }

    // winCount = await coinflip.consecutiveWins();
    // console.log(winCount);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });