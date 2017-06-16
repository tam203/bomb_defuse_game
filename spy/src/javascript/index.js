import dataFlowApp from './dataflow';
import dataFilterApp from './datafilter';
const queryString = require('query-string');
import {chatView} from './chat';
import {welcomeView} from './welcome';
import {isDead} from './globalsAndState';

function endIfDead(){
    isDead().then(dead=>{
        if(dead){
            location = "/stats/bang?msg="+dead;
        }
    });
}


var tool = queryString.parse(location.search)['tool'];
switch (tool) {
    case "chat":
        endIfDead();
        chatView();
        break;
    case "dataFlow":
        endIfDead();
        dataFlowApp();
        break;
    case "dataFilter":
        endIfDead();
        dataFilterApp();
        break;
    default:
        welcomeView();
        break;
}
