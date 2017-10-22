'use strict';
const App= require('koa');
const AppLogger= require('koa-logger');
const AppStatic= require('koa-static');
const AppRouter= require('koa-router');
const Discord = require('discord.js');

const manifest= require('../package.json');
const { HTTP_PORT, DISCORD_TOKEN }= process.env;

// App

const app = new App;

app.use(AppStatic('./browser'));

app.use(AppLogger());

// Api

const api = new AppRouter;

api.get('/api/v1', async (context) => {
    context.body= {
        version: manifest.version,
    };
});

api.get('/api/v1/discord', async (context) => {
    context.body= {
        ping: discord.ping,
        readyTimestamp: discord.readyTimestamp,
        status: discord.status,
        uptime: discord.uptime,
    };
});

api.get('/api/v1/process', async (context) => {
    context.body= {
        pid: process.pid,
        ppid: process.ppid,
        memoryUsage: process.memoryUsage(),
    };
});

// Discord

const discord = new Discord.Client();

discord.on('ready', () => {
    console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', message => {
    if (message.content === 'ping') {
        message.reply('Pong!');
        return
    }
});

// Init modules

require('./modules/help')({ app, api, discord });
require('./modules/privet')({ app, api, discord });
require('./modules/random-advice')({ app, api, discord });
require('./modules/random-answer')({ app, api, discord });
require('./modules/random-pic')({ app, api, discord });
require('./modules/stats')({ app, api, discord });

// Start

app.use(api.routes());

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}!`));

discord.login(DISCORD_TOKEN);
