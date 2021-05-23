/* 
 * AUTHOR: Howard Wonanut
 * DATE: 2021-05
 * DESC: This is the core file for the Grid-Game online server which is in charge of all the connections with
 * clients. All the connections between server and clients are based on websocket plugins provide by
 * Node.js.
 */

// 特别说明 当前版本服务器是单线程的，服务器使用一个线程与所有客户端通信

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

// 在线游戏匹配队列，以字典的形式存储（玩家昵称：连接对象）
var prepare_queue = {};
// 在线游戏房间，以字典的形式存储（房间ID：{玩家昵称：连接对象}）
var online_rooms = {};

var server = ws.createServer(function(conn) {
    // 处理服务器端接收的消息
    conn.on('text', function(json) {
        var data = JSON.parse(json)
        console.log(data.name + ': ' + data.type);
        switch (data.type) {
            // 用户登陆
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
            
            // 进入匹配队列
            case 'PLAYER_PREPARE':
                conn.status = PlayerStatus.PREPARE;
                // 如果该玩家名字已经在队列中，将异常信息写在message中
                if (prepare_queue.hasOwnProperty(conn.nickname)) {
                    mesg = "该玩家名已经在匹配队列中，玩家名可能重复或者有非法操作";
                }
                else {
                    prepare_queue[conn.nickname] = conn;
                    mesg = "ok";
                }

                // 广播消息 更新玩家列表
                boardcast(JSON.stringify({
                    type: 'SERVER_BORADCAST_NEW_PREPARE',
                    message: mesg,
                    player_list: getAllPlayerName()
                }));

                // 组播消息 发送当前在匹配队列中的玩家列表
                multicast(
                    prepare_queue,
                    JSON.stringify({
                        type: 'SERVER_MULTICAST_PREPARE_QUEUE',
                        prepare_list: Object.keys(prepare_queue)
                    })
                )

                // 如果当前在匹配队列中的玩家人数等于4，将这四位玩家的信息从匹配队列中转移到新的游戏房间中
                if (Object.keys(prepare_queue).length == 4) {
                    handleCreateNewRoom(4);
                }
                break;

            // 离开匹配队列
            case 'PLAYER_CANCEL_PREPARE':
                conn.status = PlayerStatus.ONHALL;
                // 这里也需要进行异常情况检测
                if (prepare_queue.hasOwnProperty(conn.nickname)) {
                    delete prepare_queue[conn.nickname];
                    mesg = "ok";
                }
                else {
                    mesg = "该玩家名不在匹配队列中";
                }

                // 广播消息 更新玩家列表
                boardcast(JSON.stringify({
                    type: 'SERVER_BORADCAST_CANCEL_PREPARE',
                    message: mesg,
                    player_list: getAllPlayerName()
                }));

                // 组播消息 发送当前在匹配队列中的玩家列表
                multicast(
                    prepare_queue,
                    JSON.stringify({
                        type: 'SERVER_MULTICAST_PREPARE_QUEUE',
                        prepare_list: Object.keys(prepare_queue)
                    })
                )
                break;

            // 开始离线游戏
            case 'PLAYER_START_OFFLINE_GAME':
                conn.status = PlayerStatus.PLAY_OFFLINE;
                boardcast(JSON.stringify({
                    type: 'SERVER_BORADCAST_START_OFFLINE_GAME',
                    player_list: getAllPlayerName()
                }));
                break;

            // 退出离线游戏
            case 'PLAYER_QUIT_OFFLINE_GAME':
                conn.status = PlayerStatus.ONHALL;
                boardcast(JSON.stringify({
                    type: 'SERVER_BORADCAST_QUIT_OFFLINE_GAME',
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

// 定义组播函数 服务器可以使用该函数向指定客户端群体发送消息
function multicast(queue, str) {
    for (var name in queue) {
        let conn = queue[name];
        try {
            conn.sendText(str);
        } catch (error) {
            console.error("Error while connecting to " + name);
            delete queue[name];
        }
    }
}

// 服务器和某个客户端单向通信
function singleConnect(conn, str) {
    conn.sendText(str);
}

// 获取所有玩家信息
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

// 将当前匹配队列中的玩家移动到一个新的房间中
// player_count 为游戏模式中的玩家数量，可以是2或者4，默认值为4
function handleCreateNewRoom(player_count = 4) {
    if (Object.keys(prepare_queue).length < player_count) {
        return;
    }

    var room_id = createRoomID();
    var room = {};

    for (var name in prepare_queue) {
        room[name] = prepare_queue[name];
        delete prepare_queue[name];

        player_count -= 1;
        if (player_count == 0) break;        
    }

    // 将新创建的房间添加到所有在线房间中统一管理，key为房间对应的ID
    online_rooms[room_id] = room;

    // 向客户端组播创建房间成功的消息
    multicast(
        room,
        JSON.stringify({
            type: 'SERVER_MULTICAST_CREATE_ROOM',
            room_id: room_id,
            player_list: Object.keys(room)
        })
    )
}

// 生成房间号，需要核对生成的房间号是否会发生冲突
function createRoomID() {
    var room_name = __createRoomID();
    while (__checkRoomIDConflict(room_name)) {
        room_name = __createRoomID();
    }

    return room_name;
}

// 内部函数，生成一次房间号，不考虑是否会发生冲突
function __createRoomID() {
    var room_name = "ROOM_";
    var alphbat_dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 8; i++) {
        room_name += alphbat_dict[Math.floor(Math.random()*alphbat_dict.length)];
    }
    return room_name;
}

// 内部函数，用于检测该room_name是否与当前房间ID发生冲突
function __checkRoomIDConflict(room_name) {
    return false;
}