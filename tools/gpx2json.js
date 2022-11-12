

var fs = require('fs');

let gpxParser = require('gpxparser');
var gpx = new gpxParser();

var arg = process.argv[2]
var readMe = fs.readFileSync(arg, 'utf-8');
var name = arg.substring(0, arg.indexOf('.'));

gpx.parse(readMe)

if (false) {console.log(gpx.tracks[0]);}
else {
    var pts = gpx.tracks[0].points
    var len = pts.length

    // time
    var start = new Date(pts[0].time)
    var end = new Date(pts[len-1].time)

  
    var duration = Math.abs(end-start) // in milliseconds

    //console.log("tracks",gpx.tracks.length,gpx.tracks[0])
        // elevation
    console.log ("var ",name," = {\"elevation\":{\"max\":",gpx.tracks[0].elevation.max,
                                           ",\"min\":",gpx.tracks[0].elevation.max,
                                           ",\"pos\":",gpx.tracks[0].elevation.pos,
                                           ",\"neg\":",gpx.tracks[0].elevation.neg,"},");
    console.log("\"time\": ",duration,",")
    console.log("\"distance\":",gpx.tracks[0].distance.total,",");
        // points
    console.log("\"points\":[")
    for (var i=0;i<gpx.tracks[0].points.length;i++) {
        console.log("{\"lat\":",gpx.tracks[0].points[i].lat,",")
        console.log("\"lng\":",gpx.tracks[0].points[i].lon,"},")    
    //    console.log("\"ele\":",gpx.tracks[0].points[i].ele,",")
    //    console.log("\"time\":",gpx.tracks[0].points[i].time,"},")
    }
    console.log("]}")
    

}






