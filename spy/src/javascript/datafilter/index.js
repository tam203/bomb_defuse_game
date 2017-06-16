import scene from './scene.html';
import sampleView from './sampleView.html';
import dataFiles from '../datafiles';
import {LOCATIONS, notifyInArea} from '../location'
import {listen, MSG_TYPE} from '../connect';
import '../connect';
import {renderView} from '../globalsAndState';
const doT = require('dot');


// Local globals
var sampled = [];
var dataOn = false;
var inArea = false;
var partnerInArea = false;
var model = {
    numData:50
}

// init model with rnd data
model.points = [];
for(var i=0; i<model.numData; i++){
    model.points.push({
        id:'data_' + i,
        dist:100*i/model.numData,
        speed:Math.random() + 0.1
    });
}

function play(){
    renderView(doT.template(scene)(model));
    setInterval(annimate, 50);
    document.getElementById('sample').addEventListener('click', sample);
    document.getElementById('clear').addEventListener('click', clear);
    document.getElementById('download').addEventListener('click', download);

    console.log('check area')
    notifyInArea(LOCATIONS['office'], locUpdate);
    listen(MSG_TYPE.DATAFLOW_IN_AREA, partnerInAreaChange);
}

function partnerInAreaChange(inArea){
    partnerInArea = inArea;
    updateDataState();
}
function locUpdate(userInArea){
    inArea = userInArea;
    updateDataState();
}
function updateDataState(){
    dataOn = inArea && partnerInArea;
    var ele = document.getElementById('dataContainer');
    ele.style.display = (dataOn)? "block":"none";
}

function sample(){
    if (!dataOn){
        return; // If no data don't sample.
    }
    if(sampled.length !== 0){
        var last = sampled[sampled.length -1];
        var stamp = new Date();
        var delay = (stamp - last.stamp) / 100;
        var runningDelay = last.runningDelay + delay;
        sampled.push({stamp:stamp, delay: delay, runningDelay:runningDelay});
    } else {
        sampled.push({stamp:new Date(), delay:0, runningDelay:0});
    }
    showSampled();
}

function clear(){
    sampled = [];
    showSampled();
}

function showSampled(){
    var container = document.getElementById('sampleView');
    container.innerHTML =  doT.template(sampleView)(sampled);

}

function download(){
    var pat = sampleToPattern();
    var matchs = dataFiles.filter(item => item.pattern === pat);
    if(pat.length == 0){
        alert('No data');
    } else if(matchs.length == 1){
        clear();
        window.open(matchs[0].file, '_blank');
    } else {
        alert('Curupt');
        clear();
    }
}

function sampleToPattern(){
    if(sampled.length <= 0){
        return "";
    }

    var maxDelay = 0;
    var minDelay = 1000000;
    var patten = ".";

    for(var i=1; i<sampled.length; i++){
        var sample = sampled[i];
        minDelay = (minDelay < sample.delay)? minDelay:sample.delay;
    }
    for(var i=1; i<sampled.length; i++){
        var sample = sampled[i];
        var interval = Math.round(((sample.delay /minDelay) - 1) /3)
        patten += '_'.repeat(interval) + '.';
    }

    return patten.split("").reverse().join("");
}

function annimate(){
    for(var i=0; i<model.points.length; i++){
        var point = model.points[i];
        point.dist += point.speed;
        if(point.dist > 100){
            point.dist = -1;
        }
        var ele = document.getElementById(point.id);
        ele.style.left = String(point.dist) +'%';
    }
}

export default play;
