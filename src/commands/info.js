const { SlashCommandBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Fournit des informations sur le bot.'),
    async execute(interaction) {
        logger.debug(`Exécution de la commande 'info' par ${interaction.user.tag}.`);
        await interaction.editReply(`Ce bot fonctionne avec Node.js et Discord.js v${require('discord.js').version}.`);
    },
};