# EDC Interface

## IPFS Setup

In order to pin content to the IPFS you must include your Pinata API credentials in the form of environment parameters:

1. Create a file in root directory called ".env"
2. Add your [Pinata key](https://knowledge.pinata.cloud/en/articles/6191471-how-to-create-an-pinata-api-key) as a variable (the JWT key):
   ```
   PINATA_KEY="<JWT key>"
   ```
3. Optionally: Add your own smart contract addresses as env variables
   - ASSET_ADDRESS
   - POLICY_ADDRESS
   - CONTRACT_ADDRESS
   - TRANSFER_ADDRESS
   - AGREEMENT_ADDRESS

## Run the Tezos Client

First, make sure all dependencies are installed:

```
npm install
```

Run the server locally:

```
npm run serve
```

## Swagger Documentation

The documentation can be viewed on http://localhost:3000/docs when server runs.

## Contract Information

Metadata of FA2 contracts is generated with the support of @taqueria/plugin-metadata feature to comply with TZIP-16 standard.

Following smart contracts were originated and can be used for minting by default:

- FA2 Asset Contract: [KT1N3iJne4jFnQz4tdHBz5q7Cd8Wmd6XtZSH](https://better-call.dev/ghostnet/KT1N3iJne4jFnQz4tdHBz5q7Cd8Wmd6XtZSH/tokens)
- FA2 Policy Contract: [KT1J7FvNLo2yQSUm7jcm2wzNHDBhR19Y5dJ9](https://better-call.dev/ghostnet/KT1J7FvNLo2yQSUm7jcm2wzNHDBhR19Y5dJ9/tokens)
- FA2 Contract Contract : [KT1QDheV2TkL3mitzYNKzunWYhSe6MmEPTh5](https://better-call.dev/ghostnet/KT1QDheV2TkL3mitzYNKzunWYhSe6MmEPTh5/tokens)
- EDC Transfer Logging Contract : [KT18pEHAbmtGj9iYQAJNhN2CtzjBGf4zBxKX](https://better-call.dev/ghostnet/KT18pEHAbmtGj9iYQAJNhN2CtzjBGf4zBxKX/operations)
- EDC Agreement Contract : [KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD](https://better-call.dev/ghostnet/KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD/operations)
- EDC Agreement Logging Contract: [KT1CHo3f2eWcnT7zCYs1KD1ERVXwEPYacj3A](https://better-call.dev/ghostnet/KT1CHo3f2eWcnT7zCYs1KD1ERVXwEPYacj3A/operations)

## Tezos Account

Feel free to use the current tezos account included in [./.taq/config.json](./.taq/config.json) for testing.

You can easily create your own account and change it in the config file.

When originating new contracts, make sure to update the new addresses in [./contractConfig.js](./contractConfig.js).

## Contract Origination

Compile Asset Contract:

```
npm run compileAssetContract
```

Deploy Asset Contract:

```
npm run deployAssetContract
```

1. Alternative:

```
~/smartpy-cli/SmartPy.sh originate-contract --code ./artifacts/contractContract/step_000_cont_0_contract.tz --storage ./artifacts/contractContract/step_000_cont_0_storage.tz --rpc https://rpc.ghostnet.teztnets.com/

```

2. Alternative(Scripts):

Generate a new address tz1... and load tez on to it:
```
./newAccount.sh 
```
Copy the hash and visit the tezos faucet page to fund your account at:
```
https://faucet.ghostnet.teztnets.xyz 
```
Generate new asset, policy, contract and/or whitelist contracts with:
```
./newContracts.sh 
```

If you wish to create and replace a new whitelist, update the hard coded default address ([KT1FmkBCmA1TEVPWfyVN7GvMumvasnTtmbMr](https://better-call.dev/ghostnet/KT1FmkBCmA1TEVPWfyVN7GvMumvasnTtmbMr/operations)). The default whitelist address for asset, policy and contract contracts is hardcoded in the corresponding artifacts\...\step_000_cont_0_contract.tz and artifacts\...\step_000_cont_0_storage.tz files.