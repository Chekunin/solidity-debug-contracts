const { expect } = require("chai");

describe("DCall contract", function () {
    let DCall;
    let hardhatDCall;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function() {
        console.log("run beforeEach")
        DCall = await ethers.getContractFactory("DCall2");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatDCall = await DCall.deploy();
    });

    it("DCall ---", async function() {
        console.log("111")
    });
});