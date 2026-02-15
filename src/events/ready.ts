import logger from '../utils/logger';
import { Client } from 'discord.js';

export default {
    name: 'clientReady',
    once: true,
    execute(client: Client) {
        logger.debug(`Événement 'clientReady' déclenché.`);
        logger.logBotReady(client);
    },
};