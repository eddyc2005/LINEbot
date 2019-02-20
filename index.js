var linebot = require('linebot');
var express = require('express');
var {google} = require("googleapis")
var googleAuth = require('google-auth-library');
var fs = require('fs');
var authorize = require('node-authorization');
var request = require('request');


var bot = linebot({
    channelId: '1647433696',
    channelSecret: 'f6c7469a8be7963b38a15729d432ebf9',
    channelAccessToken: 'HSYNCnsYNe4Xh9g6PdsQZhlh4gEhar4AKbY5+h5BoOUwAE9lXO7AixNcU9cL07/M3Pnnvez+ZV13yh67ssxok5jXqNilT4EG/TRNA8ZucA36/1C4h1MU6b4DgNaVaJG1mlWfueKdHucO5QFx2FOjBQdB04t89/1O/w1cDnyilFU='
});


//回你說的話

// //這一段的程式是專門處理當有人傳送文字訊息給LineBot時，我們的處理回應
// bot.on('message', function(event) {
//     if (event.message.type = 'text') {
//         var msg = event.message.text;
//         //收到文字訊息時，直接把收到的訊息傳回去
//         event.reply(msg).then(function(data) {
//             // 傳送訊息成功時，可在此寫程式碼
//             console.log(msg);
//         }).catch(function(error) {
//             // 傳送訊息失敗時，可在此寫程式碼
//             console.log('錯誤產生，錯誤碼：'+error);
//         });
//     }
// });
//
// const app = express();
// const linebotParser = bot.parser();
// app.post('/', linebotParser);
//
// var server = app.listen(process.env.PORT || 8080, function() {
//     var port = server.address().port;
//     console.log('目前的port是', port);
// });


//with google sheets api

//底下輸入client_secret.json檔案的內容
var myClientSecret = {
    "installed": {
        "client_id": "313947403140-cifnbeh5njq2599dhd9849sjtucbvamp.apps.googleusercontent.com",
        "project_id": "sunlit-wall-232108",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "zKxVRwFp6AIgmodLQggaNVvE",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    }
}

var auth = new googleAuth();
var oauth2Client = new google.auth.OAuth2(myClientSecret.installed.client_id, myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

//底下輸入sheetsapi.json檔案的內容
oauth2Client.credentials = {
    "access_token": "ya29.Glu1BqFmF3z3OtkBUr024AkndG52cmNUv97LuJWwy1xIJq1Ootdt03lhrNcK24zYzdwxvEfxbkHiBpGTiRr-AuHHfL-0SqSiu5ney8XFOvA1nZ8dmPQOlaCXN6BI",
    "refresh_token": "1/BGGJjKuNmnm4kC_jwJe9dD-RSZjjn7xVpHR5ReRqBtk",
    "scope": "https://www.googleapis.com/auth/spreadsheets",
    "token_type": "Bearer",
    "expiry_date": 1550576476783
}

//試算表的ID，引號不能刪掉
var mySheetId = '1S1UMVJ-c942MpfOj5QBEHt2fsbGZzQi-yGLA1xKjle0';

var myQuestions = [];
var users = [];
var totalSteps = 0;
var myReplies = [];

//程式啟動後會去讀取試算表內的問題
getQuestions();


//這是讀取問題的函式
function getQuestions() {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: encodeURI('test!A1:B'),
    }, function (err, response) {
        if (err) {
            console.log('讀取問題檔的API產生問題：' + err);
            return;
        }

        var rows = response.data.values;
        if (rows.length == 0) {
            console.log('No data found.');
        } else {
            myQuestions = rows;
            totalSteps = myQuestions[0].length;
            console.log('問題更新完畢！');
        }
    });
}

//這是將取得的資料儲存進試算表的函式
function appendMyRow(userId) {
    var request = {
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: encodeURI('responses'),
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        resource: {
            'values': [
                users[userId].replies
            ]
        }
    };
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.append(request, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
    });
}

//LineBot收到user的文字訊息時的處理函式
bot.on('message', function (event) {
        if (event.message.type === 'text') {
            //google sheet
            // var myId = event.source.userId;
            // if (users[myId] == undefined) {
            //     users[myId] = [];
            //     users[myId].userId = myId;
            //     users[myId].step = -1;
            //     users[myId].replies = [];
            // }
            // var myStep = users[myId].step;
            // if (myStep === -1)
            //     sendMessage(event, myQuestions[0][0]);
            // else {
            //     if (myStep == (totalSteps - 1))
            //         sendMessage(event, myQuestions[1][myStep]);
            //     else
            //         sendMessage(event, myQuestions[1][myStep] + '\n' + myQuestions[0][myStep + 1]);
            //     users[myId].replies[myStep + 1] = event.message.text;
            // }
            // myStep++;
            // users[myId].step = myStep;
            // if (myStep >= totalSteps) {
            //     myStep = -1;
            //     users[myId].step = myStep;
            //     users[myId].replies[0] = new Date();
            //     appendMyRow(myId);
            // }


            //回應google試算表對應文字
            var msg = event.message.text;
            //收到文字訊息時，直接把收到的訊息傳回去
            var resText = '';
            for (let i = 0; i < myQuestions.length; i++) {
                if (msg == myQuestions[i][0]) {
                    resText = myQuestions[i][1];
                }
            }
            event.reply(resText).then(function (data) {
                // 傳送訊息成功時，可在此寫程式碼
                console.log(resText);
            }).catch(function (error) {
                // 傳送訊息失敗時，可在此寫程式碼
                console.log('錯誤產生，錯誤碼：' + error);
            });
        }
    }
);


//這是發送訊息給user的函式
function sendMessage(eve, msg) {
    eve.reply(msg).then(function (data) {
        // success
        return true;
    }).catch(function (error) {
        // error
        return false;
    });
}


const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});