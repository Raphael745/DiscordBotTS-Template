const { SlashCommandBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond avec Pong !'),
    async execute(interaction) {
        logger.debug(`Exécution de la commande 'ping' par ${interaction.user.tag}.`);
        await interaction.editReply('Pong!');
    },
};