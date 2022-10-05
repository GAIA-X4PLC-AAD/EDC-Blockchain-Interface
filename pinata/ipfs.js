import axios from "axios";
var bKey = process.env.PINATA_KEY;

export const testPinata = async () => {
  const res = await axios(testFetch);
  console.log(res.data);
};

export const pinFile = async (file, setIpfsHash) => {
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
  const req = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      Authorization: `Bearer ${bKey}`,
      "Content-Type": "application/json",
    },
    data: content,
  };

  try {
    const res = await axios(req);
    console.log(res.data);
    return res.data.IpfsHash;
  } catch (e) {
    console.log(e.message);
  }
};
