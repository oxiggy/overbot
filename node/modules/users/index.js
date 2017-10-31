'use strict';
const fs= require('fs');

const USERS = require('../../../content/users/users.json');

module.exports = function Users({ discord }) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('/users') === 0) {
            handleUsersCommand(message);
        }
        if (content.indexOf('бот') >= 0 && content.indexOf('баланс') >= 0) {
            handleUserBalance(message);
        }
        const giveBalanceRegexp= new RegExp('^бот,?\\s?(\\d+)\\s?нефти\\s?<@!?(\\S+)>');
        if (giveBalanceRegexp.test(content)) {
            const sourceUserId= message.author.id;
            const [, amount, targetUserId]= giveBalanceRegexp.exec(content);
            transferUserBalance(message, sourceUserId, targetUserId, amount);
        }
    });

    function handleUsersCommand(message) {
        let content= '';
        content+= 'Помощь по BattleTag:\n\n';
        Object.keys(USERS)
            .sort(function(a, b) {
                a= USERS[a].battleTag.toLowerCase();
                b= USERS[b].battleTag.toLowerCase();
                if (a < b) return -1;
                if (a > b) return 1;
                return 0
            })
            .forEach((userId) => {
                const userProfile= discord.users.get(userId);
                const userData= USERS[userId];
                content+= userProfile.username;
                content+= ' — ';
                content+= userData.battleTag;
                content+= '\n'
            })
        ;
        message.channel.send(content);
    }

    function handleUserBalance(message) {
        const author= message.author;
        const authorData= USERS[author.id]= (USERS[author.id] || {
            balance: 0,
        });
        message.reply(authorData.balance);
    }

    function transferUserBalance(message, sourceUserId, targetUserId, amount) {
        amount= parseInt(''+amount, 10);
        const sourceUserData= getUserData(sourceUserId);
        const targetUserData= getUserData(targetUserId);
        if (amount > sourceUserData.balance) {
            message.reply(`у тебя столько нет`);
            return
        }
        sourceUserData.balance-= amount;
        targetUserData.balance+= amount;
        message.channel.send(`<@${sourceUserId}> передает <@${targetUserId}> **${amount} нефти**`);
        fs.writeFile('content/users/users.json', JSON.stringify(USERS, null, 2));
    }

    function getUserData(userId) {
        return USERS[userId]= (USERS[userId] || {
            balance: 0,
        })
    }

};
