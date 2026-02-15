import chalk from 'chalk';
import { AsciiTable3 } from 'ascii-table3';
import config from '../../config.json';
import { Client } from 'discord.js';

interface Logger {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
    table: (title: string, headers: string[], data: string[][]) => void;
    logBotReady: (client: Client) => void;
}

const logger: Logger = {
    info: (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(chalk.blue.bold(`[INFO - ${timestamp}]`) + chalk.white(` ${message}`));
    },
    warn: (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(chalk.yellow.bold(`[AVERTISSEMENT - ${timestamp}]`) + chalk.white(` ${message}`));
    },
    error: (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        console.error(chalk.red.bold(`[ERREUR - ${timestamp}]`) + chalk.white(` ${message}`));
    },
    debug: (message: string) => {
        if (config.debug) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(chalk.magenta.bold(`[DÉBOGAGE - ${timestamp}]`) + chalk.white(` ${message}`));
        }
    },
    table: (title: string, headers: string[], data: string[][]) => {
        const table = new AsciiTable3(title)
            .setHeading(...headers)
            .addRowMatrix(data)
            .setStyle('unicode-single');
        console.log(table.toString());
    },
    logBotReady: (client: Client) => {
        const tableData = [
            ['Nom du Bot', client.user?.tag || 'N/A'],
            ['ID du Bot', client.user?.id || 'N/A'],
            ['Serveurs', client.guilds.cache.size.toString()],
            ['Utilisateurs', client.users.cache.size.toString()],
            ['Commandes Chargées', (client.commands?.size || 0).toString()],
            ['Événements Chargés', (client.events?.size || 0).toString()],
            ['Prefix', process.env.PREFIX || 'N/A']
        ] as string[][];
        logger.table(chalk.green.bold('BOT PRÊT !'), ['Propriété', 'Valeur'], tableData);
    }
};

export default logger;