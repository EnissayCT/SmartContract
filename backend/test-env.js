  require('dotenv').config();
  const { Client, PrivateKey } = require('@hashgraph/sdk');
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKeyStr = process.env.MY_PRIVATE_KEY;
  const network = process.env.HEDERA_NETWORK;
  if (!myAccountId || !myPrivateKeyStr) {
    console.error('Erreur : MY_ACCOUNT_ID ou MY_PRIVATE_KEY manquants dans .env');
    process.exit(1);
  }
  try {
    const myPrivateKey = PrivateKey.fromString(myPrivateKeyStr);
    console.log('Configuration OK !');
    console.log(`Account ID: ${myAccountId}`);
    console.log(`Network: ${network}`);
    console.log('Private Key chargée avec succès (ne l\'affichez pas en prod !)');
    // Test de connexion basique à Hedera
    const client = Client.forName(network).setOperator(myAccountId, myPrivateKey);
    console.log('Client Hedera initialisé avec succès.');
    
    // Test optionnel : Vérifiez le solde (nécessite des HBAR test)
    // console.log('Solde du compte:', await new AccountBalanceQuery().setAccountId(myAccountId).execute(client));
  } catch (error) {
    console.error('Erreur lors du chargement de la clé privée ou de la config:', error.message);
    process.exit(1);
  }