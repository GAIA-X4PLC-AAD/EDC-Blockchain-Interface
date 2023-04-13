import { UriNotFound } from "@taquito/tzip16";
import axios from "axios";
import { create } from "ipfs-http-client";

// set up ipfs client
const ipfs = create({ url: "http://ipfs.ise.tu-berlin.de:8080/api/v0" });

class TokenMetadata {
  constructor(assetData) {
    if (assetData.asset == undefined) {
      this.name = assetData.id;
    } else {
      this.name = assetData.asset.id;
    }
    this.decimals = 0;
    if (assetData.dataUrl != undefined) {
      this.dataUrl = assetData.dataUrl;
    }
    this.tokenData = assetData;
  }
}

export const pinJSON = async (content) => {
  let tokenMeta = new TokenMetadata(content);

  try {
    let result = await ipfs.add(JSON.stringify(tokenMeta));
    console.log(result);
    return result.cid.toString();
  } catch (e) {
    console.log(e);
    throw new Error("JSON could not be pinned to ipfs");
  }
};

export const pinGenericJSON = async (content) => {
  try {
    let result = await ipfs.add(JSON.stringify(content));
    console.log(result);
    return result.cid.toString();
  } catch (e) {
    console.log(e);
    throw new Error("JSON could not be pinned to ipfs");
  }
};

// depricated for local ipfs branch
// export const pinFile = async (file, setIpfsHash) => {
//   let bKey = process.env.PINATA_KEY;
//   const formData = new FormData();
//   formData.append("file", file);

//   const req = {
//     method: "post",
//     url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//     headers: {
//       Authorization: `Bearer ${bKey}`,
//       "Content-Type": "multipart/form-data",
//     },
//     data: formData,
//   };

//   try {
//     const res = await axios(req);
//     console.log(res.data);
//     setIpfsHash(res.data.IpfsHash);
//   } catch (e) {
//     console.log(e.message);
//   }
// };
