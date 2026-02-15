# DiscordBotJS Template

Une base de bot Discord en Javascript. Inclut un système de chargement des commandes et événements, une gestion des logs avancée avec support du débogage, et une architecture prête pour vos projets. Développez rapidement votre bot avec cette template.

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement du Bot](#lancement-du-bot)
- [Système de Débogage](#système-de-débogage)

## Installation

Pour commencer, clonez ce dépôt et installez les dépendances :

```bash
git clone https://github.com/Raphael745/DiscordBotJS-Template.git
cd DiscordBotJS-Template
npm install
```

## Configuration

### Fichier `.env`

Créez un fichier nommé `.env` à la racine du projet avec les informations suivantes :

```
TOKEN=VOTRE_TOKEN_BOT
CLIENT_ID=VOTRE_CLIENT_ID
GUILD_ID=VOTRE_GUILD_ID (Optionnel, pour les commandes de guilde uniquement)
```

- `TOKEN`: Le token de votre bot Discord. Vous pouvez l'obtenir depuis le [portail des développeurs Discord](https://discord.com/developers/applications).
- `CLIENT_ID`: L'ID de votre application bot. Également disponible sur le portail des développeurs.
- `GUILD_ID`: L'ID du serveur (guilde) où vous souhaitez enregistrer vos commandes slash. Si vous souhaitez enregistrer les commandes globalement, vous pouvez omettre cette ligne.

### Fichier `config.json`

Le fichier `config.json` contient des paramètres globaux pour le bot. Actuellement, il inclut une option pour activer ou désactiver le mode débogage.

```json
{
    "debug": false
}
```

- `"debug": true`: Active les logs de débogage détaillés dans la console.
- `"debug": false`: Désactive les logs de débogage.

## Lancement du Bot

Pour lancer le bot, exécutez la commande suivante :

```bash
node index.js
```
Ou si vous avez configuré un script de démarrage dans `package.json` :
```bash
npm start
```

## Système de Débogage

Le bot intègre un système de logs détaillé. Pour activer les messages de débogage, modifiez le fichier `config.json` et définissez `"debug"` sur `true` :

```json
{
    "debug": true
}
```

Lorsque le mode débogage est activé, des informations supplémentaires sur le chargement des commandes, des événements et le flux d'exécution des interactions seront affichées dans la console, ce qui est utile pour le développement et le dépannage.

---
Ceci est une base de bot Discord extensible. N'hésitez pas à l'adapter à vos besoins !