#!/bin/sh

echo "Originating Asset Contract"
~/smartpy-cli/SmartPy.sh originate-contract \
    --code /Users/johann/Documents/Code/GAIA/edc-interface/artifacts/assetContract/step_000_cont_0_contract.tz \
    --storage /Users/johann/Documents/Code/GAIA/edc-interface/artifacts/assetContract/step_000_cont_0_storage.tz \
    --rpc https://rpc.ghostnet.teztnets.xyz | awk '/Contract/ {print$4}'

echo "Originating Policy Contract"
~/smartpy-cli/SmartPy.sh originate-contract \
    --code /Users/johann/Documents/Code/GAIA/edc-interface/artifacts/policyContract/step_000_cont_0_contract.tz \
    --storage /Users/johann/Documents/Code/GAIA/edc-interface/artifacts/policyContract/step_000_cont_0_storage.tz \
    --rpc https://rpc.ghostnet.teztnets.xyz/ | awk '/Contract/ {print$4}'

echo "Originating cotract offer contract"
~/smartpy-cli/SmartPy.sh originate-contract \
    --code /Users/johann/Documents/Code/GAIA/edc-interface/artifacts/contractContract/step_000_cont_0_contract.tz \
    --storage /Users/johann/Documents/Code/GAIA/edc-interface/artifacts/contractContract/step_000_cont_0_storage.tz \
    --rpc https://rpc.ghostnet.teztnets.xyz/ | awk '/Contract/ {print$4}'
