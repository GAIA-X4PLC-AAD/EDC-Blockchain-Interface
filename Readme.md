# EDC Interface

## IPFS Setup

In order to pin content to the IPFS you must include your Pinata API credentials in the form of environment parameters:

1. Create a file in root directory called ".env"
2. Add your Pinata private key as a variable:

```
PINATA_KEY=
```

3. Save this file

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

Following smart contracts are originated and can be used for minting:

- FA2 Asset Contract: [KT1PqLhC8wjhWf9dGp5NdTHpuAEJhBMuhd5K](https://better-call.dev/ghostnet/KT1PqLhC8wjhWf9dGp5NdTHpuAEJhBMuhd5K/metadata)
- FA2 Policy Contract: [KT1J1Hgy9HAwbiGA6BGAy5PLQN6afn6jmr5n](https://better-call.dev/ghostnet/KT1J1Hgy9HAwbiGA6BGAy5PLQN6afn6jmr5n/metadata)
