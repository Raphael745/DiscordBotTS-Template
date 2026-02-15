"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
const rest_1 = require("@discordjs/rest");
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../utils/logger"));
const chalk_1 = __importDefault(require("chalk"));
// require('dotenv').config(); // Déjà géré dans index.ts
exports.default = async (client) => {
    logger_1.default.debug('Démarrage du gestionnaire de commandes.');
    const commands = []; // Type plus spécifique si nous définissons une interface de commande
    client.commands = new discord_js_1.Collection(); // Assurez-vous que client.commands est bien une Collection
    const loadedCommandNames = [];
    const commandFiles = await (0, glob_1.glob)(`${process.cwd()}/dist/commands/**/*.js`); // Changement de .js à .ts
    logger_1.default.debug(`Trouvé ${commandFiles.length} fichiers de commandes.`);
    for (const value of commandFiles) { // Utilisation d'une boucle for...of pour await dans la boucle
        logger_1.default.debug(`Tentative de chargement du fichier de commande : ${value}`);
        try {
            const command = (await Promise.resolve(`${path_1.default.resolve(value)}`).then(s => __importStar(require(s)))).default; // Importation dynamique
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            loadedCommandNames.push([command.data.name, 'Chargée']);
            logger_1.default.debug(`Commande '${command.data.name}' chargée.`);
        }
        catch (error) {
            logger_1.default.error(`Échec du chargement de la commande depuis ${value}: ${error.message}`);
            logger_1.default.debug(`Détails de l'erreur de chargement de commande : ${error.stack}`);
        }
    }
    if (loadedCommandNames.length > 0) {
        logger_1.default.table(chalk_1.default.blue.bold('COMMANDES CHARGÉES'), ['Nom de la Commande', 'Statut'], loadedCommandNames);
        logger_1.default.debug(`Total de ${loadedCommandNames.length} commandes chargées.`);
    }
    else {
        logger_1.default.warn('Aucune commande trouvée à charger.');
        logger_1.default.debug('Aucune commande n\'a été chargée.');
    }
    const rest = new rest_1.REST({ version: '10' }).setToken(process.env.TOKEN);
    logger_1.default.debug('Instance REST de Discord initialisée.');
    try {
        logger_1.default.info('Début du rafraîchissement des commandes slash (/) de l\'application...');
        logger_1.default.debug(`CLIENT_ID: ${process.env.CLIENT_ID}, GUILD_ID: ${process.env.GUILD_ID}`);
        if (process.env.GUILD_ID) {
            logger_1.default.debug('Enregistrement des commandes pour un GUILD_ID spécifique.');
            await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
            logger_1.default.info('Commandes slash (/) de l\'application rechargées pour le serveur.');
            logger_1.default.debug('Commandes de guilde enregistrées avec succès.');
        }
        else {
            logger_1.default.debug('Enregistrement des commandes globalement (sans GUILD_ID).');
            await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            logger_1.default.info('Commandes slash (/) de l\'application rechargées globalement.');
            logger_1.default.debug('Commandes globales enregistrées avec succès.');
        }
    }
    catch (erreur) {
        logger_1.default.error(`Échec du rechargement des commandes slash (/) de l\'application : ${erreur.message}`);
        logger_1.default.debug(`Détails de l'erreur de rechargement des commandes : ${erreur.stack}`);
    }
    logger_1.default.debug('Fin du gestionnaire de commandes.');
};
