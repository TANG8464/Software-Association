import token from './token'

const ws = new WebSocket('ws://127.0.0.1:1234/socket/notice')
let sendTimmer = null;
let sendCount = 0;

ws.onopen = function() {
    console.log('@open');

    sendCount++;
    ws.send({ "HEADER-TOKEN": token.getHeaderToken });

    sendTimmer = setInterval(function() {
        sendCount++;
        ws.send('Hi Server!' + sendCount);

        if (sendCount === 10) {
            ws.close();
        }
    }, 2000);
};
ws.onmessage = function(e) {
    console.log('@message');
    console.log(e.data);
};
ws.onclose = function() {
    console.log('@close');
    sendTimmer && clearInterval(sendTimmer);
};
ws.onerror = function() {
    console.log('@error');
};