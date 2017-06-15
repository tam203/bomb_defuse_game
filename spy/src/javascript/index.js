import dataFlowApp from './dataflow';
import dataFilterApp from './datafilter';
const queryString = require('query-string');
import {chatView} from './chat';
import {welcomeView} from './welcome';

var tool = queryString.parse(location.search)['tool'];
switch (tool) {
    case "chat":
        chatView();
        break;
    case "dataFlow":
        dataFlowApp();
        break;
    case "dataFilter":
        dataFilterApp();
        break;
    default:
        welcomeView();
        break;
}
