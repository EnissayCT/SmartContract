// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer'; // Pour la gestion des uploads de fichiers
import {
  hashFile,
  createFileOnHFS,
  readFileFromHFS,
  submitAuditLog,
  getAuditLogs,
  executeContractFunction,
  createAuditTopic // Pour initialiser le topic si nécessaire
} from './hederaService.js'; // Assurez-vous que le chemin est correct
import { ContractFunctionParameters } from '@hashgraph/sdk';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
// Route racine pour test (optionnelle - affiche un message dans le navigateur)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Hedera API fonctionne !', 
    status: 'OK', 
    endpoints: [
      'POST /api/contracts/form (créer contrat formulaire)',
      'POST /api/contracts/file (upload fichier)',
      'GET /api/audit-logs (récupérer logs)',
      'GET /api/transaction/:id (détails transaction)'
    ],
    hederaNetwork: process.env.HEDERA_NETWORK,
    auditTopicId: process.env.AUDIT_TOPIC_ID
  });
});
// Configuration de Multer pour l'upload de fichiers
const upload = multer({ storage: multer.memoryStorage() });

// Initialisation du topic d'audit au démarrage du serveur (ou via un script d'admin)
(async () => {
  try {
    await createAuditTopic();
    console.log("Hedera Audit Topic initialized.");
  } catch (error) {
    console.error("Failed to initialize Hedera Audit Topic:", error);
  }
})();


// --- Routes API pour les Contrats (Form-Based) ---
app.post('/api/contracts/form', async (req, res) => {
  const { title, parties, description, obligations, startDate, endDate, userEmail } = req.body;

  if (!title || !parties || !description || !obligations || !startDate || !endDate || !userEmail) {
    return res.status(400).json({ error: 'All contract fields are required.' });
  }

  try {
    // 1. Créer un objet représentant le contrat
    const contractData = {
      title,
      parties: parties.map(p => p.email), // Assurez-vous que parties est un tableau d'objets {email: string}
      description,
      obligations,
      startDate,
      endDate,
      creator: userEmail,
      status: 'Created'
    };

    // 2. Hacher les données du contrat pour l'intégrité
    const contractHash = hashFile(Buffer.from(JSON.stringify(contractData)));

    // 3. Enregistrer le hash sur Hedera File Service (ou un contrat Solidity)
    // Pour cet exemple, nous allons stocker le hash et quelques métadonnées sur HFS
    const hfsContent = JSON.stringify({
      type: "FORM_CONTRACT_HASH",
      hash: contractHash,
      title: contractData.title,
      creator: contractData.creator,
      parties: contractData.parties
    });
    const { fileId, transactionId } = await createFileOnHFS(hfsContent, `Contract: ${title}`);

    // 4. Enregistrer l'action dans l'audit trail via HCS
    const auditLog = {
      action: `Created contract "${title}"`,
      userEmail: userEmail,
      timestamp: new Date().toISOString(),
      hederaTransactionId: transactionId,
      contractFileId: fileId.toString(),
      contractHash: contractHash
    };
    await submitAuditLog(auditLog);

    // 5. Répondre au frontend
    res.status(201).json({
      message: 'Contract created and recorded on Hedera successfully!',
      contract: {
        id: fileId.toString(), // Utiliser l'ID du fichier HFS comme ID du contrat
        title,
        parties,
        description,
        obligations,
        startDate,
        endDate,
        creator: userEmail,
        status: 'Created',
        hederaFileId: fileId.toString(),
        hederaTransactionId: transactionId,
        contractHash: contractHash
      }
    });

  } catch (error) {
    console.error('Error creating form contract:', error);
    res.status(500).json({ error: 'Failed to create contract on Hedera.' });
  }
});

// --- Routes API pour les Contrats (File Upload) ---
app.post('/api/contracts/file', upload.single('contractFile'), async (req, res) => {
  const { parties, userEmail } = req.body;
  const file = req.file;

  if (!file || !parties || !userEmail) {
    return res.status(400).json({ error: 'File and parties are required.' });
  }

  try {
    const fileBuffer = file.buffer;
    const fileName = file.originalname;
    const fileHash = hashFile(fileBuffer);

    // 1. Enregistrer le hash du fichier sur Hedera File Service
    const hfsContent = JSON.stringify({
      type: "FILE_CONTRACT_HASH",
      fileName: fileName,
      hash: fileHash,
      uploader: userEmail,
      parties: JSON.parse(parties).map(p => p.email) // Parties vient en string du FormData
    });
    const { fileId, transactionId } = await createFileOnHFS(hfsContent, `File Contract: ${fileName}`);

    // 2. Enregistrer l'action dans l'audit trail via HCS
    const auditLog = {
      action: `Uploaded file contract "${fileName}"`,
      userEmail: userEmail,
      timestamp: new Date().toISOString(),
      hederaTransactionId: transactionId,
      contractFileId: fileId.toString(),
      fileHash: fileHash
    };
    await submitAuditLog(auditLog);

    // 3. Répondre au frontend
    res.status(201).json({
      message: 'File contract hash stored on Hedera successfully!',
      contract: {
        id: fileId.toString(),
        fileName: fileName,
        uploader: userEmail,
        parties: JSON.parse(parties),
        hederaFileId: fileId.toString(),
        hederaTransactionId: transactionId,
        fileHash: fileHash
      }
    });

  } catch (error) {
    console.error('Error uploading file contract:', error);
    res.status(500).json({ error: 'Failed to store file hash on Hedera.' });
  }
});

// --- Route API pour récupérer les logs d'audit ---
app.get('/api/audit-logs', async (req, res) => {
  try {
    // Dans un vrai scénario, vous interrogeriez un mirror node ici
    // Pour l'exemple, nous allons retourner des logs mockés ou ceux stockés en mémoire
    const logs = await getAuditLogs(process.env.AUDIT_TOPIC_ID); // Ceci nécessitera une implémentation réelle avec un mirror node
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

// --- Route API pour récupérer les détails d'une transaction Hedera ---
app.get('/api/transaction/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  try {
    // Dans un vrai scénario, vous utiliseriez un mirror node pour obtenir les détails complets
    // Pour l'exemple, nous allons retourner des détails mockés
    console.warn("Fetching transaction details directly from Hedera client is limited. Use a Hedera Mirror Node API for full details.");
    // Exemple de récupération de receipt (limité)
    const txId = TransactionId.fromString(transactionId);
    const receipt = await txId.getReceipt(client); // 'client' doit être exporté de hederaService
    
    res.status(200).json({
      id: transactionId,
      status: receipt.status.toString(),
      // Vous pouvez ajouter plus de détails si vous avez un mirror node
      // Par exemple: await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/transactions/${transactionId}`);
    });
  } catch (error) {
    console.error(`Error fetching transaction ${transactionId}:`, error);
    res.status(500).json({ error: 'Failed to fetch transaction details.' });
  }
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});