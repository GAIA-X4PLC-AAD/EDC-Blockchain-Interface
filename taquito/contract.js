import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { char2Bytes } from "@taquito/utils";
import axios from "axios";
import fs from "fs";
import { Tzip12Module, tzip12 } from "@taquito/tzip12";

// Read contract config
const contractConfig = JSON.parse(fs.readFileSync("./contractConfig.json"));

// connect tezos client to testnet
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

const mintAsset = async (metaLink = "") => {
  let result = await tezos.contract
    .at(contractConfig.assetAddress)
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
  let result = await tezos.contract
    .at(contractConfig.policyAddress)
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

const mintContract = async (metaLink = "") => {
  let result = await tezos.contract
    .at(contractConfig.contractAddress)
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
  let query = await tezos.contract
    .at(contractConfig.assetAddress, tzip12)
    .then((contract) => {
      console.log(`Fetching the token metadata for the token ID ${assetId}`);
      return contract.tzip12().getTokenMetadata(assetId);
    })
    .then((tokenMetadata) => {
      console.log(tokenMetadata);
      return tokenMetadata;
    })
    .catch((error) => {
      if (error.name === "TokenIdNotFound") {
        console.log("Not found error");
      }
      throw new Error(error);
    });
  return query;
};

const getAssetByName = async (assetName) => {
  let result = [];
  let request = {
    method: "get",
    url: "https://api.ghostnet.tzkt.io/v1/tokens/",
    params: {
      contract: contractConfig.assetAddress,
      "metadata.name": assetName,
    },
  };
  await axios(request)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      result = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return result;
};

const getAllTokens = async (tokenType) => {
  let result = [];
  let startTime = new Date().getTime();
  let request = {
    method: "get",
    url: "https://api.ghostnet.tzkt.io/v1/tokens/",
    params: {
      contract: contractConfig[tokenType + "Address"],
    },
  };
  await axios(request)
    .then((response) => {
      let res = response.data;
      res.forEach((element) => {
        result.push(element.metadata);
      });
    })
    .catch(function (error) {
      console.log(error);
      throw new Error(error);
    });

  let endtime = new Date().getTime();
  let duration = (endtime - startTime) / 1000;
  console.log(`Execution time: ${duration} seconds`);
  console.log(`${result.length} tokens were returned`);

  return result;
};

const getPolicy = async (policyId) => {
  let query = await tezos.contract
    .at(contractConfig.policyAddress, tzip12)
    .then((contract) => {
      console.log(`Fetching the token metadata for the token ID ${policyId}`);
      return contract.tzip12().getTokenMetadata(policyId);
    })
    .then((tokenMetadata) => {
      console.log(tokenMetadata);
      return tokenMetadata;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return query;
};

const getPolicyByName = async (policyName) => {
  let result = [];
  let request = {
    method: "get",
    url: "https://api.ghostnet.tzkt.io/v1/tokens/",
    params: {
      contract: contractConfig.policyAddress,
      "metadata.name": policyName,
    },
  };
  await axios(request)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      result = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return result;
};

const getContract = async (contractId) => {
  let query = await tezos.contract
    .at(contractConfig.contractAddress, tzip12)
    .then((contract) => {
      console.log(`Fetching the token metadata for the token ID ${contractId}`);
      return contract.tzip12().getTokenMetadata(contractId);
    })
    .then((tokenMetadata) => {
      console.log(tokenMetadata);
      return tokenMetadata;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return query;
};

const getContractByName = async (contractName) => {
  let result = [];
  let request = {
    method: "get",
    url: "https://api.ghostnet.tzkt.io/v1/tokens/",
    params: {
      contract: contractConfig.contractAddress,
      "metadata.name": contractName,
    },
  };
  await axios(request)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      result = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return result;
};

export {
  getBalance,
  getMapSize,
  mintAsset,
  mintPolicy,
  mintContract,
  getAllTokens,
  getAsset,
  getAssetByName,
  getPolicy,
  getPolicyByName,
  getContract,
  getContractByName,
};
