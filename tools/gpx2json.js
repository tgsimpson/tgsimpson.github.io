

var fs = require('fs');

let gpxParser = require('gpxparser');
var gpx = new gpxParser();


var readMe = fs.readFileSync(process.argv[2], 'utf-8');

gpx.parse(readMe)

console.log(gpx);

if (false) {
    //console.log("tracks",gpx.tracks.length,gpx.tracks[0])
    console.log ("TheTrail = [")
    for (var i=0;i<gpx.tracks[0].points.length;i++) {
        console.log("{\"lat\":",gpx.tracks[0].points[i].lat,",")
        console.log("\"lng\":",gpx.tracks[0].points[i].lon,"},")    
    //    console.log("\"ele\":",gpx.tracks[0].points[i].ele,",")
    //    console.log("\"time\":",gpx.tracks[0].points[i].time,"},")
    }
    console.log("]")

}





