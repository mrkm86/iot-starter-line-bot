//おまじない
"use strict";

//module.exports->ほかのモジュールから読み込み可能

module.exports = class SkillHandleCheckDeviceStatus {

	//コンストラクタ
	constructor(bot, event){

		//情報が集約しおわったら（finish）文脈をクリア
	    this.clear_context_on_finish = true;
        
        this.required_parameter = {
            device: {
                message_to_confirm: {
                    type: "template",
                    altText: "どの設備について知りたいロボか？",
                    template: {
                        type: "buttons",
                        text: "どの設備について知りたいロボか？",
                        actions: [
                            {type: "message", label: "コボッタ", text: "コボッタ"},
                            {type: "message", label: "コボッタ(DS)", text: "コボッタ(DS)"},
                            {type: "message", label: "電気BOX", text: "電気BOX"},
                            {type: "message", label: "ハンディターミナル", text: "ハンディターミナル"},
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    if (["コボッタ", "コボッタ(DS)", "電気BOX", "ハンディターミナル"].includes(value)) {
                        return resolve(value);
                    }
                    return reject();
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return resolve();

                    bot.queue({
                        type: "text",
                        text: `オーケイ。${value}ロボね。見てくるロボ。`
                    });
                    return resolve();
                }
            }
        }
    }

    async finish(bot, event, context){
        await bot.reply({
            type: "text",
            text: `お待たせロボ。${context.confirmed.device}は稼働中ロボ。\nよかったらまた訊くロボ。`
        });
    }

}