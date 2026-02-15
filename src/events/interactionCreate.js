const logger = require('../utils/logger');
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        logger.debug(`Interaction reçue : ${interaction.id}, type : ${interaction.type}`);
        if (!interaction.isCommand()) {
            logger.debug(`Interaction non-commande filtrée : ${interaction.id}`);
            return;
        }

        logger.debug(`Commande slash reçue : ${interaction.commandName} (${interaction.id})`);
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        logger.debug(`Réponse différée pour la commande ${interaction.commandName} (${interaction.id})`);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
            return interaction.editReply({ content: 'Cette commande n\'existe pas.', flags: [MessageFlags.Ephemeral] });
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
                await interaction.editReply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', flags: [MessageFlags.Ephemeral] });
            }
        }
    },
};