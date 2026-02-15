const { glob } = require('glob');
const path = require('path');
const logger = require('../utils/logger');
const chalk = require('chalk').default;

module.exports = async (client) => {
    logger.debug('Démarrage du gestionnaire d\'événements.');
    const eventFiles = await glob(`${process.cwd()}/src/events/**/*.js`);
    logger.debug(`Trouvé ${eventFiles.length} fichiers d'événements.`);
    client.events = new Map();
    const loadedEventNames = [];

    for (const file of eventFiles) {
        logger.debug(`Tentative de chargement du fichier d'événement : ${file}`);
        try {
            const event = require(path.resolve(file));
            logger.debug(`Événement chargé : ${event.name} depuis ${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
                logger.debug(`Événement '${event.name}' enregistré comme 'once'.`);
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
                logger.debug(`Événement '${event.name}' enregistré comme 'on'.`);
            }
            client.events.set(event.name, event);
            loadedEventNames.push([event.name, event.once ? 'Une fois' : 'Toujours']);
        } catch (error) {
            logger.error(`Erreur lors du chargement de l'événement depuis ${file}: ${error.message}`);
            logger.debug(`Détails de l'erreur de chargement de l'événement : ${error.stack}`);
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