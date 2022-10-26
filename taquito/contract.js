import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { char2Bytes } from "@taquito/utils";
import fs from "fs";
import { Tzip12Module, tzip12 } from "@taquito/tzip12";
import { Tzip16Module, tzip16 } from "@taquito/tzip16";

// Read contract config
const contractConfig = JSON.parse(fs.readFileSync("./contractConfig.json"));

// connects to smartpy ithacanet
const tezos = new TezosToolkit(contractConfig.rpcUrl);
tezos.addExtension(new Tzip12Module());

// In-memory signer
// Remember to switch to remote signer in production
const faucet = JSON.parse(fs.readFileSync("./faucet/01.json"));
importKey(
  tezos,
  faucet.email,
  faucet.password,
  faucet.mnemonic.join(" "),
  faucet.activation_code
);

// Returns the balance of admin account
const getBalance = async () => {
  let response;
  await tezos.tz
    .getBalance(contractConfig.adminAddress)
    .then((balance) => {
      response = balance.toNumber() / 1000000;
      return 0;
    })
    .catch((error) => console.log(JSON.stringify(error)));
  return response;
};

// Returns the size of the map containing the logs
const getMapSize = async (mapName) => {
  let result = { admin: "", mapSize: 0 };
  await tezos.contract
    .at(contractConfig.contractAddress)
    .then((c) => {
      return c.storage();
    })
    .then((myStorage) => {
      result.mapSize = myStorage[mapName].size;
      result.admin = myStorage.admin;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return result;
};

const postContractAgreement = async (
  producerId,
  consumerId,
  transactionId,
  timestamp,
  assetToken,
  hashedContract
) => {
  let result = await tezos.contract
    .at(contractConfig.contractAddress)
    .then((contract) => {
      return (
        contract.methods
          // Check how the contract is compiled (parmaters might be ordered differently)
          .postContractAgreement(
            assetToken,
            consumerId,
            hashedContract,
            producerId,
            timestamp,
            transactionId
          )
          .send()
      );
    })
    .then(async (op) => {
      console.log(`Waiting for confirmation of ${op.hash}`);
      // Client waits for 2 confirmations (increment in production use cases!)
      return op.confirmation(2).then(() => op.hash);
    })
    .then((hash) => {
      return { status: "ok", hash: `https://ithacanet.smartpy.io/${hash}` };
    })
    .catch((error) => {
      console.log("Error: " + error);
      throw new Error(`Error: ${JSON.stringify(error, null, 2)}`);
    });

  console.log(result);
  return result;
};

const postTransfer = async (
  producerId,
  consumerId,
  transactionId,
  timestamp,
  assetToken
) => {
  let result = await tezos.contract
    .at(contractConfig.contractAddress)
    .then((contract) => {
      return (
        contract.methods
          // Check how the contract is compiled (parmaters might be ordered differently)
          .postTransfer(
            assetToken,
            consumerId,
            producerId,
            timestamp,
            transactionId
          )
          .send()
      );
    })
    .then(async (op) => {
      console.log(`Waiting for confirmation of ${op.hash}`);
      // Client waits for 2 confirmations (increment in production use cases!)
      return op.confirmation(2).then(() => op.hash);
    })
    .then((hash) => {
      return { status: "ok", hash: `https://ithacanet.smartpy.io/${hash}` };
    })
    .catch((error) => {
      console.log("Error: " + error);
      throw new Error(`Error: ${JSON.stringify(error, null, 2)}`);
    });

  console.log(result);
  return result;
};

const transactionQuery = async (transactionId, mapName) => {
  let resultObject = {};
  await tezos.contract
    .at(contractConfig.contractAddress)
    .then((c) => {
      return c.storage();
    })
    .then((myStorage) => {
      if (myStorage[mapName].get(transactionId) != undefined) {
        const mapObject = Object.fromEntries(
          myStorage[mapName].get(transactionId).valueMap
        );
        for (const [key, value] of Object.entries(mapObject)) {
          // remove additional quotation marks
          resultObject[key.replaceAll('"', "")] = value;
        }
      } else {
        // No transaction with this Id found
        throw new Error(`No transaction with Id ${transactionId} found.`);
      }
    });
  return resultObject;
};

const mintAsset = async (metaLink = "") => {
  // Parameter der Minting Funktion als Array angegeben werden müssen, da es sich in dem Contract selbst um ein Mapping handelt?
  let result = await tezos.contract
    .at("KT1PqLhC8wjhWf9dGp5NdTHpuAEJhBMuhd5K")
    .then((contract) => {
      return contract.methods
        .mint([
          {
            to_: "tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ",
            metadata: {
              "": char2Bytes(metaLink),
            },
          },
        ])
        .send();
    })
    .then((hash) => {
      return hash.hash;
    })
    .catch((error) => {
      return error;
    });
  console.log("Return Object: " + result);
  return result;
};

const mintPolicy = async (metaLink = "") => {
  // Parameter der Minting Funktion als Array angegeben werden müssen, da es sich in dem Contract selbst um ein Mapping handelt?
  let result = await tezos.contract
    .at("KT1J1Hgy9HAwbiGA6BGAy5PLQN6afn6jmr5n")
    .then((contract) => {
      return contract.methods
        .mint([
          {
            to_: "tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ",
            metadata: {
              "": char2Bytes(metaLink),
            },
          },
        ])
        .send();
    })
    .then((hash) => {
      return hash.hash;
    })
    .catch((error) => {
      return error;
    });
  console.log("Return Object: " + result);
  return result;
};

const getAsset = async (assetId) => {
  let returnObject;
  await tezos.contract
    .at("KT1PqLhC8wjhWf9dGp5NdTHpuAEJhBMuhd5K", tzip12)
    .then((contract) => {
      console.log(`Fetching the token metadata for the token ID ${assetId}`);
      return contract.tzip12().getTokenMetadata(assetId);
    })
    .then((tokenMetadata) => {
      console.log(tokenMetadata);
      returnObject = tokenMetadata;
      return returnObject;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return returnObject;
};

const getAllAssets = async () => {
  // get amount of tokens
  await tezos.contract
    .at("KT1PqLhC8wjhWf9dGp5NdTHpuAEJhBMuhd5K")
    .then((c) => {
      return c.storage();
    })
    .then((myStorage) => {
      console.log(myStorage["token_metadata"]);
    });

  tezos.contract
    .at("KT1PqLhC8wjhWf9dGp5NdTHpuAEJhBMuhd5K", tzip12)
    .then((contract) => {
      console.log(`Fetching the token metadata for the token ID of 20...`);
      return contract.tzip12().getTokenMetadata(20);
    })
    .then((tokenMetadata) => {
      console.log(JSON.stringify(tokenMetadata, null, 2));
    })
    .catch((error) => {
      return new Error(error);
    });
};

const getPolicy = async (policyId) => {
  let returnObject;
  await tezos.contract
    .at("KT1J1Hgy9HAwbiGA6BGAy5PLQN6afn6jmr5n", tzip12)
    .then((contract) => {
      console.log(`Fetching the token metadata for the token ID ${policyId}`);
      return contract.tzip12().getTokenMetadata(policyId);
    })
    .then((tokenMetadata) => {
      console.log(tokenMetadata);
      returnObject = tokenMetadata;
      return returnObject;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return returnObject;
};

export {
  getBalance,
  getMapSize,
  postContractAgreement,
  postTransfer,
  transactionQuery,
  mintAsset,
  mintPolicy,
  getAllAssets,
  getAsset,
  getPolicy,
};
