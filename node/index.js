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
        return
    }
    if (message.content.toLowerCase() === 'привет') {
        message.channel.send(`привет, ${message.author.username}`);
        return
    }
    if (message.content.toLowerCase().indexOf('я') === 0 || message.content.toLowerCase().indexOf(' я ') >= 0 || message.content.toLowerCase().indexOf('совет') >= 0) {
        handleAdvice(message);
        return
    }
    if (message.content.toLowerCase().indexOf('говнобот') >= 0) {
        message.channel.send(':rage:');
        return
    }
    if (message.content.toLowerCase().indexOf('бот') >= 0) {
        message.channel.send(':smiley:');
        return
    }
    if (message.content.toLowerCase().indexOf('проиграл') >= 0 || message.content.toLowerCase().indexOf('слил') >= 0 || message.content.toLowerCase().indexOf('потерял') >= 0) {
        message.channel.send(':pensive:');
        return
    }
    if (message.content.indexOf('/help') === 0 || message.content.indexOf('/помощь') === 0) {
        handleHelpCommand(message);
        return
    }
    if (message.content.indexOf('/stats') === 0) {
        handleStatsCommand(message);
        return
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

function handleAdvice(message) {
    request({
        url: `http://fucking-great-advice.ru/api/random/censored/`,
        json: true
    })
        .then(function (data) {
            let content= ''
            content+= '' + data.text.replace(/&nbsp;/g, ' ').replace(/&#151;/g, '—')
            message.channel.send(content);
        })
        .catch(function (err) {
            message.reply('что-то пошло не так');
        })
    ;
}

function handleHelpCommand(message) {
    let content= ''
    content+= 'Помощь по командам:\n\n'
    content+= '/stats — Посмотреть статистику по BattleTag, Например /stats oxiggy#2286\n'
    content+= '"совет" — получить совет от бота\n'
    content+= '"привет" — приветствие от бота\n'
    message.channel.send(content);
}

function handleStatsCommand(message) {
    const param= message.content.replace('/stats', '').trim();
    if (!param || param.indexOf('#') === -1) {
        message.reply('необходимо указать BattleTag, например /stats oxiggy#2286');
    } else {
        const battleTag= param.split('#');
        if (!battleTag[0] || !battleTag[1]) {
            message.reply('неверный формат BattleTag');
        } else {
            request({
                uri: `http://ow-api.herokuapp.com/profile/pc/eu/${battleTag[0]}-${battleTag[1]}'`,
                json: true
            })
                .then(function (data) {
                    let content= ''
                    content+= '' + data.username + ' (' + data.level + ' уровень, '+ data.competitive.rank +' ранг)\n'
                    content+= '\n'
                    content+= 'Быстрые игры:\n'
                    content+= '— побед: '+ data.games.quickplay.won +'\n'
                    content+= '— потрачено: '+ data.playtime.quickplay +'\n'
                    content+= '\n'
                    content+= 'Текущий сезон ранкеда:\n'
                    content+= '— процент побед: '+ (data.games.competitive.won / (data.games.competitive.lost+data.games.competitive.won) * 100).toFixed(1)  + '% '  +'\n'
                    content+= '— побед: '+ data.games.competitive.won +'\n'
                    content+= '— поражений: '+ data.games.competitive.lost +'\n'
                    content+= '— ничьих: '+ data.games.competitive.draw +'\n'
                    content+= '— потрачено: '+ data.playtime.competitive +''
                    message.reply(content);
                })
                .catch(function () {
                    message.reply('что-то пошло не так');
                })
            ;
        }
    }
}
