const LOCATIONS = {
    greenHouse:{
        name:'the green house',
        bbox: {
            lat:{min:50.7270330432, max:50.7273993944},
            lon:{min:-3.4744014227, max:-3.4739039457}
        }
    },
    generators:  {
        name:'generators',
        bbox: {
            lat:{min:50.72783509, max:50.7282748315},
            lon:{min:-3.4750579298, max:-3.4741419554}
        }
    },
    office: {
        name: 'office',
        bbox: {
            lat: {min:50.7266015848, max:50.728111839},
            lon: {min:-3.4767188877, max:-3.4737986326}
        }
    }
};


var watch = null;
function startWatch(){
    if(!watch){
        watch = navigator.geolocation.watchPosition(update, error, {enableHighAccuracy: true});
    }
}

var areaCallbacks = []
function notifyInArea(area, callback){
    startWatch();
    areaCallbacks.push({'area':area, 'cb':callback});
}

function update(loc){
    for (var i = 0; i < areaCallbacks.length; i++) {
        var area = areaCallbacks[i];
        area['cb'](inside(loc.coords, area['area']));
    }
}

function inside(point, area){
    return (point.latitude < area.bbox.lat.max && point.latitude > area.bbox.lat.min &&
            point.longitude < area.bbox.lon.max && point.longitude > area.bbox.lon.min);
}

function error(err){
    alert('Error getting location. We can not go on! ' + String(err));
}


export {LOCATIONS, notifyInArea};
