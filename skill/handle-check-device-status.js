"use strict";

module.exports = class SkillHandleCheckDeviceStatus {

    constructor(){
        this.required_parameter = {
            device: {
                message_to_confirm: {
                    type: "template",
                    altText: "どの設備について知りたいロボか？",
                    template: {
                        type: "buttons",
                        text: "設備を選ぶ",
                        actions: [
                            {type: "message", label: "コボッタ", text: "1-1"},
                            {type: "message", label: "コボッタ(DS)", text: "1-2"},
                            {type: "message", label: "電気BOX", text: "2"},
                            {type: "message", label: "ハンディターミナル", text: "3"},
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    if (["1-1", "1-2", "2", "3"].includes(value)) {
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