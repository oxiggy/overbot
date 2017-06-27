'use strict';

const manifest= require('../package.json');



// DISCORD CLIENT

const DISCORD_TOKEN= process.env.DISCORD_TOKEN;

const Discord = require('discord.js');
const discord = new Discord.Client();

discord.on('ready', () => {
    console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', message => {
    if (message.content === 'ping') {
        message.reply('Pong!');
    }
    if (message.content.toLowerCase() === 'привет') {
        message.channel.send(`привет, ${message.author.username}\nпривет`);
    }
    if (message.content.indexOf('/stats') === 0) {
        handleStatsCommand(message);
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



const request = require('request-promise')

function handleStatsCommand(message) {
    const param= message.content.replace('/stats', '').trim();
    if (!param || param.indexOf('#') === -1) {
        message.reply('необходимо указать BattleTag, например /stats oxiggy#2286');
    } else {
        const battleTag= param.split('#');
        if (!battleTag[0] || !battleTag[1]) {
            message.reply('неверный формат BattleTag');
        } else {
            request(`http://ow-api.herokuapp.com/profile/pc/eu/${battleTag[0]}-${battleTag[1]}'`)
                .then(function (data) {
                    try {
                        data= JSON.parse(data)
                        let message= ''
                        message+= '' + data.username + ' (' + data.level + ' уровень, '+ data.competitive.rank +' ранг)\n'
                        message+= '\n'
                        message+= 'Быстрые игры:\n'
                        message+= '— побед: '+ data.games.quickplay.won +'\n'
                        message+= '— потрачено: '+ data.playtime.quickplay +'\n'
                        message+= '\n'
                        message+= 'Текущий сезон ранкеда:\n'
                        message+= '— побед: '+ data.games.competitive.won +'\n'
                        message+= '— поражений: '+ data.games.competitive.lost +'\n'
                        message+= '— ничьих: '+ data.games.competitive.draw +'\n'
                        message+= '— потрачено: '+ data.playtime.competitive +''
                        message.reply(message);
                    } catch (err) {
                        // что-то пошло не так
                    }
                })
            ;
        }
    }
}
