'use strict';

const request = require('request-promise');

module.exports = function Users({ discord }) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('/users') === 0) {
            handleUsersCommand(message);
            return
        }
    })

    function handleUsersCommand(message) {
        let content= ''
        content+= 'Помощь по BattleTag:\n\n'
        content+= 'oxiggy — oxiggy#2286\n'
        message.channel.send(content);
    }

}
