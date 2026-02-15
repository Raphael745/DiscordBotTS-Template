"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("./utils/logger"));
const eventHandler_1 = __importDefault(require("./handlers/eventHandler"));
const commandHandler_1 = __importDefault(require("./handlers/commandHandler"));
const config_json_1 = __importDefault(require("../config.json"));
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
});
logger_1.default.debug('Démarrage du script principal du bot.');
logger_1.default.debug(`Mode débogage activé : ${config_json_1.default.debug}`);
logger_1.default.debug('Client Discord initialisé avec les intents spécifiés.');
client.commands = new discord_js_1.Collection();
client.events = new discord_js_1.Collection();
logger_1.default.debug('Collections de commandes et d\'événements initialisées.');
(async () => {
    logger_1.default.debug('Exécution de la fonction asynchrone de démarrage.');
    logger_1.default.info('Démarrage du chargement des événements...');
    await (0, eventHandler_1.default)(client);
    logger_1.default.info('Chargement des événements terminé.');
    logger_1.default.debug('Gestionnaire d\'événements exécuté.');
    logger_1.default.info('Démarrage du chargement des commandes...');
    await (0, commandHandler_1.default)(client);
    logger_1.default.info('Chargement des commandes terminé.');
    logger_1.default.debug('Gestionnaire de commandes exécuté.');
    logger_1.default.info('Tentative de connexion à Discord...');
    logger_1.default.debug(`Tentative de connexion avec le TOKEN : ${process.env.TOKEN ? 'Présent' : 'Absent'}`);
    client.login(process.env.TOKEN).then(() => {
        logger_1.default.info('Connexion à Discord réussie.');
        logger_1.default.debug('Client connecté à Discord.');
    }).catch((erreur) => {
        logger_1.default.error(`Échec de la connexion à Discord : ${erreur.message}`);
        logger_1.default.debug(`Détails de l'erreur de connexion : ${erreur.stack}`);
    });
})();
process.on('unhandledRejection', (erreur) => {
    logger_1.default.error(`Rejet non géré : ${erreur.message}`);
    logger_1.default.debug(`Détails du rejet non géré : ${erreur.stack}`);
});
process.on('uncaughtException', (erreur) => {
    logger_1.default.error(`Exception non interceptée : ${erreur.message}`);
    logger_1.default.debug(`Détails de l'exception non interceptée : ${erreur.stack}`);
});
