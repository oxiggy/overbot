'use strict';

const manifest= require('../package.json');



// DISCORD CLIENT

const DISCORD_TOKEN= process.env.DISCORD_TOKEN;

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

client.login(DISCORD_TOKEN);



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

app.use(api.routes());

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}!`));
