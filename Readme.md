# EDC Interface

**This branch is not intended for production use.**

This branch contains the EDC Interface implementation for a local IPFS setup. It is required that the IPFS node is running in the same network and is accessible via the IPFS API. For the purpose of data integrity and access management a self-signed SSL certificate is used to establish a HTTPS connection to this API. Further, users must authenticate themselves with a username and apiKey included in the http header. For more details, please refer to the Swagger documentation.

## IPFS Setup

1. Optionally: Add your own smart contract addresses as env variables
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

## Run as Docker container

You can run the server in a Docker container. Make sure to add you Pinata KEY as an environment variable in the docker run command.

Image on Docker Hub: [https://hub.docker.com/repository/docker/johann1999/edc-interface](https://hub.docker.com/repository/docker/johann1999/edc-interface)

```
docker build -t edc-interface .

docker run -d --env PINATA_KEY=<JWT key> -p 3000:3000 --name edc-interface edc-interface
```

## Contract Information

Metadata of FA2 contracts is generated with the support of @taqueria/plugin-metadata feature to comply with TZIP-16 standard.

Following smart contracts were originated and can be used for minting by default:

- FA2 Asset Contract: [KT1N3iJne4jFnQz4tdHBz5q7Cd8Wmd6XtZSH](https://better-call.dev/ghostnet/KT1N3iJne4jFnQz4tdHBz5q7Cd8Wmd6XtZSH/tokens)
- FA2 Policy Contract: [KT1J7FvNLo2yQSUm7jcm2wzNHDBhR19Y5dJ9](https://better-call.dev/ghostnet/KT1J7FvNLo2yQSUm7jcm2wzNHDBhR19Y5dJ9/tokens)
- FA2 Contract Contract : [KT1QDheV2TkL3mitzYNKzunWYhSe6MmEPTh5](https://better-call.dev/ghostnet/KT1QDheV2TkL3mitzYNKzunWYhSe6MmEPTh5/tokens)
- EDC Transfer Logging Contract : [KT1N5oTfoLsKbXshfW5WrcnQJdB1kR5t21Vs](https://better-call.dev/ghostnet/KT1N5oTfoLsKbXshfW5WrcnQJdB1kR5t21Vs/operations)
- EDC Agreement Contract : [KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD](https://better-call.dev/ghostnet/KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD/operations)

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

Alternatively:

```
~/smartpy-cli/SmartPy.sh originate-contract --code ./artifacts/contractContract/step_000_cont_0_contract.tz --storage ./artifacts/contractContract/step_000_cont_0_storage.tz --rpc https://rpc.ghostnet.teztnets.xyz/
```
