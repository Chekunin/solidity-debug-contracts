const { expect } = require("chai");

describe("Counter contract", function () {
    let Counter;
    let hardhatCounter;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function() {
        console.log("run beforeEach")
        Counter = await ethers.getContractFactory("Counter");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatCounter = await Counter.deploy();
    });

    it("qqq", async function() {
        expect(await hardhatCounter.get()).to.equal(0);
        await hardhatCounter.inc();
        await hardhatCounter.inc();
        expect(await hardhatCounter.get()).to.equal(2);
        await hardhatCounter.dec();
        expect(await hardhatCounter.get()).to.equal(1);
    });
});