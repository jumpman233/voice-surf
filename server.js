/**
 * Created by lzh on 2017/3/1.
 */

var process = require('process');

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    os = require('os');
var port = 3000;
var list = [];

function Pair(  ) {
    this.p1 = {
        name: '',
        power: -1,
        init: false
    };
    this.p2 = {
        name: '',
        power: -1,
        init: false
    };
    this.init = false;
}

http.createServer(function ( req, res ) {
    var pathName = __dirname + url.parse(req.url).pathname;

    if(pathName == __dirname + '/getPlayer'){
        var index = 0,
            p1 = true;
        if(list.length === 0){
            var pair = new Pair();
            pair.p1.init = true;
            list.push(pair);
        } else{
            var flag = false;
            for(var i = 0; i < list.length; i++) {
                if (!list[i].init) {
                    list[i].p2.init = true;
                    list[i].init = true;
                    p1 = false;
                    flag = true;
                    index = i;
                }
            }
            if(!flag){
                var pair = new Pair();
                pair.p1.init = true;
                list.push(pair);
                index = list.length - 1;
            }
        }
        res.end(JSON.stringify({
            pairNum: index,
            player: p1 ? 'p1' : 'p2'
        }));
    }

    if(pathName == __dirname + '/update'){
        var query = url.parse(req.url,true).query,
            p1 = parseInt(query.p1),
            power = query.power,
            pairNum = query.pairNum,
            _pair = list[pairNum],
            player = p1 == 1 ? _pair.p1 : _pair.p2;

        player.power = power;
        res.end('success');
    }

    if(pathName == __dirname + '/getData'){
        var query = url.parse(req.url,true).query,
            p1 = parseInt(query.player),
            _pair = list[query.pairNum],
            player = p1 == 1 ? _pair.p1 : _pair.p2;
        console.log(p1);
        console.log(p1 == 1);
        console.log(p1 === 1);

        if(player.power >= 0){
            var val = player.power;
            player.power = -1;
            res.end(val);
        } else{
            res.end('no-update');
        }
    }

    if(pathName == __dirname + '/'){
        pathName += 'index.html';
    }
    var fileType = path.extname(pathName).substring(1, pathName.length-1);
    var fileCode = 'utf-8';
    switch (fileType){
        case 'html':
            res.writeHead(200,{
                'Content-Type': 'text/html'
            });
            break;
        case 'js':
            res.writeHead(200,{
                'Content-Type': 'text/javascript'
            });
            break;
        case 'css':
            res.writeHead(200,{
                'Content-Type': 'text/css'
            });
            break;
        case 'png':
            fileCode = 'binary';
            res.writeHead(200,{
                'Content-Type': 'image/png'
            });
            break;
        case 'jpg':
            fileCode = 'binary';
            res.writeHead(200,{
                'Content-Type': 'image/jpeg'
            });
            break;
        case 'ico':
            fileCode = 'binary';
            break;
        case 'mp3':
            fileCode = 'binary';
            res.writeHead(200,{
                'Content-Type': 'audio/mp3'
            });
            break;
    }
    fs.readFile(pathName,fileCode,function ( err, data ) {
        if(!err){
            if(fileType == 'json'){
                res.end(data);
            } else{
                res.write(data,fileCode);
                res.end();   
            }
        }
    })
}).listen(port);

process.on('exit', function (  ) {
    console.log("bye!");
});

console.log("server is running at 127.0.0.1:"+port);

