#!/bin/sh

# send 10000 USDC to the user account

USDC_ADDRESS_ARBITRUM="0xaf88d065e77c8cc2239327c5edb3a432268e5831"
USER_EOA_ARBITRUM="0xfE5361767CdBE2b114D985e96D75f553949D89a5"
USDC_WHALE="0xbb3406cd37b3d4c1f0e35c948051060d23d7ded4"
ETH_WHALE="0xf977814e90da44bfa03b6295a0616a897441acec"

RPC="http://localhost:8545"
RPC_FLAG="--rpc-url $RPC"

echo "unlocking the usdc whale"
cast rpc "anvil_impersonateAccount" $USDC_WHALE $RPC_FLAG

echo "unlocking the eth whale"
cast rpc "anvil_impersonateAccount" $ETH_WHALE $RPC_FLAG

echo "sending 10000 USDC to the user account"
cast send $USDC_ADDRESS_ARBITRUM --from $USDC_WHALE --unlocked \
  "transfer(address,uint256)" $USER_EOA_ARBITRUM 10000000000 $RPC_FLAG

echo "sending 1 ETH to the user account"
cast send --from $ETH_WHALE --unlocked $USER_EOA_ARBITRUM --value 1ether $RPC_FLAG
