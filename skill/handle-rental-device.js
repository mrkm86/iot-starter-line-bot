//おまじない
"use strict";

//module.exports->ほかのモジュールから読み込み可能

let oracle = require("../service/oracle");

module.exports = class SkillHandleRentalDevice {

    //コンストラクタ
    constructor(bot, event) {


        //情報が集約しおわったら（finish）文脈をクリア
        this.clear_context_on_finish = true;

        //必須ではないパラメータ
        this.optional_parameter =
        {
            product_rental_confirm: { //
                message_to_confirm: {
                    "type": "template",
                    "altText": "お貸出ししましょうか？",
                    "template": {
                        "type": "buttons",
                        "text": "お貸出ししましょうか？",
                        "actions": [
                           { type: "message", label: "はい", text: "はい" },
                           { type: "message", label: "いいえ", text: "いいえ" }
                        ]
                    }
                },
                reaction: (error, value, context, resolve, reject) => {
                    if (error) {
                        if (value != "") {
                            bot.change_message_to_confirm("satisfied", {
                                "type": "text",
                                "text": "お手数ですが　はい/いいえ　でご回答ください"
                            })
                        }
                    }
                    else {
                        if (value == "はい") {

                            bot.queue([
                                    {
                                        "type": "text",
                                        "text": `かしこまりました。手続きに移りましょう。`
                                    }
                            ])

                            //氏名を入力
                            bot.collect("name");
                        }
                        if (value == "いいえ") {
                            bot.queue([
                                    {
                                        "type": "text",
                                        "text": `は？なんで聞いてきたんですか？`
                                    }
                            ])
                        }
                    }
                    return resolve();
                }
            },
            name: { //お名前
                message_to_confirm: {
                    "type": "text",
                    "text": "お名前を入力してください。"
                },
                reaction: (error, value, context, resolve, reject) => {
                    if (error) {
                        if (value != "") {
                            //bot.change_message_to_confirm("satisfied", {
                            //    "type": "text",
                            //    "text": "お手数ですが　はい/いいえ　でご回答ください"
                            //})
                        }
                    }
                    else {

                        //DB書き込み
                        return oracle.put_product_status_update_by_serial(context.confirmed.searchedrecord.t_field1, 1).then(
                            (response) => {

                                bot.queue([
                                            {
                                                "type": "text",
                                                "text": `お貸出し手続きが完了いたしました。`
                                            }
                                ])

                                return resolve();
                            }
                        );
                    }
                    return resolve();
                }
            }
        }

        this.required_parameter = {
            device: { //
                message_to_confirm: {
                    "type": "text",
                    "text": "型番または品名をお知らせください"
                },
                //入力チェック
                parser(value, context, resolve, reject) {

                    if (value != "") {
                        //データベースに入力チェック
                        return oracle.inputed_product_idname_check(value).then(
                            (response) => {

                                //該当なし
                                if (response.length == 0) {
                                    return reject();
                                }
                                //該当あり
                                else {
                                    console.log("0----------------------------------------------------------------------");
                                    console.log(response[0].t_field2);
                                    console.log("0----------------------------------------------------------------------");
                                    
                                    //１行を入れておく
                                    context.confirmed.searchedrecord = response[0];

                                    return resolve(response[0].t_field2);
                                }

                            }
                        );
                    }
                    return reject();

                },
                reaction: (error, value, context, resolve, reject) => {
                    if (error) {

                        if (value != "") {
                            bot.change_message_to_confirm("device", {
                                "type": "text",
                                "text": `${value}はお取り扱いがありません`
                            })
                        }
                    }
                    else {

                        //確認メッセージ
                        bot.queue([
                                {
                                    "type": "text",
                                    "text": `${context.confirmed.searchedrecord.t_field2} ${context.confirmed.searchedrecord.t_field3}ですね。かしこまりました。\n貸出状況をお調べします`
                                }
                        ])

                        //貸出状況チェック
                        return oracle.get_product_by_id(context.confirmed.searchedrecord.t_field2).then(
                            (response) => {

                                //該当なし
                                if (response.length == 0) {

                                    bot.queue([
                                            {
                                                "type": "text",
                                                "text": `${context.confirmed.searchedrecord.t_field3}はすべて貸出されています。すみません。`
                                            }
                                    ])
                                    return resolve();
                                }
                                //該当あり
                                else {
                                    bot.queue([
                                            {
                                                "type": "text",
                                                "text": `お待たせいたしました。\n\n${context.confirmed.searchedrecord.t_field2} ${context.confirmed.searchedrecord.t_field3}はお貸出しすることができそうです`
                                            }
                                    ])

                                    //１行を入れておく
                                    context.confirmed.searchedrecord = response[0];

                                    //確認メッセージ
                                    bot.collect("product_rental_confirm");
                                }
                                return resolve();
                            }
                        );
                    }
                    return resolve();
                }
            }
        }
    }


    //parser_パラメータ名（入力チェック）
    /*
	//入力チェック
	//value・・・入力値
    parse_satisfied(value, context, resolve, reject) {
		if( value.match(/高/) ){
		    return resolve("高");
		}
		if( value.match(/マリナーラ/) || value.match(/まりなーら/)  || value.match(/マリナラ/) ){
			return resolve("マリナーラ");
		}
		return reject();
		//reactionのerrorに格納されます
	}
    */

    //パラメータがすべてそろったら実行される処理
    ///
    ///context・・・constructorで集めた
    ///resolve・・・成功時にリターンする(1回しか呼んじゃダメ)
    ///reject・・・失敗時にリターンする(1回しか呼んじゃダメ)
    finish(bot, event, context, resolve, reject) {
        return bot.reply
		(
			{
			    "type": "text",
			    "text": `ご入力ありがとうございました。またのご利用をお待ちしております。`
			}
		)
		.then(
			(response) => {
			    //成功
			    return resolve();
			    //失敗
			    //return reject();
			}
		);
    }
}
