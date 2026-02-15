"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const ascii_table3_1 = require("ascii-table3");
const config_json_1 = __importDefault(require("../../config.json"));
const logger = {
    info: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(chalk_1.default.blue.bold(`[INFO - ${timestamp}]`) + chalk_1.default.white(` ${message}`));
    },
    warn: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(chalk_1.default.yellow.bold(`[AVERTISSEMENT - ${timestamp}]`) + chalk_1.default.white(` ${message}`));
    },
    error: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.error(chalk_1.default.red.bold(`[ERREUR - ${timestamp}]`) + chalk_1.default.white(` ${message}`));
    },
    debug: (message) => {
        if (config_json_1.default.debug) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(chalk_1.default.magenta.bold(`[DÉBOGAGE - ${timestamp}]`) + chalk_1.default.white(` ${message}`));
        }
    },
    table: (title, headers, data) => {
        const table = new ascii_table3_1.AsciiTable3(title)
            .setHeading(...headers)
            .addRowMatrix(data)
            .setStyle('unicode-single');
        console.log(table.toString());
    },
    logBotReady: (client) => {
        const tableData = [
            ['Nom du Bot', client.user?.tag || 'N/A'],
            ['ID du Bot', client.user?.id || 'N/A'],
            ['Serveurs', client.guilds.cache.size.toString()],
            ['Utilisateurs', client.users.cache.size.toString()],
            ['Commandes Chargées', (client.commands?.size || 0).toString()],
            ['Événements Chargés', (client.events?.size || 0).toString()],
            ['Prefix', process.env.PREFIX || 'N/A']
        ];
        logger.table(chalk_1.default.green.bold('BOT PRÊT !'), ['Propriété', 'Valeur'], tableData);
    }
};
exports.default = logger;
