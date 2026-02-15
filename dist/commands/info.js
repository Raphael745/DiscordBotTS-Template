"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('info')
        .setDescription('Fournit des informations sur le bot.'),
    async execute(interaction) {
        logger_1.default.debug(`Exécution de la commande 'info' par ${interaction.user.tag}.`);
        await interaction.editReply(`Ce bot fonctionne avec Node.js et Discord.js v${discord_js_1.version}.`);
    },
};
