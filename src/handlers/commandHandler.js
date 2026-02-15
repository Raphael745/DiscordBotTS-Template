const { glob } = require('glob');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const logger = require('../utils/logger');
const chalk = require('chalk').default;
require('dotenv').config();

module.exports = async (client) => {
    logger.debug('Démarrage du gestionnaire de commandes.');
    const commands = [];
    client.commands = new Map();
    const loadedCommandNames = [];

    const commandFiles = await glob(`${process.cwd()}/src/commands/**/*.js`);
    logger.debug(`Trouvé ${commandFiles.length} fichiers de commandes.`);
    commandFiles.map((value) => {
        logger.debug(`Tentative de chargement du fichier de commande : ${value}`);
        const command = require(path.resolve(value));
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        loadedCommandNames.push([command.data.name, 'Chargée']);
        logger.debug(`Commande '${command.data.name}' chargée.`);
    });

    if (loadedCommandNames.length > 0) {
        logger.table(chalk.blue.bold('COMMANDES CHARGÉES'), ['Nom de la Commande', 'Statut'], loadedCommandNames);
        logger.debug(`Total de ${loadedCommandNames.length} commandes chargées.`);
    } else {
        logger.warn('Aucune commande trouvée à charger.');
        logger.debug('Aucune commande n\'a été chargée.');
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    logger.debug('Instance REST de Discord initialisée.');

    try {
        logger.info('Début du rafraîchissement des commandes slash (/) de l\'application...');
        logger.debug(`CLIENT_ID: ${process.env.CLIENT_ID}, GUILD_ID: ${process.env.GUILD_ID}`);

        if (process.env.GUILD_ID) {
            logger.debug('Enregistrement des commandes pour un GUILD_ID spécifique.');
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );
            logger.info('Commandes slash (/) de l\'application rechargées pour le serveur.');
            logger.debug('Commandes de guilde enregistrées avec succès.');
        } else {
            logger.debug('Enregistrement des commandes globalement (sans GUILD_ID).');
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            logger.info('Commandes slash (/) de l\'application rechargées globalement.');
            logger.debug('Commandes globales enregistrées avec succès.');
        }
    } catch (erreur) {
        logger.error(`Échec du rechargement des commandes slash (/) de l\'application : ${erreur}`);
        logger.debug(`Détails de l'erreur de rechargement des commandes : ${erreur.stack}`);
    }
    logger.debug('Fin du gestionnaire de commandes.');
};