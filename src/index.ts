import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import logger from './utils/logger';
import gestionnaireEvenements from './handlers/eventHandler';
import gestionnaireCommandes from './handlers/commandHandler';
import config from '../config.json';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
        events: Collection<string, any>;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

logger.debug('Démarrage du script principal du bot.');
logger.debug(`Mode débogage activé : ${config.debug}`);
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
    }).catch((erreur: Error) => {
        logger.error(`Échec de la connexion à Discord : ${erreur.message}`);
        logger.debug(`Détails de l'erreur de connexion : ${erreur.stack}`);
    });
})();

process.on('unhandledRejection', (erreur: Error) => {
    logger.error(`Rejet non géré : ${erreur.message}`);
    logger.debug(`Détails du rejet non géré : ${erreur.stack}`);
});

process.on('uncaughtException', (erreur: Error) => {
    logger.error(`Exception non interceptée : ${erreur.message}`);
    logger.debug(`Détails de l'exception non interceptée : ${erreur.stack}`);
});