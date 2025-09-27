// hederaService.js
import {
  Client,
  PrivateKey,
  ContractCreateFlow,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  FileCreateTransaction,
  FileAppendTransaction,
  FileContentsQuery,
  Hbar,
  TransactionId,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery
} from "@hashgraph/sdk";
import dotenv from "dotenv";
import crypto from 'crypto'; // Pour le hachage des fichiers

dotenv.config();

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const hederaNetwork = process.env.HEDERA_NETWORK;
const contractId = process.env.CONTRACT_ID; // ID du contrat Solidity si utilisé

if (!myAccountId || !myPrivateKey) {
  throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be set.");
}

const client = Client.forName(hederaNetwork).setOperator(myAccountId, myPrivateKey);

// Fonction pour hacher un fichier
async function hashFile(fileBuffer) {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// --- Fonctions pour les Contrats Intelligents (si vous utilisez Solidity) ---
// Déployer un contrat Solidity (à exécuter une seule fois)
async function deployContract(bytecode) {
  console.log("Deploying contract...");
  const contractCreateFlow = new ContractCreateFlow()
    .setBytecode(bytecode)
    .setGas(100_000)
    .setAdminKey(myPrivateKey); // Optionnel: clé admin pour upgrader/supprimer

  const txResponse = await contractCreateFlow.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const newContractId = receipt.contractId;
  console.log(`Contract deployed with ID: ${newContractId}`);
  return newContractId;
}

// Exécuter une fonction de contrat
async function executeContractFunction(functionName, params, gas = 100_000) {
  if (!contractId) {
    throw new Error("CONTRACT_ID is not set in environment variables. Cannot execute contract function.");
  }
  const transaction = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(gas)
    .setFunction(functionName, params);

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const record = await txResponse.getRecord(client);
  console.log(`Contract function ${functionName} executed. Status: ${receipt.status}`);
  return { receipt, record };
}

// --- Fonctions pour le Hedera File Service (HFS) ---
// Créer un fichier sur HFS
async function createFileOnHFS(contents, memo = "Contract Document Hash") {
  const transaction = new FileCreateTransaction()
    .setKeys([myPrivateKey])
    .setContents(contents)
    .setFileMemo(memo)
    .setMaxTransactionFee(new Hbar(2)); // Augmenter si le fichier est grand

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const fileId = receipt.fileId;
  console.log(`File created on HFS with ID: ${fileId}`);
  return { fileId, transactionId: txResponse.transactionId.toString() };
}

// Ajouter du contenu à un fichier HFS existant
async function appendToFileOnHFS(fileId, contents) {
  const transaction = new FileAppendTransaction()
    .setFileId(fileId)
    .setContents(contents)
    .setMaxTransactionFee(new Hbar(2)); // Augmenter si le contenu est grand

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log(`Content appended to file ${fileId}. Status: ${receipt.status}`);
  return { receipt, transactionId: txResponse.transactionId.toString() };
}

// Lire le contenu d'un fichier HFS
async function readFileFromHFS(fileId) {
  const query = new FileContentsQuery()
    .setFileId(fileId);

  const contents = await query.execute(client);
  console.log(`Contents of file ${fileId}: ${contents.toString()}`);
  return contents.toString();
}

// --- Fonctions pour le Hedera Consensus Service (HCS) pour l'Audit Trail ---
let auditTopicId = process.env.AUDIT_TOPIC_ID;

async function createAuditTopic() {
  if (auditTopicId) {
    console.log(`Audit Topic already exists: ${auditTopicId}`);
    return auditTopicId;
  }
  console.log("Creating new Audit Topic...");
  const transaction = new TopicCreateTransaction()
    .setTopicMemo("Moroccan Contracts Audit Trail")
    .setAdminKey(myPrivateKey)
    .setSubmitKey(myPrivateKey);

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  auditTopicId = receipt.topicId;
  console.log(`Audit Topic created with ID: ${auditTopicId}`);
  // Sauvegardez auditTopicId dans vos variables d'environnement ou base de données
  return auditTopicId;
}

async function submitAuditLog(logMessage) {
  if (!auditTopicId) {
    throw new Error("Audit Topic ID is not set. Call createAuditTopic first.");
  }
  const transaction = new TopicMessageSubmitTransaction()
    .setTopicId(auditTopicId)
    .setMessage(JSON.stringify(logMessage));

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log(`Audit log submitted to topic ${auditTopicId}. Status: ${receipt.status}`);
  return { receipt, transactionId: txResponse.transactionId.toString() };
}

// Écouter les messages d'un topic (pour la récupération de l'historique)
// Note: Ceci est généralement fait par un service séparé ou lors du chargement initial
async function getAuditLogs(topicId) {
  if (!topicId) {
    throw new Error("Topic ID is required to query messages.");
  }
  console.log(`Querying messages from topic ${topicId}...`);
  const messages = [];
  // HCS ne permet pas de requêter l'historique directement via le SDK client de manière simple.
  // Vous devrez utiliser un miroir node (mirror node) pour récupérer l'historique des messages.
  // Pour un mock, nous allons simuler la récupération.
  console.warn("Direct querying of HCS topic history is not supported by the client SDK. Use a Hedera Mirror Node API for production.");
  // Exemple d'appel à un mirror node (nécessite une bibliothèque comme axios)
  // const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
  // const response = await axios.get(mirrorNodeUrl);
  // return response.data.messages;
  return messages; // Retourne un tableau vide pour l'instant
}


export {
  client,
  myAccountId,
  myPrivateKey,
  hashFile,
  deployContract,
  executeContractFunction,
  createFileOnHFS,
  appendToFileOnHFS,
  readFileFromHFS,
  createAuditTopic,
  submitAuditLog,
  getAuditLogs
};