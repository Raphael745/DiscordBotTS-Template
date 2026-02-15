import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import logger from '../utils/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond avec Pong !'),
    async execute(interaction: CommandInteraction) {
        logger.debug(`Exécution de la commande 'ping' par ${interaction.user.tag}.`);
        await interaction.editReply('Pong!');
    },
};