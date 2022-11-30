import { UriNotFound } from "@taquito/tzip16";
import axios from "axios";

class TokenMetadata {
  constructor(assetData) {
    if (assetData.asset == undefined) {
      this.name = assetData.id;
    } else {
      this.name = assetData.asset.id;
    }
    this.decimals = 0;
    this.tokenData = assetData;
  }
}

export const pinFile = async (file, setIpfsHash) => {
  let bKey = process.env.PINATA_KEY;
  const formData = new FormData();
  formData.append("file", file);

  const req = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      Authorization: `Bearer ${bKey}`,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };

  try {
    const res = await axios(req);
    console.log(res.data);
    setIpfsHash(res.data.IpfsHash);
  } catch (e) {
    console.log(e.message);
  }
};

export const pinJSON = async (content) => {
  let bKey = process.env.PINATA_KEY;
  // create Token Metadata
  let tokenMeta = new TokenMetadata(content);

  console.log("Bearer Key: " + bKey);
  const req = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      Authorization: `Bearer ${bKey}`,
      "Content-Type": "application/json",
    },
    data: tokenMeta,
  };

  try {
    const res = await axios(req);
    console.log(res.data);
    return res.data.IpfsHash;
  } catch (e) {
    console.log(e);
    throw new Error("JSON could not be pinned to ipfs");
  }
};
