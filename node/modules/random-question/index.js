'use strict';

const QUESTIONS = require('../../../content/questions/questions.json');

module.exports = function RandomPic({ discord }) {

    const activeQuestionStateByChannelId = {};

    discord.on('message', message => {
        if (message.author.id === discord.user.id) {
            return
        }
        const state = getActiveQuestionState(message.channel);
        const activeQuestion = state.question;
        const activeQuestionMessage = state.questionMessage;
        if (activeQuestion) {
            message.delete();
            if (state.completed) {
                return
            }
            if (checkAnswer(activeQuestion, message)) {
                state.completed= true;
                clearTimeout(state.timeout);
                activeQuestionMessage.edit(`<@${message.author.id}> ответил правильно`);
                if (activeQuestion.award) {
                    message.channel.send(`бот, ${activeQuestion.award} нефти <@${message.author.id}>`);
                }
            }
            setActiveQuestion(message.channel, undefined);
        } else {
            const content = message.content.toLowerCase();
            if (content.indexOf('бот') >= 0 && content.indexOf('вопрос') >= 0) {
                const i = getRandomInt(0, QUESTIONS.length - 1);
                const question = QUESTIONS[i];
                setActiveQuestion(message.channel, question);
            }
        }
    });

    function getActiveQuestion(channel) {
        const state = activeQuestionStateByChannelId[channel.id] || {};
        return state.question;
    }

    function getActiveQuestionState(channel) {
        const state = activeQuestionStateByChannelId[channel.id] || {};
        return state;
    }

    function setActiveQuestion(channel, question) {
        if (!question) {
            delete activeQuestionStateByChannelId[channel.id];
            return
        }
        const state = activeQuestionStateByChannelId[channel.id] || {};
        state.question = question;
        activeQuestionStateByChannelId[channel.id] = state;
        channel.send(question.message).then((message) => {
            state.questionMessage= message;
        });
        if (question.timeout) {
            state.timeout= setTimeout(() => {
                state.questionMessage.edit('потрачено').then(() => {
                    setActiveQuestion(channel, undefined);
                });
            }, question.timeout);
        }
        return state;
    }

    function checkAnswer(question, message) {
        if (question.answer === message.content.toLowerCase()) {
            return true
        }
        return false
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

};
