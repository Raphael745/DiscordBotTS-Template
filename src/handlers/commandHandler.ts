import { glob } from 'glob';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes, Client, Collection } from 'discord.js';
import logger from '../utils/logger';
import chalk from 'chalk';

export default async (client: Client) => {
    logger.debug('Démarrage du gestionnaire de commandes.');
    const commands: any[] = [];
    client.commands = new Collection();
    const loadedCommandNames: [string, string][] = [];

    const commandFiles = await glob(`${process.cwd()}/dist/commands/**/*.js`);
    logger.debug(`Trouvé ${commandFiles.length} fichiers de commandes.`);
    for (const value of commandFiles) {
        logger.debug(`Tentative de chargement du fichier de commande : ${value}`);
        try {
            const command = (await import(path.resolve(value))).default;
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            loadedCommandNames.push([command.data.name, 'Chargée']);
            logger.debug(`Commande '${command.data.name}' chargée.`);
        } catch (error: unknown) {
            logger.error(`Échec du chargement de la commande depuis ${value}: ${(error as Error).message}`);
            logger.debug(`Détails de l'erreur de chargement de commande : ${(error as Error).stack}`);
        }
    }

    if (loadedCommandNames.length > 0) {
        logger.table(chalk.blue.bold('COMMANDES CHARGÉES'), ['Nom de la Commande', 'Statut'], loadedCommandNames);
        logger.debug(`Total de ${loadedCommandNames.length} commandes chargées.`);
    } else {
        logger.warn('Aucune commande trouvée à charger.');
        logger.debug('Aucune commande n\'a été chargée.');
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
    logger.debug('Instance REST de Discord initialisée.');

    try {
        logger.info('Début du rafraîchissement des commandes slash (/) de l\'application...');
        logger.debug(`CLIENT_ID: ${process.env.CLIENT_ID}, GUILD_ID: ${process.env.GUILD_ID}`);

        if (process.env.GUILD_ID) {
            logger.debug('Enregistrement des commandes pour un GUILD_ID spécifique.');
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
                { body: commands },
            );
            logger.info('Commandes slash (/) de l\'application rechargées pour le serveur.');
            logger.debug('Commandes de guilde enregistrées avec succès.');
        } else {
            logger.debug('Enregistrement des commandes globalement (sans GUILD_ID).');
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID as string),
                { body: commands },
            );
            logger.info('Commandes slash (/) de l\'application rechargées globalement.');
            logger.debug('Commandes globales enregistrées avec succès.');
        }
    } catch (erreur: unknown) {
        logger.error(`Échec du rechargement des commandes slash (/) de l\'application : ${(erreur as Error).message}`);
        logger.debug(`Détails de l'erreur de rechargement des commandes : ${(erreur as Error).stack}`);
    }
    logger.debug('Fin du gestionnaire de commandes.');
};