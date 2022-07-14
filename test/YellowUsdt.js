const { expect } = require("chai");
const { waffle, ethers, upgrades } = require("hardhat");
const { ecsign } = require('@ethereumjs/util')

// const { getApprovalDigest } = require("../scripts/shared/utilities.ts")
const { getApprovalDigest } = require("../scripts/shared/ut.js")

describe.only("Yellow ERC-2612 Token contract", function () {
    let Token;
    let hardhatToken;
    let wallet;
    let other;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // todo: здесь деплоить через upgradable
        Token = await ethers.getContractFactory("YellowUSDTv2");
        // const [wallet, other] = ethers.Providers.Provider.getWallets();
        [wallet, other] = waffle.provider.getWallets();
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        console.log("=====")
        console.log(wallet.address)
        console.log(owner.address)
        console.log("/=====")

        const DE_BRIDGE_GATE_ADDRESS = "0x68D936Cb4723BdD38C488FD50514803f96789d2D";
        hardhatToken = await upgrades.deployProxy(Token, [DE_BRIDGE_GATE_ADDRESS]);

        await hardhatToken.deployed();
    });

    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // tests. It receives the test name, and a callback function.

        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {
            // Expect receives a value, and wraps it in an Assertion object. These
            // objects have a lot of utility methods to assert values.

            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            // expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transfer tokens", function () {
        it('permit', async function () {
            const testAmount = ethers.BigNumber.from(10).pow(6);

            const nonce = await hardhatToken.nonces(owner.address)
            const deadline = ethers.constants.MaxUint256
            // todo: где-то видимо здесь ошибку, тк подпись неправильная
            const digest = await getApprovalDigest(
                hardhatToken,
                { owner: owner.address, spender: addr1.address, value: testAmount },
                nonce,
                deadline
            )

            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

            await expect(hardhatToken.permit(owner.address, addr1.address, testAmount, deadline, v, ethers.utils.hexlify(r), ethers.utils.hexlify(s)))
                .to.emit(hardhatToken, 'Approval')
                .withArgs(wallet.address, addr1.address, testAmount)
            expect(await hardhatToken.allowance(owner.address, addr1.address)).to.eq(testAmount)
            expect(await hardhatToken.nonces(owner.address)).to.eq(ethers.BigNumber.from(1))
        })
    })
});

// https://github.com/Uniswap/v2-core/blob/master/test/UniswapV2ERC20.spec.ts
