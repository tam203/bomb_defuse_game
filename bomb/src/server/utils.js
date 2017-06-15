function safeTeamId(id){
    return id.replace('/','__').replace('\\','--');
}

module.exports = {safeTeamId:safeTeamId};
