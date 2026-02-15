"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond avec Pong !'),
    async execute(interaction) {
        logger_1.default.debug(`Exécution de la commande 'ping' par ${interaction.user.tag}.`);
        await interaction.editReply('Pong!');
    },
};
