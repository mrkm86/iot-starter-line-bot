//おまじない
"use strict";


let request = require("request");
Promise = require("bluebird");
const URL_BASE = process.env.ORACLEAPEXURL 
                + "/" + process.env.WORKSPACENAME
                + "/" + process.env.RESTSERVICENAME
                + process.env.ORACLE_ACCESS_TOKEN;
console.log("----------------------------------------------------------------------");
console.log(URL_BASE);
console.log("----------------------------------------------------------------------");

Promise.promisifyAll(request);

//module.exports->ほかのモジュールから読み込み可能
module.exports = class ServiceOracle {

    //設備の稼働状況を取得する
    static get_device_status(strDeviceId) {
        let url = URL_BASE + "/" + "get_device_status?T_DEVICE_ID=" + strDeviceId;
        let headers = {
            "Content-Type": "application/json"
        }
        return request.getAsync({
            url: url,
            headers: headers,
            json: true
        }).then(
            (response) => {
                if (response.statusCode != 200) {
                    return Promise.reject(new Error("ServiceOracle.get_device_status() failed."));
                }
                return response.body.items;
            }
        );
    }
}