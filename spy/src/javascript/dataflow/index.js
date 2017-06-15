import scene from './scene.html'
import dataFiles from '../datafiles';
const doT =  require('dot');
const shuffle = require('shuffle-array');
import {message, MSG_TYPE} from '../connect';
import {LOCATIONS, notifyInArea} from '../location';
import {renderView} from '../globalsAndState';

// local Gloobals
var inArea = false;
var dataStreams = [];
var colors = ['red', 'green' ,'blue', 'pink','yellow'];
var offset = [1, 0.5, 0, -0.5, 1];
shuffle(colors);
shuffle(offset);

dataFiles.forEach((item)=>{
    var color = colors.pop();
    dataStreams.push({
        xVals:patToVals(item.pattern),
        z:offset.pop(),
        color:color,
        pattern: item.pattern,
        id:'data_' + color,
        aniDuration: 3000 + 3000*Math.random()
    });
});

function play(){
    renderView(doT.template(scene)(dataStreams));
    notifyInArea(LOCATIONS['office'], areaChange);
}

function areaChange(nowInArea){
    inArea = nowInArea;
    message(MSG_TYPE.DATAFLOW_IN_AREA, inArea);
}

function patToVals(pattern){
    var count = -30;
    var xVals = [];
    for(var i=0; i<pattern.length; i++){
        var symbol = pattern[i];
        if(symbol === '_'){
            count += 3;
        } else {
            xVals.push(count);
        }
        count += 1;
    }
    return xVals;
}

export default play;
