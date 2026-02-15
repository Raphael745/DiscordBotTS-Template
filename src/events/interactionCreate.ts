import logger from '../utils/logger';
import { MessageFlags, CommandInteraction, Client, Interaction, BitField } from 'discord.js';

export default {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction) {
        logger.debug(`Interaction reçue : ${(interaction as Interaction).id}, type : ${interaction.type}`);
        if (!interaction.isCommand()) {
            logger.debug(`Interaction non-commande filtrée : ${(interaction as Interaction).id}`);
            return;
        }

        logger.debug(`Commande slash reçue : ${interaction.commandName} (${(interaction as Interaction).id})`);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        logger.debug(`Réponse différée pour la commande ${interaction.commandName} (${(interaction as Interaction).id})`);

        const client = interaction.client as Client;
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
            return interaction.editReply({ content: 'Cette commande n\'existe pas.', flags: MessageFlags.Ephemeral as number });
        }

        try {
            logger.debug(`Exécution de la commande ${interaction.commandName} (${interaction.id})`);
            await command.execute(interaction);
            logger.debug(`Commande ${interaction.commandName} exécutée avec succès (${interaction.id})`);
        } catch (error) {
            logger.error(`Erreur lors de l'exécution de la commande ${interaction.commandName} (${interaction.id}) : ${error}`);
            if (interaction.replied || interaction.deferred) {
                logger.debug(`Tentative de followUp après erreur pour ${interaction.commandName} (${interaction.id})`);
                await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', flags: [MessageFlags.Ephemeral] });
            } else {
                logger.debug(`Tentative de editReply après erreur pour ${interaction.commandName} (${interaction.id})`);
                await interaction.editReply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', flags: MessageFlags.Ephemeral as number });
            }
        }
    },
};