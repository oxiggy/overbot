'use strict';

module.exports = function Help({ discord }) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('/help') === 0 || content.indexOf('/помощь') === 0) {
            handleHelpCommand(message);
            return
        }
    })

    function handleHelpCommand(message) {
        let content= ''
        content+= 'Помощь по командам:\n\n'
        content+= '/stats — Посмотреть статистику по BattleTag, Например /stats oxiggy#2286\n'
        content+= '"совет" — получить совет от бота\n'
        content+= '"привет" — приветствие от бота\n'
        message.channel.send(content);
    }

}
