const JsonDB = require('node-json-db');
var db = new JsonDB("players", true, false);

function idToPath(teamCode){
    return '/teams/' + teamCode;
}

function get(teamCode){
    var path = idToPath(teamCode);
    var currentRecord = {};
    currentRecord = db.getData(path);
    return currentRecord;
}

function getOrCreate(teamCode){
    var currentRecord = {};
    try { // get the team data
        currentRecord = get(teamCode);
    } catch(error) {
        currentRecord = {
            name:teamCode,
            startAt: (new Date()).getTime(),
            state:"playing",
            defuseAttempts:0
        }
        db.push(idToPath(teamCode), currentRecord);
    }
    return currentRecord;
}

function update(teamCode, stats){
    db.push(idToPath(teamCode), stats);
}

module.exports = {get:get, getOrCreate:getOrCreate, update:update}
