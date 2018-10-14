//おまじない
"use strict";

let oracle = require("../service/oracle");

//module.exports->ほかのモジュールから読み込み可能
module.exports = class SkillHandleCheckDeviceProduction {

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
                            {type: "message", label: "PLC", text: "PLC"},
                            {type: "message", label: "ハンディターミナル", text: "ハンディターミナル"},
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    if (["コボッタ", "コボッタ(DS)", "PLC", "ハンディターミナル"].includes(value)) {
                        return resolve(value);
                    }
                    return reject();
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return resolve();

                    bot.queue({
                        type: "text",
                        text: `オーケイ。${value}の進捗を見てくるロボ。`
                    });

                    //設備コードに変換する
                    switch(value)
                    {
                        case "コボッタ":
                            context.confirmed.strDeviceId = "LINE001-01";
                            break;
                        case "コボッタ(DS)":
                            context.confirmed.strDeviceId = "LINE001-02";
                            break;
                        case "PLC":
                            context.confirmed.strDeviceId = "LINE002";
                            break;
                        case "ハンディターミナル":
                            context.confirmed.strDeviceId = "LINE003";
                            break;
                    }
                    console.log("----------------------------------------------------------------------");
                    console.log("context.confirmed.strDeviceId->" + context.confirmed.strDeviceId);
                    console.log("----------------------------------------------------------------------");

                    //データベースに入力チェック
                    return oracle.get_device_status(context.confirmed.strDeviceId).then(
                        (response) => {

                            //該当なし
                            if (response.length == 0) {
                                return reject();
                            }
                            //該当あり
                            else {

                                //console.log("----------------------------------------------------------------------");
                                //console.log("response[0].t_active->" + response[0].t_active);
                                //console.log("----------------------------------------------------------------------");

                                //データを取得
                                context.confirmed.t_production_value = response[0].t_production_value;
                                context.confirmed.t_schedule_value = response[0].t_schedule_value;
                                context.confirmed.t_production_rate = response[0].t_production_rate;

                                bot.queue({
                                    type: "text",
                                    text: "お待たせロボ"
                                });
                                bot.queue({
                                    type: "text",
                                    text: `${context.confirmed.device}の進捗率は、予定数${context.confirmed.t_schedule_value}に対して${context.confirmed.t_production_value}で、進捗率は${context.confirmed.t_production_rate}％ロボ。`
                                });

                                //正常終了
                                return resolve(value);
                            }
                        }
                    );
                }
            }
        }
    }

    async finish(bot, event, context){
        await bot.reply({
            type: "text",
            text: `よかったらまた訊くロボ。`
        });
    }

}