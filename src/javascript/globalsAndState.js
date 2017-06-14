const queryString = require('query-string');

var teamCode = null;


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

export {getCode, makeToolUrl, renderView};
