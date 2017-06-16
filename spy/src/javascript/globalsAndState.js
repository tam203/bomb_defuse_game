const queryString = require('query-string');
const BOMB_SERVER_ADDRESS = "http://localhost:3300";


var teamCode = null;
var teamState = null;
const solveTimeInMin = 60;


function getTeamState(successCb, errorCb){
    if(teamState){
        return Promise.resolve(teamState);
    }
    return fetch('/stats/teamProgress/' + getCode())
        .then(res => res.json())
        .then(state => {
            state.timeLeft = solveTimeInMin*60 - ((new Date()).getTime() - state.startAt)/1000;
            teamState = state;
            return state;
        }
    );
}

function isDead(){
    return getTeamState().then(state => {
        if(state.state !== "playing") {
            return "Already finished game with result " + state.state + ", " + state.stateReason;
        }
        if(state.timeLeft < 0) {
            return "Out of time - bang!";
        }
        return "";
    });
}

function getCode(){
    if(teamCode){
        return teamCode;
    }
    var parsed = queryString.parse(location.search);
    var code = parsed['teamCode'];
    if(!code){
        code = prompt('What is your team code?');
    }
    if(!code){
        alert('Can not go on as I\'ve not got your team code. Things will break.');
    }
    teamCode = code;
    return code;
}

function makeToolUrl(tool){
    var parsed = queryString.parse(location.search);
    if(teamCode){
        parsed.teamCode = teamCode;
    }
    parsed.tool = tool;
    return '?' + queryString.stringify(parsed);
}

function renderView(html){
    var container = document.getElementById('sceneContainer');
    container.innerHTML = html;
}

export {isDead, getCode, makeToolUrl, renderView, getTeamState};
