import { glob } from 'glob';
import path from 'path';
import logger from '../utils/logger';
import chalk from 'chalk';
import { Client, Collection } from 'discord.js';

export default async (client: Client) => {
    logger.debug('Démarrage du gestionnaire d\'événements.');
    const eventFiles = await glob(`${process.cwd()}/dist/events/**/*.js`);
    logger.debug(`Trouvé ${eventFiles.length} fichiers d'événements.`);
    client.events = new Collection();
    const loadedEventNames: [string, string][] = [];

    for (const file of eventFiles) {
        logger.debug(`Tentative de chargement du fichier d'événement : ${file}`);
        try {
            const event = (await import(path.resolve(file))).default;
            logger.debug(`Événement chargé : ${event.name} depuis ${file}`);
            if (event.once) {
                client.once(event.name, (...args: any[]) => event.execute(...args, client));
                logger.debug(`Événement '${event.name}' enregistré comme 'once'.`);
            } else {
                client.on(event.name, (...args: any[]) => event.execute(...args, client));
                logger.debug(`Événement '${event.name}' enregistré comme 'on'.`);
            }
            client.events.set(event.name, event);
            loadedEventNames.push([event.name, event.once ? 'Une fois' : 'Toujours']);
        } catch (error: unknown) {
            logger.error(`Erreur lors du chargement de l'événement depuis ${file}: ${(error as Error).message}`);
            logger.debug(`Détails de l'erreur de chargement de l'événement : ${(error as Error).stack}`);
        }
    }

    if (loadedEventNames.length > 0) {
        logger.table(chalk.yellow.bold('ÉVÉNEMENTS CHARGÉS'), ['Nom de l\'Événement', 'Type'], loadedEventNames);
        logger.debug(`Total de ${loadedEventNames.length} événements chargés.`);
    } else {
        logger.warn('Aucun événement trouvé à charger.');
        logger.debug('Aucun événement n\'a été chargé.');
    }
    logger.debug('Fin du gestionnaire d\'événements.');
};