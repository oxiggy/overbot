'use strict';

module.exports = function Privet({ discord }) {

    discord.on('message', message => {
        const content= message.content.toLowerCase();
        if (content === 'привет') {
            message.channel.send(`привет, ${message.author.username}`);
            return
        }
        if (content.indexOf('говнобот') >= 0) {
            message.channel.send(':rage:');
            return
        }
        if (content.indexOf('проиграл') >= 0 || content.indexOf('слил') >= 0 || content.indexOf('потерял') >= 0) {
            message.channel.send(':pensive:');
            return
        }
        if (content.indexOf('ты кто?') >= 0) {
            message.channel.send(':thinking_face:');
            return
        }
    })

};
