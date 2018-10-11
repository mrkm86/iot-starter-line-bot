"use strict";

module.exports = class SkillHandleCheckDeviceStatus {

    constructor(){
        this.required_parameter = {
            device: {
                message_to_confirm: {
                    type: "template",
                    altText: "出前のメニューは松、竹、梅の3種類になっとりますけどどちらにしましょっ？",
                    template: {
                        type: "buttons",
                        text: "ご注文は？",
                        actions: [
                            {type: "message", label: "松", text: "1-1"},
                            {type: "message", label: "竹", text: "1-2"},
                            {type: "message", label: "梅", text: "2"}
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    if (["1-1", "1-2", "2"].includes(value)) {
                        return resolve(value);
                    }
                    return reject();
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return resolve();

                    bot.queue({
                        type: "text",
                        text: `あいよっ！${value}ね。`
                    });
                    return resolve();
                }
            }
        }
    }

    async finish(bot, event, context){
        await bot.reply({
            type: "text",
            text: `オーケイ。じゃあ${context.confirmed.device}はこんな感じでした。`
        });
    }

}