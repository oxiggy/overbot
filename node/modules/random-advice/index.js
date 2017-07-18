'use strict';

const request = require('request-promise');

module.exports = function RandomAdvice(discord) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('я') === 0 || content.indexOf(' я ') >= 0 || content.indexOf('совет') >= 0) {
            handleAdvice(message);
        }
    })

    function handleAdvice(message) {
        request({
            url: `http://fucking-great-advice.ru/api/random`,
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

}
