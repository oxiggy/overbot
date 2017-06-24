'use strict';

const manifest= require('../package.json');



// DISCORD CLIENT

const DISCORD_TOKEN= process.env.DISCORD_TOKEN;

const Discord = require('discord.js');
const discord = new Discord.Client();

discord.on('ready', () => {
    console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

discord.login(DISCORD_TOKEN);



// HTTP SERVER

const HTTP_PORT= process.env.HTTP_PORT;

const App= require('koa')
const AppLogger= require('koa-logger')
const AppStatic= require('koa-static')
const AppRouter= require('koa-router')

const app = new App;
const api = new AppRouter;

app.use(AppStatic('./browser'));

app.use(AppLogger());

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

app.use(api.routes());

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}!`));
