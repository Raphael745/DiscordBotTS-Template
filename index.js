require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./src/utils/logger');
const gestionnaireEvenements = require('./src/handlers/eventHandler');
const gestionnaireCommandes = require('./src/handlers/commandHandler');
const config = require('./config.json');

logger.debug('Démarrage du script principal du bot.');
logger.debug(`Mode débogage activé : ${config.debug}`);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
logger.debug('Client Discord initialisé avec les intents spécifiés.');

client.commands = new Collection();
client.events = new Collection();
logger.debug('Collections de commandes et d\'événements initialisées.');

(async () => {
    logger.debug('Exécution de la fonction asynchrone de démarrage.');
    logger.info('Démarrage du chargement des événements...');
    await gestionnaireEvenements(client);
    logger.info('Chargement des événements terminé.');
    logger.debug('Gestionnaire d\'événements exécuté.');

    logger.info('Démarrage du chargement des commandes...');
    await gestionnaireCommandes(client);
    logger.info('Chargement des commandes terminé.');
    logger.debug('Gestionnaire de commandes exécuté.');

    logger.info('Tentative de connexion à Discord...');
    logger.debug(`Tentative de connexion avec le TOKEN : ${process.env.TOKEN ? 'Présent' : 'Absent'}`);
    client.login(process.env.TOKEN).then(() => {
        logger.info('Connexion à Discord réussie.');
        logger.debug('Client connecté à Discord.');
    }).catch(erreur => {
        logger.error(`Échec de la connexion à Discord : ${erreur}`);
        logger.debug(`Détails de l'erreur de connexion : ${erreur.stack}`);
    });
})();

process.on('unhandledRejection', erreur => {
    logger.error(`Rejet non géré : ${erreur.stack}`);
    logger.debug(`Détails du rejet non géré : ${erreur.stack}`);
});

process.on('uncaughtException', erreur => {
    logger.error(`Exception non interceptée : ${erreur.stack}`);
    logger.debug(`Détails de l'exception non interceptée : ${erreur.stack}`);
});