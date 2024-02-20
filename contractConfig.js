import dotenv from "dotenv";
dotenv.config();

const contractConfig = {
  rpcUrl: "https://rpc.ghostnet.teztnets.com/",
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
  verifiableCredentialsAddress: process.env.VERIFIABLE_CREDENTIALS_ADDRESS
    ? process.env.VERIFIABLE_CREDENTIALS_ADDRESS
    : "KT1XgUq6rzN9q6YMh44TbLffEz3zb54HbY2H",
  transferAddress: process.env.TRANSFER_ADDRESS
    ? process.env.TRANSFER_ADDRESS
    : "KT18pEHAbmtGj9iYQAJNhN2CtzjBGf4zBxKX",
  agreementAddress: process.env.AGREEMENT_ADDRESS
    ? process.env.AGREEMENT_ADDRESS
    : "KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD",
  agreementLoggingAddress: process.env.AGREEMENT_LOGGING_ADDRESS
    ? process.env.AGREEMENT_LOGGING_ADDRESS
    : "KT1CHo3f2eWcnT7zCYs1KD1ERVXwEPYacj3A",
};

export { contractConfig };
