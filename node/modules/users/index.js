'use strict';

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

};
