import dotenv from "dotenv";
dotenv.config();

const contractConfig = {
  rpcUrl: "https://rpc.ghostnet.teztnets.com/",
  adminAddress: process.env.ADMIN_ADDRESS
    ? process.env.ADMIN_ADDRESS
    : "tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL",
    inMemorySignerParams: process.env.MNEMONIC
    ? process.env.MNEMONIC
    : "position rate moment length expect cube hood myself wolf aunt forward east festival lunar disorder",
  assetAddress: process.env.ASSET_ADDRESS
    ? process.env.ASSET_ADDRESS
    : "KT18xeKGvSVcgBdTYsaMeSAknzRKydthkj45",
  policyAddress: process.env.POLICY_ADDRESS
    ? process.env.POLICY_ADDRESS
    : "KT1XkpevyRR76QEk5PdwQnSEZAABFF2MhGmm",
  contractAddress: process.env.CONTRACT_ADDRESS
    ? process.env.CONTRACT_ADDRESS
    : "KT1L44vn26X98s2qMikPKBXoLFymGViwJM47",
  verifiableCredentialsAddress: process.env.VERIFIABLE_CREDENTIALS_ADDRESS
    ? process.env.VERIFIABLE_CREDENTIALS_ADDRESS
    : "KT1XgUq6rzN9q6YMh44TbLffEz3zb54HbY2H",
  transferAddress: process.env.TRANSFER_ADDRESS
    ? process.env.TRANSFER_ADDRESS
    : "KT1NTyB7jHa39w4nAvmyoWRt5q5gtWgSQB2F",
  agreementAddress: process.env.AGREEMENT_ADDRESS
    ? process.env.AGREEMENT_ADDRESS
    : "KT19Jk6zvWfFjWMVSozPNm7VDMKSDVGrU6XD",
  agreementLoggingAddress: process.env.AGREEMENT_LOGGING_ADDRESS
    ? process.env.AGREEMENT_LOGGING_ADDRESS
    : "KT1CHo3f2eWcnT7zCYs1KD1ERVXwEPYacj3A",
  tokenLimit: process.env.TOKEN_LIMIT ? process.env.TOKEN_LIMIT : 100,
  sdCreatorURL: process.env.SD_CREATOR_URL ? process.env.SD_CREATOR_URL : "sd-creator.gxfs.gx4fm.org/self-description" 
};

export { contractConfig };
