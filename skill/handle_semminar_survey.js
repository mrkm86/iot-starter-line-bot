//おまじない
"use strict";

//module.exports->ほかのモジュールから読み込み可能

module.exports = class SkillHandleSemminar {

	//コンストラクタ
	constructor(bot, event){

		//情報が集約しおわったら（finish）文脈をクリア
	    this.clear_context_on_finish = true;
        
	    //必須ではないパラメータ
	    this.optional_parameter =
        {
	        name: { //お名前
	        	message_to_confirm: {
	        		"type": "text",
	        		"text": "ご氏名をお聞かせください"
	        	},
	        	reaction: (error, value, context, resolve, reject) => {
	        	    if (error) {
	        	        //エラー処理
	        	    }
	        	    else
	        	    {
	        	        bot.collect("mail");
	        	    }
	        	    return resolve();
	        	}
	        },
            mail: { //メールアドレス
	        message_to_confirm: {
	            "type": "text",
	            "text": "受信可能なメールアドレスを入力してください"
	        }
	    }
    }
        
	    this.required_parameter = {
	        satisfied:{
	            message_to_confirm: {
	                "type": "template",
	                "altText": "今日のセミナーの満足度をお聞かせください",
	                "template": {
	                    "type": "buttons",
	                    "text": "今日のセミナーの満足度をお聞かせください",
	                    "actions": [
                           { type: "message", label: "高い", text: "高い" },
                           { type: "message", label: "普通", text: "普通" },
                           { type: "message", label: "低い", text: "低い" }
	                    ]
	                }
	            },
	            reaction: (error, value, context, resolve, reject) => {
	                if(error) {
	                    if(value != "")
	                    {
	                        bot.change_message_to_confirm("satisfied", {
	                            "type": "text",
	                            "text": "お手数ですが　高い/普通/低い　の３段階でご回答ください"
	                        })
	                    }
	                }
	                else
	                {
	                    if (value == "高い")
	                    {
	                        bot.queue([
                                    {
                                        "type": "text",
                                        "text": `高評価ですね！ありがとうございました！`
                                    }
	                        ])
	                    }
	                    if (value == "普通")
	                    {
	                        bot.queue([
                                    {
                                        "type": "text",
                                        "text": `かしこまりました。`
                                    }
	                        ])
	                    }
	                    if (value == "低い")
	                    {
	                        bot.queue([
                                    {
                                        "type": "text",
                                        "text": `ありがとうございます。次回ご期待ください。。`
                                    }
	                        ])
	                    }
	                }
	                return resolve();
	            }
	        },
	        next_semminar_regist: { //
	            message_to_confirm: {
	                "type": "template",
	                "altText": "次回のセミナーに応募しますか？",
	                "template": {
	                    "type": "buttons",
	                    "text": "次回のセミナーに応募しますか？",
	                    "thumbnailImageUrl": "https://www.snowpeak.co.jp/images/top_bigbnr/main_d_03.jpg",
	                    "actions": [
                           { type: "message", label: "はい", text: "はい" },
                           { type: "message", label: "いいえ", text: "いいえ" },
                           { type: "uri", label: "詳細情報を見る", uri: "http://heartis-sc.co.jp/" }
	                    ]
	                }
	            },
	            reaction: (error, value, context, resolve, reject) => {
	                if (error) {
	                    if (value != "") {
	                        bot.change_message_to_confirm("satisfied", {
	                            "type": "text",
	                            "text": "お手数ですが　はい/いいえ/詳細情報を見る　の３段階でご回答ください"
	                        })
	                    }
	                }
	                else {
	                    if (value == "はい") {

	                        bot.queue([
                                    {
                                        "type": "text",
                                        "text": `ご参加表明ありがとうございます！`
                                    }
	                        ])
	                        bot.collect("name");
	                    }
	                    if (value == "いいえ") {
	                        bot.queue([
                                    {
                                        "type": "text",
                                        "text": `そうですか・・・都合が合いませんでしたか・・・`
                                    }
	                        ])
	                        bot.queue([
                                    {
                                        "type": "text",
                                        "text": `次回お待ちしています！`
                                    }
	                        ])
                        }
	                }
	                return resolve();
	            }
	        },
	        comment: { //フリーコメント
	            message_to_confirm: {
	                "type": "text",
                    "text": "最後のご質問です。ご自由にご感想を入力ください。"
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
	finish(bot, event, context, resolve, reject){
		return bot.reply
		(
			{
				"type": "text",
				"text": `ご入力ありがとうございました。またのご参加をお待ちしております。`
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
