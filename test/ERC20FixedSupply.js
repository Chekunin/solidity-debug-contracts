const { expect } = require("chai");

describe("ERC20FixedSupply contract", function () {
    let ERC20FixedSupply;
    let hardhatERC20FixedSupply;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function() {
        console.log("run beforeEach")
        ERC20FixedSupply = await ethers.getContractFactory("ERC20FixedSupply");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatERC20FixedSupply = await ERC20FixedSupply.deploy();
    });

    it("www", async function() {
        qwe = await hardhatERC20FixedSupply.balanceOf(owner.address);
        console.log(qwe)
        await hardhatERC20FixedSupply.transfer(addr1.address, 10);
        qwe = await hardhatERC20FixedSupply.balanceOf(owner.address);
        console.log(qwe)
        qwe = await hardhatERC20FixedSupply.balanceOf(addr1.address);
        console.log(qwe)
    });
});