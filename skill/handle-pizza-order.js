//おまじない
"use strict";

//module.exports->ほかのモジュールから読み込み可能

module.exports = class SkillHandlePizzaOrder {

	//コンストラクタ
	constructor(bot, event){

		//情報が集約しおわったら（finish）文脈をクリア
	    this.clear_context_on_finish = true;

	    //必須ではないパラメータ
	    this.optional_parameter =
        {

	        size: { //サイズ
	        	message_to_confirm: {
	        		"type": "text",
	        		"text": "ピザのサイズはお決まりでしょうか？"
	        	}
	        }
	    }

		this.required_parameter = {
			pizza: { //ピザのタイプ
				message_to_confirm: {
					//"type": "text",
					//"text": "ご注文のピザはお決まりでしょうか？"
					"type": "template",
					"altText": "ご注文のピザはお決まりでしょうか？(マルゲリータorマリナーラ 限定だぞ。間違えちゃダメ)",
					"template": {
						"type": "buttons",
						"text": "ご注文のピザはお決まりでしょうか？",
						 "actions": [
							{type:"message", label:"マルゲリータ", text:"マルゲリータ"},
							{type:"message", label:"マリナーラ", text:"マリナーラ"}
						]
					}
				},
				reaction: (error, value, context, resolve, reject) => {
					if(error) {
						if(value != "")
						{
							bot.change_message_to_confirm("pizza", {
								"type": "text",
								"text": "マルゲリータorマリナーラ限定ですよ。お間違えなく。"
							})
						}
					}
					else
					{
						//bot.queue([
						//	{
						//		"type": "text",
						//		"text": `${value}ですね。かしこまりました`
						//	},
						//	{
						//		"type": "text",
						//		"text": `あざす`
						//	}
					    //])
					    if (value == "マルゲリータ")
					    {
					        //マルゲリータは１サイズしかないと想定して、サイズは聞かない
					        bot.queue([
					        	{
					        		"type": "text",
					        		"text": `マルゲリータですね。かしこまりました`
					        	},
					        	{
					        		"type": "text",
					        		"text": `サイズは特大のみになります`
					        	}
					        ])
					    }
					    else
					    {
                            //bot.collectはいつでも使える
					        bot.collect("size");
					    }
					}
					return resolve();
				},
			},
			//size: { //サイズ
			//	message_to_confirm: {
			//		"type": "text",
			//		"text": "ピザのサイズはお決まりでしょうか？"
			//	}
			//},
			address: { //住所
				message_to_confirm: {
					"type": "text",
					"text": "お届け先を教えてもらえますか"
				}
			},
			name: { //氏名
				message_to_confirm: {
					"type": "text",
					"text": "ご注文される方のお名前を教えてください"
				}
			}
		}
	}


	//parser_パラメータ名（入力チェック）

	//ピザの入力チェック
	//value・・・入力値
	parse_pizza(value, context, resolve, reject){
		if( value.match(/マルゲリータ/) || value.match(/マルガリータ/) ){
			return resolve("マルゲリータ");
		}
		if( value.match(/マリナーラ/) || value.match(/まりなーら/)  || value.match(/マリナラ/) ){
			return resolve("マリナーラ");
		}
		return reject();
		//reactionのerrorに格納されます
	}

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
				"text": `${context.confirmed.name}様。ありがとうございまっす。${context.confirmed.pizza}をなるはやでお届けします`
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
