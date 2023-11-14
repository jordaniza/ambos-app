#!/bin/bash

USDC="0xda5289fcaaf71d52a80a254da614a192b693e977"
FAUCET="0xad5b33d6da375e4728e9e11756bd7ea704d1a9b3"
RPC="--rpc-url https://rpc.ankr.com/polygon_mumbai"
RECIPIENT="0x7511c21a31f87593914d22ddeea22155680bda85"
PRIVATE_KEY="76bee493828d09d2dda5f26d31b83974a3b3fb11988a3114f76269512801559e"

## READ THE PRIVATE KEY FROM THE .env FILE

# The path to the .env file
ENV_FILE=".env"

# # Check if the .env file exists
# if [[ ! -f "$ENV_FILE" ]]; then
#   echo ".env file does not exist in the root directory."
#   exit 1
# fi

# # Export the variables in the .env file
# export $(grep -v '^#' "$ENV_FILE" | xargs)

# # Check if PRIVATE_KEY variable is set
# if [[ -z "${PRIVATE_KEY}" ]]; then
#   echo "PRIVATE_KEY is not set in the .env file."
#   exit 1
# else
#   echo "PRIVATE_KEY is set."
#   # Do whatever you need with the PRIVATE_KEY variable here
#   # For example, you can echo it (be careful with sensitive data)
#   # echo $PRIVATE_KEY
# fi
#
cast send $FAUCET --private-key $PRIVATE_KEY \
  "getTokens(address)" $USDC $RPC
