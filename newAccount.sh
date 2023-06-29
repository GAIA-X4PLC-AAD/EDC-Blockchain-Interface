#!/bin/bash

# Set ghostnet as the default network
octez-client --endpoint https://rpc.ghostnet.teztnets.xyz/ config update

# Generate a new account using the octez-client
account_name="edc-account"

octez-client gen keys $account_name

echo "New account generated"
octez-client show address $account_name

# Link to a website
echo "Visit https://faucet.ghostnet.teztnets.xyz to fund your account"

