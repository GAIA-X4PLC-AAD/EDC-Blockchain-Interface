#!/bin/bash

# Set ghostnet as the default network
docker exec octez-node-alpha octez-client --endpoint https://rpc.ghostnet.teztnets.xyz/ config update #2>/dev/null

# Generate a new account using the octez-client
account_name="edc-account"

docker exec octez-node-alpha octez-client gen keys $account_name --force #2>/dev/null

echo "New account generated"

docker exec octez-node-alpha octez-client show address $account_name

# Link to a website
echo "Visit https://faucet.ghostnet.teztnets.xyz to fund your account"

