// const HtmlTableToJson = require('html-table-to-json');

const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http      = require('http'),
              https     = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};

var res = []
var rank = 1;

function parseOne(src) {
    var work = src;
    work = work.substring(work.indexOf("_blank")+8);  // Start of Name
    var name = work.substring(0,work.indexOf("<"));
 //   console.log("name",name);
    work = work.substring(work.indexOf("\">")+2);
    var height = work.substring(0,work.indexOf("'"));
 //   console.log("height",height);
    work = work.substring(work.indexOf("lat")+4);
    var lat = work.substring(0,work.indexOf("&"));
    work = work.substring(work.indexOf("lon")+4);
    var lng = work.substring(0,work.indexOf("&"));
 //   console.log("lat lng",lat,lng)
    return {"Name":name,
            "Lat": parseFloat(lat),
            "Lng": parseFloat(lng),
            "Height": parseFloat(height),
            "Status": [],
            "Pics": [],
            }
}

(async (url) => {
    var html = await getScript(url);
    html = html.substring(html.indexOf("<table>"));

    while (html.indexOf("<tr>") != -1) {
        res.push(parseOne(html));
        html = html.substring(html.indexOf('<tr>')+3);
    }

    for (var i=0;i<res.length;i++) {
        console.log("{");
        console.log("   \"Name\": \"",res[i].Name,"\",")
        console.log("   \"Tags\": [\"Puu\"],")
        console.log("   \"Lat\":",res[i].Lat,",")
        console.log("   \"Lng\":",res[i].Lng,",")
        console.log("   \"Height\":",res[i].Height,",")
        console.log("   \"Status\": [],")
        console.log("   \"Pics\": [],")
        console.log("},")
    }


})('https://listsofjohn.com/searchres?c=978&sort=&State=HI');