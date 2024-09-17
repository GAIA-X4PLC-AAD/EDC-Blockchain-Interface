#!/bin/bash

# Set ghostnet as the default network and redirect warnings to /dev/null


#docker exec octez-node-alpha octez-client --endpoint https://rpc.ghostnet.teztnets.com/ config update #2>/dev/null
docker exec octez-node-alpha octez-client --endpoint https://rpc.ghostnet.teztnets.com/ config update 2>/dev/null

# Prompt user for contract selection
echo "Select contracts to deploy:"
echo "1. Asset Contract"
echo "2. Policy Contract"
echo "3. Contract Contract"
echo "4. Whitelist Contract"
echo "Enter comma-separated numbers (e.g., 1,4):"
read selected_contracts

# Split the input by comma and remove any whitespace
IFS=',' read -ra contracts <<< "$selected_contracts"

# Function to deploy a contract
deploy_contract() {
  contract_code=$1
  storage_file=$2
  contract_name=$3

  echo -e "\nDeploying $contract_name..."

  contract_address=$(docker exec octez-node-alpha octez-client originate contract $contract_name transferring 0 from edc-account running "$(cat $contract_code)" --init "$(cat $storage_file)" --burn-cap 0.6 --force 2>/dev/null | awk '/New contract/ { print $3 }')
  #contract_address=$(docker exec octez-node-alpha octez-client originate contract $contract_name transferring 0 from edc-account running "$(cat $contract_code)" --init "$(cat $storage_file)" --burn-cap 0.6 --force | awk '/New contract/ { print $3 }')

  echo -e "\n$contract_name originated at address: $contract_address"
}

# Function for loading animation
loading_animation() {
  local pid=$1
  local delay=0.15
  local spin_chars="/-\|"
  local i=0

  while kill -0 $pid 2>/dev/null; do
    printf "\r[${spin_chars:i++%${#spin_chars}:1}] Deploying contracts..."
    sleep $delay
  done
}

# Deploy selected contracts synchronously
for contract_number in "${contracts[@]}"; do
  case $contract_number in
    1)
      contract_code="artifacts/assetContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/assetContract/step_000_cont_0_storage.tz"
      contract_name="assetContract"
      (deploy_contract "$contract_code" "$storage_file" "$contract_name") &
      loading_animation $!
      ;;
    2)
      contract_code="artifacts/policyContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/policyContract/step_000_cont_0_storage.tz"
      contract_name="policyContract"
      (deploy_contract "$contract_code" "$storage_file" "$contract_name") &
      loading_animation $!
      ;;
    3)
      contract_code="artifacts/contractContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/contractContract/step_000_cont_0_storage.tz"
      contract_name="contractContract"
      (deploy_contract "$contract_code" "$storage_file" "$contract_name") &
      loading_animation $!
      ;;
    4)
      contract_code="artifacts/whitelistContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/whitelistContract/step_000_cont_0_storage.tz"
      contract_name="WhitelistContract"
      (deploy_contract "$contract_code" "$storage_file" "$contract_name") &
      loading_animation $!
      ;;
    *)
      echo "Invalid contract selection: $contract_number"
      ;;
  esac
  echo
done

