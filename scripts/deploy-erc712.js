async function main() {
	const [deployer] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);
	console.log("Account balance:", (await deployer.getBalance()).toString());

	// 0x984265b9a803e1231f928ccb2f6b4a2ab688b8baef032146e340992976e3997651c955945ffb2a84ffd2b41b0254a513d65f00633fd3bf3bbed2b862ac07da2c1b
	signature = await sign123(deployer);
	const { r, s, v } = ethers.utils.splitSignature(signature);
	console.log("signature r,s,v:", r, s, v);
}

async function sign123(signer) {
	// All properties on a domain are optional
	const domain = {
		name: 'Ether Mail',
		version: '1',
		chainId: await signer.getChainId(),
		verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
	};

	// The named list of all type definitions
	const types = {
		// Person: [
		// 	{ name: 'name', type: 'string' },
		// 	{ name: 'wallet', type: 'address' }
		// ],
		// Mail: [
		// 	{ name: 'from', type: 'Person' },
		// 	{ name: 'to', type: 'Person' },
		// 	{ name: 'contents', type: 'string' }
		// ],
		TestOne: [
			{ name: "sender", type: 'address'},
			{ name: "first_name", type: 'string'},
			{ name: "last_name", type: 'string'}
		]
	};

	// The data to sign
	// const value = {
	// 	from: {
	// 		name: 'Cow',
	// 		wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
	// 	},
	// 	to: {
	// 		name: 'Bob',
	// 		wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
	// 	},
	// 	contents: 'Hello, Bob!'
	// };

	const value = {
		sender: signer.address,
		first_name: "Aleksei",
		last_name: "Chekunin",
	}

	signature = await signer._signTypedData(domain, types, value);

	// --------
	const EIP712typeHash = ethers.utils.id(
		"EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
	)

	abiCoder = new ethers.utils.AbiCoder();
	const domainSeparator = ethers.utils.keccak256(
		abiCoder.encode(
			["bytes32", "bytes32", "bytes32", "uint256", "address"],
			[
				EIP712typeHash,
				ethers.utils.id(domain.name),
				ethers.utils.id(domain.version),
				domain.chainId,
				domain.verifyingContract,
			]
		)
	);

	const permitTypeHash = ethers.utils.id(
		// "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
		"TestOne(address sender,string first_name,string last_name)"
	);

	const structHash = ethers.utils.keccak256(
		abiCoder.encode(
			["bytes32", "address", "bytes32", "bytes32"],
			[
				permitTypeHash,
				value.sender,
				ethers.utils.id(value.first_name),
				ethers.utils.id(value.last_name)
			]
		)
	);

	const digest = ethers.utils.keccak256(
		ethers.utils.solidityPack(
			["string", "bytes32", "bytes32"],
			["\x19\x01", domainSeparator, structHash]
		)
	);

	const signer2 = ethers.utils.recoverAddress(digest, signature);
	console.log(signer.address, signer2);
	return signature;
	// /-------

	const msgHash = ethers.utils.hashMessage({domain, types, value});
	// const msgHash = ethers.utils.hashMessage(JSON.stringify({domain, types, value}));
	const msgHashBytes = ethers.utils.arrayify(msgHash);
	console.log("recovered address:", ethers.utils.recoverAddress(msgHashBytes, signature));

	return signature;
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});