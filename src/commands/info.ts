import { SlashCommandBuilder, CommandInteraction, version as discordVersion } from 'discord.js';
import logger from '../utils/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Fournit des informations sur le bot.'),
    async execute(interaction: CommandInteraction) {
        logger.debug(`Exécution de la commande 'info' par ${interaction.user.tag}.`);
        await interaction.editReply(`Ce bot fonctionne avec Node.js et Discord.js v${discordVersion}.`);
    },
};