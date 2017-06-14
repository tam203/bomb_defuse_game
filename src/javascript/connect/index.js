import {getCode} from '../globalsAndState';
const io = require('socket.io-client');

var listners = {};
var socket;

const MSG_TYPE = {'DATAFLOW_IN_AREA':'dataFlowInArea'}

function connect(){
    socket = io('http://localhost:3000');
    socket.emit("register", {code: getCode()});
    socket.on("msg", process);
}

function process(msg){
    var listenList = listners[msg.type];
    if(listenList){
        for (var i = 0; i < listenList.length; i++) {
            listenList[i](msg['msg']);
        }
    }
}

function message(type, msg){
    if(!socket){
        connect();
    }
    socket.emit("msg", {'type':type, 'msg':msg});
}


function listen(type, callback){
    if(!socket){
        connect();
    }
    var listenList = listners[type] = (listen[type])? listen[type] : [];
    listenList.push(callback);
}

export {listen, message, MSG_TYPE};
