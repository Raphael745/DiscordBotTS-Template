const chalk = require('chalk').default;
const { AsciiTable3 } = require('ascii-table3');
const config = require('../../config.json');

const logger = {
    info: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(chalk.blue.bold(`[INFO - ${timestamp}]`) + chalk.white(` ${message}`));
    },
    warn: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(chalk.yellow.bold(`[AVERTISSEMENT - ${timestamp}]`) + chalk.white(` ${message}`));
    },
    error: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.error(chalk.red.bold(`[ERREUR - ${timestamp}]`) + chalk.white(` ${message}`));
    },
    debug: (message) => {
        if (config.debug) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(chalk.magenta.bold(`[DÉBOGAGE - ${timestamp}]`) + chalk.white(` ${message}`));
        }
    },
    table: (title, headers, data) => {
        const table = new AsciiTable3(title)
            .setHeading(...headers)
            .addRowMatrix(data)
            .setStyle('unicode-single');
        console.log(table.toString());
    },
    logBotReady: (client) => {
        const tableData = [
            ['Nom du Bot', client.user.tag],
            ['ID du Bot', client.user.id],
            ['Commandes Chargées', client.commands.size],
            ['Événements Chargés', client.events.size],
            ['Prefix', process.env.PREFIX || 'N/A']
        ];
        logger.table(chalk.green.bold('BOT PRÊT !'), ['Propriété', 'Valeur'], tableData);
    }
};

module.exports = logger;