"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = {
    name: 'clientReady',
    once: true,
    execute(client) {
        logger_1.default.debug(`Événement 'clientReady' déclenché.`);
        logger_1.default.logBotReady(client);
    },
};
