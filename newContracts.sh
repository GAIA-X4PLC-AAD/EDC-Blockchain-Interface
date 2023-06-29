#!/bin/bash

# Set ghostnet as the default network
octez-client --endpoint https://rpc.ghostnet.teztnets.xyz/ config update

# Prompt user for contract selection
echo "Select contracts to deploy:"
echo "1. Asset Contract"
echo "2. Policy Contract"
echo "3. Contract Contract"
echo "4. Transfer Contract"
echo "Enter comma-separated numbers (e.g., 1,3):"
read selected_contracts

# Split the input by comma and remove any whitespace
IFS=',' read -ra contracts <<< "$selected_contracts"

# Function to deploy a contract
deploy_contract() {
  contract_code=$1
  storage_file=$2
  contract_name=$3

  contract_address=$(octez-client originate contract $contract_name transferring 0 from edc_account running "$(cat $contract_code)" --init "$(cat $storage_file)" --burn-cap 0.6 --force | awk '/New contract/ { print $3 }')

  echo "$contract_name originated at address: $contract_address"
}

# Deploy selected contracts
for contract_number in "${contracts[@]}"; do
  case $contract_number in
    1)
      contract_code="artifacts/assetContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/assetContract/step_000_cont_0_storage.tz"
      contract_name="assetContract"
      deploy_contract "$contract_code" "$storage_file" "$contract_name"
      ;;
    2)
      contract_code="artifacts/policyContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/policyContract/step_000_cont_0_storage.tz"
      contract_name="policyContract"
      deploy_contract "$contract_code" "$storage_file" "$contract_name"
      ;;
    3)
      contract_code="artifacts/contractContract/step_000_cont_0_contract.tz"
      storage_file="artifacts/contractContract/step_000_cont_0_storage.tz"
      contract_name="contractContract"
      deploy_contract "$contract_code" "$storage_file" "$contract_name"
      ;;
    4)
      contract_code="artifacts/transfer_logs/step_000_cont_0_contract.tz"
      storage_file="artifacts/transfer_logs/step_000_cont_0_storage.tz"
      contract_name="transferContract"
      deploy_contract "$contract_code" "$storage_file" "$contract_name"
      ;;
    *)
      echo "Invalid contract selection: $contract_number"
      ;;
  esac
done
