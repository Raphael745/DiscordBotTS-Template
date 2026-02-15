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
const logger_1 = __importDefault(require("../utils/logger"));
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js"); // Importation de Client et Collection pour le typage
exports.default = async (client) => {
    logger_1.default.debug('Démarrage du gestionnaire d\'événements.');
    const eventFiles = await (0, glob_1.glob)(`${process.cwd()}/dist/events/**/*.js`); // Changement de .js à .ts
    logger_1.default.debug(`Trouvé ${eventFiles.length} fichiers d'événements.`);
    client.events = new discord_js_1.Collection(); // Assurez-vous que client.events est bien une Collection
    const loadedEventNames = [];
    for (const file of eventFiles) {
        logger_1.default.debug(`Tentative de chargement du fichier d'événement : ${file}`);
        try {
            const event = (await Promise.resolve(`${path_1.default.resolve(file)}`).then(s => __importStar(require(s)))).default; // Importation dynamique
            logger_1.default.debug(`Événement chargé : ${event.name} depuis ${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
                logger_1.default.debug(`Événement '${event.name}' enregistré comme 'once'.`);
            }
            else {
                client.on(event.name, (...args) => event.execute(...args, client));
                logger_1.default.debug(`Événement '${event.name}' enregistré comme 'on'.`);
            }
            client.events.set(event.name, event);
            loadedEventNames.push([event.name, event.once ? 'Une fois' : 'Toujours']);
        }
        catch (error) {
            logger_1.default.error(`Erreur lors du chargement de l'événement depuis ${file}: ${error.message}`);
            logger_1.default.debug(`Détails de l'erreur de chargement de l'événement : ${error.stack}`);
        }
    }
    if (loadedEventNames.length > 0) {
        logger_1.default.table(chalk_1.default.yellow.bold('ÉVÉNEMENTS CHARGÉS'), ['Nom de l\'Événement', 'Type'], loadedEventNames);
        logger_1.default.debug(`Total de ${loadedEventNames.length} événements chargés.`);
    }
    else {
        logger_1.default.warn('Aucun événement trouvé à charger.');
        logger_1.default.debug('Aucun événement n\'a été chargé.');
    }
    logger_1.default.debug('Fin du gestionnaire d\'événements.');
};
