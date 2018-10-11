//おまじない
"use strict";

let oracle = require("../service/oracle");

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

                    if (value != "") {

                        bot.queue({
                            type: "text",
                            text: `オーケイ。${value}のようすを見てくるロボ。`
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
                            case "電気BOX":
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
                                    console.log("----------------------------------------------------------------------");
                                    console.log("response[0].t_active->" + response[0].t_active);
                                    console.log("----------------------------------------------------------------------");

                                    //１行を入れておく
                                    context.confirmed.t_active = response[0].t_active;
                                    if(context.confirmed.t_active == 0)
                                    {
                                        context.confirmed.status = "停止中";
                                    }
                                    else
                                    {
                                        context.confirmed.status = "稼働中";
                                    }

                                    return resolve(value);
                                }

                            }
                        );
                    }
                    return reject();
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return resolve();

                    bot.queue({
                        type: "text",
                        text: `お待たせロボ。\n${context.confirmed.device}は${context.confirmed.status}ロボ。\nよかったらまた訊くロボ。`
                    });
                    return resolve();
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