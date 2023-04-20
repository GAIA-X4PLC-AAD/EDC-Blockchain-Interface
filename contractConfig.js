import dotenv from "dotenv";
dotenv.config();

const contractConfig = {
  rpcUrl: "https://rpc.ghostnet.teztnets.xyz/",
  adminAddress: process.env.ADMIN_ADDRESS
    ? process.env.ADMIN_ADDRESS
    : "tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ",
  assetAddress: process.env.ASSET_ADDRESS
    ? process.env.ASSET_ADDRESS
    : "KT1N3iJne4jFnQz4tdHBz5q7Cd8Wmd6XtZSH",
  policyAddress: process.env.POLICY_ADDRESS
    ? process.env.POLICY_ADDRESS
    : "KT1J7FvNLo2yQSUm7jcm2wzNHDBhR19Y5dJ9",
  contractAddress: process.env.CONTRACT_ADDRESS
    ? process.env.CONTRACT_ADDRESS
    : "KT1QDheV2TkL3mitzYNKzunWYhSe6MmEPTh5",
  transferAddress: process.env.TRANSFER_ADDRESS
    ? process.env.TRANSFER_ADDRESS
    : "KT1M7mbYZoP4XTejnSdiKFvq3iynnct2iF9M",
  agreementAddress: process.env.AGREEMENT_ADDRESS
    ? process.env.AGREEMENT_ADDRESS
    : "KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD",
  agreementLoggingAddress: process.env.AGREEMENT_LOGGING_ADDRESS
    ? process.env.AGREEMENT_LOGGING_ADDRESS
    : "KT1T9KzoVyuVXZvUsjnPoyExGgTBSg8oDfRE"
};

export { contractConfig };
