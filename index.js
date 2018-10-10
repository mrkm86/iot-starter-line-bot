// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const dialogflow = require("dialogflow");


// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};


// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);


// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);


// Dialogflowのクライアントインスタンスを作成
const session_client = new dialogflow.SessionsClient({
    project_id: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDRTTnh3s4YbHQo\nR1R5pSMnGUk9GbTHxuvnS3J9iXIPrbUGotHlgwkiZuFoDV2a+M5GvOX0NdpBFpR3\nTER5lCom6gcrpvCoiPOgc0n7ZvccfIBc1gPTBSnXx8SRUpF9vvlYqvOJ7rhfC1eU\nZwZ4F+Xk90i29uvgiJbQYX0hF7Vb3mRMiFAsxrNfDcP4X9JiJ2WjtDGLrsoIQ7Ep\nV6OhjyqFDUC6qzAP2AParSh3ukq3YmnV3Vaz/i8quX+0135jXFgcbgRT09PamFP9\nD9OZmg0x4hHOt9PiDFAubi8CcPq5gLk9XxJBLWvMKzML06A/+JNGs+dm6hE6VrjT\nMr4vRZxDAgMBAAECggEABUm2syk+aUxgKl5Z5J0ShG1SnrFuzFRsUAErekrupAcJ\n5TidyN/kyFKWdTgg3UCzK6YUZFJat2ug8RVjVyJ4CZ543C2z+deKH9dUA5YoPgiY\nIi7cw2sKYy80YvDP9qjA2kHdnTgDp3lC1w5THY/njW4Msk33NBwAyOVEMaS1Sldb\npbUYs8WIf4qrc3Lz/Y+Gt2Pxg4ub39moBGSYAY2+qFYO7ZbZh3tVo2qDmdeYGnbZ\nNDpgiy4o1ufPTWCgYT06FjoVZZxVi7sw1LwIU+HmUbCzesiNHazwPnCZj+42/eBA\nCnxFLzhqW8ytFqGJ3LbU/oZZs9FJ+i8M+gRgO73IWQKBgQD5aXOX+xuKTh64Kxk+\n9p3Kh6JODfXcct0oiOzR8WL9YHBpxDP2FX3/dsDXRt1QSJRtOdJzE2gLJ2XRftxF\nBoOwK0x8MU+jM54W2WWG9LVQvGCimkrvCcv5BZFhZ0tn/nlK94r1+fGhLBDqW2lD\njP34R54D/zBqv2PHglvLKOXu2wKBgQDW1IuEPoHNcqLBAhjZPRpB61QrCtsYaPdg\nCKLBKgmGY9fWyQto0NwYqzeaVHFSTICpl8kEp+f2Nci+rRIUqdcGPY1zsG1eKTF9\nCkm8R3IIfENfyADg/I/2nC1ORcJGp7i2L73Ml41oGu93lHtLA2x417R0nWIojBB0\nmtYqaBQAuQKBgQC7CIMww5QBgVe0EE3cU6A8kr35/qoS6OhET3oYbgYnsDxcdE/r\nCG72Nh2i0neAjw0PY78XoMPzKVZHZfTUpm/2mmG++FOaNUkmJVzneXbG1p05Eq+C\n1jvpwG0nOAjqMYDP4RaKIyc6EAuXU3l6uK5zk3FB2gp64o92u6EOltrm5QKBgQCI\nynmz0SFRskbT4wPzf6ayhqfnaFgt6NhrO9R2bs/11KlgyE8NhMBArPUQvegSYUgj\ntNR4tHlNGt4iG43Bvot+G79wBMz/AffTCLP+wPdpU8aKvI1itS7t9nAawOx9lNpW\nl3uhRHbz7QLB/7eqAhoVsDPldTlFXDo2JUltYywpcQKBgQCLGUWYsJjArr7SOuLx\nBsWpGP0sROwWENJM6uKZ8w3bcXy8DNlCehMDFSvoRxl8HOzalauQzr9SuqawvaQT\nR0UwegSmx6YPj7CO345K5KFd/JuifYQJzk5W03yxfD/YCj3vW+hoh44hhqqqxlYq\nj3PkxmLXNoVdNN3tDWD/HRqtCw==\n-----END PRIVATE KEY-----\n"
        //private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    }
});


// -----------------------------------------------------------------------------
// ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
            if (event.message.text == "こんにちは"){
                // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "これはこれは"
                }));
            }

            console.log(event.message.text);

            events_processed.push(
                session_client.detectIntent({
                    session: session_client.sessionPath(process.env.GOOGLE_PROJECT_ID, event.source.userId),
                    queryInput: {
                        text: {
                            text: event.message.text,
                            languageCode: "ja",
                        }
                    }
                }).then((responses) => {

                    console.log(responses[0]);

                    if (responses[0].queryResult && responses[0].queryResult.action == "handle-check-device-status"){
                        let message_text
                        //if (responses[0].queryResult.parameters.fields.menu.stringValue){
                        //    message_text = `毎度！${responses[0].queryResult.parameters.fields.menu.stringValue}ね。どちらにお届けしましょ？`;
                        //} else {
                        //    message_text = `毎度！ご注文は？`;
                            message_text = "おお。働き者だね。";
                        //}
                        return bot.replyMessage(event.replyToken, {
                            type: "text",
                            text: message_text
                        });
                    }
                })
            );

        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});