var ws = require('nodejs-websocket')

// 定义用户状态枚举类型
if (typeof PlayerStatus == "undefined") {
    var PlayerStatus = {};
    PlayerStatus.OFFLINE = 0;           // 离线
    PlayerStatus.ONHALL = 1;            // 在游戏大厅中
    PlayerStatus.PLAY_OFFLINE = 2;      // 正在进行单机游戏
    PlayerStatus.PREPARE = 3;           // 队列中
    PlayerStatus.PLAY_ONLINE = 4;       // 正在进行联机游戏
    PlayerStatus.MISS = 5;              // 状态丢失（产生这种状态的主要原因是中途断线）
    PlayerStatus.ERROR = 6;             // 发生其他未知错误
}

// 用户状态编码对应文字
playerStatusDecode = {
    "0": "离线",
    "1": "在线",
    "2": "单机游戏中",
    "3": "匹配中",
    "4": "联机游戏中",
    "5": "断线",
    "6": "错误"
}

var server = ws.createServer(function(conn) {
    // 处理服务器端接收的消息
    conn.on('text', function(json) {
        var data = JSON.parse(json)
        console.log(data.name + '进入游戏');
        switch (data.type) {
            case 'PLAYER_LOGIN':
                conn.nickname = data.name;
                conn.status = PlayerStatus.ONHALL;

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
            
            case 'PLAYER_PREPARE':
                console.log(data.name, data.type);
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
        playerList.push({
            "name": conn.nickname,
            "status": playerStatusDecode[conn.status]
        });
    });

    return playerList;
}
