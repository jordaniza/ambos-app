import type { ethers } from 'ethers';

const failed = {
	receipt: {
		to: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
		from: '0x3540B9De3C81B87D565884D4B73e3a48465744e6',
		contractAddress: null,
		transactionIndex: 1,
		gasUsed: {
			_hex: '0x0190aa',
			_isBigNumber: true
		},
		logsBloom:
			'0x000000000000000000000000000000000000000000000000000000000000000000080000000000000002000101000000001000000000000000000220000000000000000000000000000000020000000000000000000400000000000000002000000000000a0000000000000000000800000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000002000000000000000000000000000001000000001000000000000000000000000000008020000040000000000000000000000000000000000000000000000000000000000000',
		blockHash: '0xc56aab3384be9f76ced148208878baad930bc72b426d72ea90530e7c471f37b7',
		transactionHash: '0xcaabf74942ccfaa5883139773d9a996a138a1d0e2ae16424845f16fd96531b92',
		logs: [
			{
				transactionIndex: 1,
				blockNumber: 57519047,
				transactionHash: '0xcaabf74942ccfaa5883139773d9a996a138a1d0e2ae16424845f16fd96531b92',
				address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
				topics: [
					'0x2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c4',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x0000000000000000000000000000000000000000000000000000112cf5cbb000',
				logIndex: 0,
				blockHash: '0xc56aab3384be9f76ced148208878baad930bc72b426d72ea90530e7c471f37b7'
			},
			{
				transactionIndex: 1,
				blockNumber: 57519047,
				transactionHash: '0xcaabf74942ccfaa5883139773d9a996a138a1d0e2ae16424845f16fd96531b92',
				address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
				topics: ['0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972'],
				data: '0x',
				logIndex: 1,
				blockHash: '0xc56aab3384be9f76ced148208878baad930bc72b426d72ea90530e7c471f37b7'
			},
			{
				transactionIndex: 1,
				blockNumber: 57519047,
				transactionHash: '0xcaabf74942ccfaa5883139773d9a996a138a1d0e2ae16424845f16fd96531b92',
				address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
				topics: [
					'0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f',
					'0x0d0fac3e3d2f377bec062f5eed52248b04bedbd221be1c890d87a656c4aa9b90',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x0000000000000000000000000000000000000000000000000000000000000000'
				],
				data: '0x0000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d93edbdea00000000000000000000000000000000000000000000000000000000000002472a',
				logIndex: 2,
				blockHash: '0xc56aab3384be9f76ced148208878baad930bc72b426d72ea90530e7c471f37b7'
			}
		],
		blockNumber: 57519047,
		confirmations: 1,
		cumulativeGasUsed: {
			_hex: '0x0190aa',
			_isBigNumber: true
		},
		effectiveGasPrice: {
			_hex: '0x05f5e100',
			_isBigNumber: true
		},
		status: 1,
		type: 2,
		byzantium: true
	}
};

const succeeded = {
	receipt: {
		to: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
		from: '0x125Ad1988Cf1Ec8c2Dd7357621ad825603768365',
		contractAddress: null,
		transactionIndex: 1,
		gasUsed: {
			_hex: '0x06c5c0',
			_isBigNumber: true
		},
		logsBloom:
			'0x000000000000000020000000000011000000002000000000000000000000200000080000000000000042000101040000001000000000000400000220002000000000001000000000000400080000000000000020000000000000000480002000000000002a0000000000000000000800000000000100000000000014000200000090004000000000000000000000000008000001000000080800000004000000020000000000000000400000000000000000000000000000000002000000010082040002000181000001002044001000002001000000040000000000010020000250000000000000000000000001000040000000400000600008400008000080',
		blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95',
		transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
		logs: [
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
				topics: [
					'0x2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c4',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x00000000000000000000000000000000000000000000000000003a95106b3700',
				logIndex: 0,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
				topics: ['0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972'],
				data: '0x',
				logIndex: 1,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x4284186b053ACdBA28E8B26E99475d891533086a',
				topics: [
					'0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x000000000000000000000000000000000000000000000000002386f26fc10000',
				logIndex: 2,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x4284186b053ACdBA28E8B26E99475d891533086a',
				topics: [
					'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x00000000000000000000000020fa38a4f8af2e36f1cc14caad2e603fba5c535c'
				],
				data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
				logIndex: 3,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c',
				topics: [
					'0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a',
					'0x0000000000000000000000004284186b053acdba28e8b26e99475d891533086a'
				],
				data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a723dc6b40b8a9a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033b2e3c9fd0803ce80000000000000000000000000000000000000000000000033b2e3c9fd0803ce8000000',
				logIndex: 4,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x4284186b053ACdBA28E8B26E99475d891533086a',
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x000000000000000000000000878092a3313bd2437ffbb6dc43638c0a1cd0a8d2'
				],
				data: '0x000000000000000000000000000000000000000000000000002386f26fc10000',
				logIndex: 5,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x878092a3313bD2437ffbb6dC43638C0a1Cd0A8D2',
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					'0x0000000000000000000000000000000000000000000000000000000000000000',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x000000000000000000000000000000000000000000000000002386f26fc10000',
				logIndex: 6,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x878092a3313bD2437ffbb6dC43638C0a1Cd0A8D2',
				topics: [
					'0x458f5fa412d0f69b08dd84872b0215675cc67bc1d5b6fd93300a1c3878b86196',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033b2e3c9fd0803ce8000000',
				logIndex: 7,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c',
				topics: [
					'0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61',
					'0x0000000000000000000000004284186b053acdba28e8b26e99475d891533086a',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x0000000000000000000000000000000000000000000000000000000000000000'
				],
				data: '0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5000000000000000000000000000000000000000000000000002386f26fc10000',
				logIndex: 8,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0xeF7D160a47bbe2dF4c2Ca893036e7Cf690415466',
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					'0x0000000000000000000000000000000000000000000000000000000000000000',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x0000000000000000000000000000000000000000000000000000000001344660',
				logIndex: 9,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0xeF7D160a47bbe2dF4c2Ca893036e7Cf690415466',
				topics: [
					'0x458f5fa412d0f69b08dd84872b0215675cc67bc1d5b6fd93300a1c3878b86196',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x00000000000000000000000000000000000000000000000000000000013446600000000000000000000000000000000000000000000000000000000000000c200000000000000000000000000000000000000000033b373ebb63d8fae6ec888f',
				logIndex: 10,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c',
				topics: [
					'0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a',
					'0x000000000000000000000000d513e4537510c75e24f941f159b7cafa74e7b3b9'
				],
				data: '0x000000000000000000000000000000000000000000001898e89bef39fc9fd3450000000000000000000000000000000000000000003a617cc80f5c5ee1b7e30a0000000000000000000000000000000000000000000037c2306971398a062c940000000000000000000000000000000000000000033b329689f1c2c42826b13d0000000000000000000000000000000000000000033b373ebb63d8fae6ec888f',
				logIndex: 11,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0xd513E4537510C75E24f941f159B7CAFA74E7B3B9',
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					'0x000000000000000000000000c68ee187eb44227dceab89ce789193027887a30d',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5'
				],
				data: '0x0000000000000000000000000000000000000000000000000000000001343a40',
				logIndex: 12,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c',
				topics: [
					'0xb3d084820fb1a9decffb176436bd02558d15fac9b0ddfed8c465bc7359d7dce0',
					'0x000000000000000000000000d513e4537510c75e24f941f159b7cafa74e7b3b9',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x0000000000000000000000000000000000000000000000000000000000000000'
				],
				data: '0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e50000000000000000000000000000000000000000000000000000000001343a4000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000037c2306971398a062c94',
				logIndex: 13,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0xd513E4537510C75E24f941f159B7CAFA74E7B3B9',
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x000000000000000000000000fe5361767cdbe2b114d985e96d75f553949d89a5'
				],
				data: '0x0000000000000000000000000000000000000000000000000000000000030d40',
				logIndex: 14,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			},
			{
				transactionIndex: 1,
				blockNumber: 57515143,
				transactionHash: '0x05e5c4111aece8f1e5701b8c74f37e7d56a35b9e9120dc060526d7e3d460878b',
				address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
				topics: [
					'0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f',
					'0x7af78c2f16304334138c7b7db4290c7ed8641ff2596c0eedc8ef9558338b7b30',
					'0x000000000000000000000000b18049b7148720880edc91f0eaf9f7de36ea33e5',
					'0x0000000000000000000000000000000000000000000000000000000000000000'
				],
				data: '0x000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000371fb3cbed000000000000000000000000000000000000000000000000000000000000093f8d',
				logIndex: 15,
				blockHash: '0x1897f97cb3bb861ebf924774940429bd4c70d4cc487f4170f4ceffcfe234de95'
			}
		],
		blockNumber: 57515143,
		confirmations: 1,
		cumulativeGasUsed: {
			_hex: '0x06c5c0',
			_isBigNumber: true
		},
		effectiveGasPrice: {
			_hex: '0x05f5e100',
			_isBigNumber: true
		},
		status: 1,
		type: 2,
		byzantium: true
	}
};

export default {
	failed,
	succeeded
};