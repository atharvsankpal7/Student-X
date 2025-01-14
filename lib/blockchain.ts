// import { ethers } from 'ethers';
// import CertificateRegistryABI from '../contracts/CertificateRegistry.json';
// import certificate from './models/certificate';

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
// const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID!;

// export class BlockchainService {
//   private provider: ethers.Provider;
//   private contract: ethers.Contract;

//   constructor() {
//     this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_ID}`);

//     this.contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryABI.abi, this.provider);
//   }

//   async issueCertificate(certificateId: string, hash: string, privateKey: string) {
//     const wallet = new ethers.Wallet(privateKey, this.provider);
//     const contract = this.contract.connect(wallet);
//     const tx = await contract.issueCertificate(certificateId, hash);
//     return await tx.wait();
//   }

//   async verifyCertificate(certificateId: string, hash: string) {
//     return await this.contract.verifyCertificate(certificateId, hash);
//   }
// }