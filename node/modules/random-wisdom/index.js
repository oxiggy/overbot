'use strict';

const request = require('request-promise');

module.exports = function RandomWisdom({ discord }) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('мудр') === 0 || content.indexOf('поясни') >= 0 || content.indexOf('почему') >= 0) {
            handleWisdom(message);
        }
    });

    function handleWisdom(message) {
        request({
            url: `http://api.forismatic.com/api/1.0/?method=getQuote&key=313373&format=json&lang=ru`,
            json: true
        })
            .then(function (data) {
                let content= '';
                content+= '' + data.quoteText
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&#151;/g, '—')
                    .replace(/&laquo;/g, '«')
                    .replace(/&raquo;/g, '»')
                ;
                content+= '\n'+ data.quoteAuthor;
                message.channel.send(content);
            })
            .catch(function (err) {
                message.reply('что-то пошло не так');
            })
        ;
    }

};
