import {ApiAiClient, ApiAiStreamClient} from "api-ai-javascript";
import {makeToolUrl, renderView} from '../globalsAndState';
import scene from './scene.html';
const doT = require('doT');

const client = new ApiAiClient({accessToken: '174322047e1249e2af06fe66955a9330', streamClientClass: ApiAiStreamClient});


function chat(msg){
    return client.textRequest(msg)
        .then(response => response.result.fulfillment.speech)
        .then(toolsToLinks)
        .then(processStats)
}

function processStats(msg) {
    if(msg.find('%')){
        return getTeamState().then(state => {
            var time_left = ((new Date()).getTime() - state[startAt])/1000;
            return msg.repace('%time_min', time_left);
        })
    } else {
        return msg;
    }
}
getTeamState


function toolsToLinks(msg) {
    var tools = ['dataFlow', 'chat', 'dataFilter'];
    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        msg = msg.replace('#'+tool, link(tool));
    }
    return msg;
}

function link(tool){
    return '<a href="' + makeToolUrl(tool) + '" >' + tool +'</a>';
}

function chatView(){
    renderView(doT.template(scene)());
    document.getElementById("chatForm").addEventListener('submit', sendMsg);
}

function sendMsg(e){
    e.preventDefault()
    var msg = document.getElementById('chatMsg').value;
    addToChat('<span class="you msg"><span class="speaker">You: </span>' + msg + "</span>");
    chat(msg).then(reply => addToChat('<span class="them msg"><span class="speaker">Bot: </span>' + reply + "</span>"));
}

function addToChat(msg){
    var ele = document.getElementById('chatView');
    ele.innerHTML += '<p>' + msg + '</p>';
}
export {chat, chatView};
