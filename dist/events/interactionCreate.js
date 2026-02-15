"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const discord_js_1 = require("discord.js");
exports.default = {
    name: 'interactionCreate',
    async execute(interaction) {
        logger_1.default.debug(`Interaction reçue : ${interaction.id}, type : ${interaction.type}`);
        if (!interaction.isCommand()) {
            logger_1.default.debug(`Interaction non-commande filtrée : ${interaction.id}`);
            return;
        }
        logger_1.default.debug(`Commande slash reçue : ${interaction.commandName} (${interaction.id})`);
        await interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        logger_1.default.debug(`Réponse différée pour la commande ${interaction.commandName} (${interaction.id})`);
        const client = interaction.client;
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            logger_1.default.warn(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
            return interaction.editReply({ content: 'Cette commande n\'existe pas.', flags: discord_js_1.MessageFlags.Ephemeral });
        }
        try {
            logger_1.default.debug(`Exécution de la commande ${interaction.commandName} (${interaction.id})`);
            await command.execute(interaction);
            logger_1.default.debug(`Commande ${interaction.commandName} exécutée avec succès (${interaction.id})`);
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de l'exécution de la commande ${interaction.commandName} (${interaction.id}) : ${error}`);
            if (interaction.replied || interaction.deferred) {
                logger_1.default.debug(`Tentative de followUp après erreur pour ${interaction.commandName} (${interaction.id})`);
                await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', flags: [discord_js_1.MessageFlags.Ephemeral] });
            }
            else {
                logger_1.default.debug(`Tentative de editReply après erreur pour ${interaction.commandName} (${interaction.id})`);
                await interaction.editReply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', flags: discord_js_1.MessageFlags.Ephemeral });
            }
        }
    },
};
