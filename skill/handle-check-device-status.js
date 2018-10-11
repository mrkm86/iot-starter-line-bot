"use strict";

module.exports = class SkillHandleCheckDeviceStatus {

    constructor(){
        this.required_parameter = {
            device: {
                message_to_confirm: {
                    type: "template",
                    altText: "どの設備ラインが気になりますかね？",
                    template: {
                        type: "buttons",
                        text: "設備ライン",
                        actions: [
                            {type: "message", label: "コボッタ", text: "1-1"},
                            {type: "message", label: "コボッタ(DS)", text: "1-2"},
                            {type: "message", label: "電気BOX", text: "2"}
                        ]
                    }
                },
                parser: async (value, bot, event, context) => {
                    if (["コボッタ", "コボッタ(DS)", "電気BOX"].includes(value)) {
                        return value;
                    }

                    throw new Error();
                },
                reaction: async (error, value, bot, event, context) => {
                    if (error) return;

                    bot.queue({
                        type: "text",
                        text: `${value}ですね。ちょっと見てきます。おまちを。`
                    });
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