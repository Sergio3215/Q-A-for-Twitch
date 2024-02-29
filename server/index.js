const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();

// client.on('connectFailed', function(error) {
//     console.log('Connect Error: ' + error.toString());
// });

let user = "principiante_en_programar";
let password = "oauth:kxq6rnrq7kbguntrpc5uhltoor0h0k"
let channel = "#principiante_en_programar"

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    connection.sendUTF('PASS '+password);
    connection.sendUTF('NICK '+user);

    connection.sendUTF('JOIN #principiante_en_programar,#principiante_en_programar');

    connection.sendUTF('PRIVMSG #principiante_en_programar :HeyGuys <3 PartyTime test del bot ');
    // Set a timer to post future 'move' messages. This timer can be
    // reset if the user passes, !move [minutes], in chat.

    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function () {
        console.log('Connection Closed');
        console.log(`close description: ${connection.closeDescription}`);
        console.log(`close reason code: ${connection.closeReasonCode}`);
    });

    connection.on('message', function (msg) {
        if(msg.type === 'utf8'){
            console.log(msg.utf8Data)
        }
    });

});

client.connect('ws://irc-ws.chat.twitch.tv:80');