// 引用linebot SDK
var linebot = require('linebot');
var express = require('express');


// 填入辨識Line Channel的資訊
var bot = linebot({
    channelId: '1647433696',
    channelSecret: 'f6c7469a8be7963b38a15729d432ebf9',
    channelAccessToken: 'e/dsgwo/uANnGgm5zw0ccc03ERo8GRswTCxTcA6/qSVVvt1eHk/wxV69E6u7eQsH3Pnnvez+ZV13yh67ssxok5jXqNilT4EG/TRNA8ZucA374z5E/Yc+OrWJC8m12geqUYOkbgtDH7eR2DHPImOLSwdB04t89/1O/w1cDnyilFU='
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    // event.message.text是使用者傳給bot的訊息
    // 準備要回傳的內容
    var replyMsg = `Hello你剛才說的是:${event.message.text}`;
    if(event.message.text == '嗨'){
        event.reply('幹').then(function (data) {
            // 當訊息成功回傳後的處理
        }).catch(function (error) {
            // 當訊息回傳失敗後的處理
        });
    }else{
        event.reply(replyMsg).then(function (data) {
            // 當訊息成功回傳後的處理
        }).catch(function (error) {
            // 當訊息回傳失敗後的處理
        });
    }
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log('目前的port是', port);
});