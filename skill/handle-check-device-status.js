"use strict";

module.exports = class SkillHandleDeliveryOrder {

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
                            {type: "message", label: "電気BOX", text: "2"},
                            {type: "message", label: "ハンディターミナル", text: "3"}
                        ]
                    }
                },
                parser: async (value, bot, event, context) => {
                    if (["1-1", "1-2", "2", "3"].includes(value)) {
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
            /*,
            address: {
                message_to_confirm: {
                    type: "text",
                    text: "どちらにお届けしましょっ？"
                },
                parser: async (value, bot, event, context) => {
                    if (typeof value == "string"){
                        return value;
                    } else if (typeof value == "object" && value.type == "location"){
                        return value.address;
                    }

                    throw new Error();
                }
            }*/
        }
    }

    async finish(bot, event, context){
        await bot.reply({
            type: "text",
            text: `オーケイ。じゃあ${context.confirmed.device}はこんな感じでした。`
        });
    }

}