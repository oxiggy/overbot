'use strict';

const fs = require('fs');

module.exports = function RandomPic({ discord }) {

    let pics, pics18;

    readDir('content/pics')
        .then(function (files) {
            pics= [...files]
        })
    ;
    readDir('content/pics18')
        .then(function (files) {
            pics18= [...files]
        })
    ;

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('бот') >= 0 && content.indexOf('арт') >= 0 && content.indexOf('18') >= 0) {
            const i = getRandomInt(0, pics18.length - 1);
            const filename = `content/pics18/${pics18[i]}`;
            message.channel.send({
                files: [filename]
            });
            return
        }
        if (content.indexOf('бот') >= 0 && content.indexOf('арт') >= 0) {
            const i = getRandomInt(0, pics.length - 1);
            const filename = `content/pics/${pics[i]}`;
            message.channel.send({
                files: [filename]
            });
            return
        }
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function readDir(path) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (err, files) {
                if (err) { reject(err) } else { resolve(files) }
            })
        })
    }

};
