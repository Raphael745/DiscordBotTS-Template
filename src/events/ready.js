const logger = require('../utils/logger');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        logger.debug(`Événement 'clientReady' déclenché.`);
        logger.logBotReady(client);
    },
};