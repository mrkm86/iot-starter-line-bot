"use strict";

/*
** Import Packages
*/
const server = require("express")();
const bot_express = require("bot-express");

/*
** Middleware Configuration
*/
server.listen(process.env.PORT || 5000, () => {
    console.log("server is running...");
});

server.use('/bot/webhook', bot_express({
    language: "ja",
    messenger: {
        line: {
            channel_id: process.env.LINE_CHANNEL_ID,
            channel_secret: process.env.LINE_CHANNEL_SECRET
        },
        facebook: {
            app_secret: process.env.FACEBOOK_APP_SECRET,
            page_access_token: [
                {page_id: process.env.FACEBOOK_PAGE_ID, page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN}
            ],
        },
        google: {
            project_id: process.env.GOOGLE_PROJECT_ID
        }
    },
    nlu: {
        type: "dialogflow",
        options: {
            project_id: process.env.GOOGLE_PROJECT_ID,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
            language: "ja"
        }
    },
    parser: [{
        type: "dialogflow",
        options: {
            project_id: process.env.GOOGLE_PROJECT_ID,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
            language: "ja"
        }
    }],
    memory: {
        type: process.env.MEMORY_TYPE, // memory-cache | redis | mongodb
        retention: Number(process.env.MEMORY_RETENTION),
        // redis
        options: {
            url: process.env.REDIS_URL
        }
        // mongodb
        /*
        options: {
            url: process.env.MONGODB_URL
        }
        */
    },
    translator: {
        type: "google",
        enable_lang_detection: true,
        enable_translation: false,
        options: {
            project_id: process.env.GOOGLE_PROJECT_ID,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        }
    },
    skill: {
        beacon: {
            enter: "survey",
            leave: "bye"
        },
        follow: "say-welcome",
        unfollow: "clear-context",
        join: "say-welcome",
        leave: "clear-context"
    },
    modify_previous_parameter_intent: "modify-previous-parameter"
}));

module.exports = server;