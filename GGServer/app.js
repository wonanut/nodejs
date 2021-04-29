var ws = require('nodejs-websocket')

var server = ws.createServer(function(conn) {
    // 处理服务器端接收的消息
    conn.on('text', function(json) {
        var data = JSON.parse(json)
        console.log(data.name + '进入游戏');
        switch (data.type) {
            case 'PLAYER_LOGIN':
                conn.nickname = data.name;

                // 给当前客户端发送登录成功消息
                singleConnect(conn, JSON.stringify({
                    type: 'SERVER_LOGINSTATUS',
                    message: 'success'
                }))
                
                // 在大厅广播消息
                boardcast(JSON.stringify({
                    type: 'SERVER_BORADCAST_ALL',
                    message: data.name + '进入游戏',
                    player_list: getAllPlayerName()
                }));

                break;

            default:
                break;
        }
    });

    // 处理客户端关闭的情况
    conn.on('close', function() {
        boardcast(JSON.stringify({
            type: 'SERVER_BORADCAST_ALL',
            message: conn.nickname + '离开游戏'
        }));
    });
    
    // 处理异常情况
    conn.on('error', function(error) {
        console.log("[Error] ", error);
    });
    
}).listen(12345);

// 定义广播函数 服务器可以使用该函数向所有的客户端发送消息
function boardcast(str) {
    server.connections.forEach(function(conn) {
        conn.sendText(str);
    });
}

function singleConnect(conn, str) {
    conn.sendText(str);
}

function getAllPlayerName() {
    var playerList = [];
    server.connections.forEach(function(conn) {
        playerList.push({"name": conn.nickname});
    });

    return playerList;
}
