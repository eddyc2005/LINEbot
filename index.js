var linebot = require('linebot');
var express = require('express');

var bot = linebot({
    channelId: '1647433696',
    channelSecret: 'f6c7469a8be7963b38a15729d432ebf9',
    channelAccessToken: 'e/dsgwo/uANnGgm5zw0ccc03ERo8GRswTCxTcA6/qSVVvt1eHk/wxV69E6u7eQsH3Pnnvez+ZV13yh67ssxok5jXqNilT4EG/TRNA8ZucA374z5E/Yc+OrWJC8m12geqUYOkbgtDH7eR2DHPImOLSwdB04t89/1O/w1cDnyilFU='
});

//這一段的程式是專門處理當有人傳送文字訊息給LineBot時，我們的處理回應
bot.on('message', function(event) {
    if (event.message.type = 'text') {
        var msg = event.message.text;
        //收到文字訊息時，直接把收到的訊息傳回去
        event.reply(msg).then(function(data) {
            // 傳送訊息成功時，可在此寫程式碼
            console.log(msg);
        }).catch(function(error) {
            // 傳送訊息失敗時，可在此寫程式碼
            console.log('錯誤產生，錯誤碼：'+error);
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