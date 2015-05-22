var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    querystring = require('querystring');

var corsHeaders = {};
corsHeaders["Access-Control-Allow-Origin"] = "*";
corsHeaders["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Accept";

var aso = '../../public_html/data/';
var local = 'data/';
var preface = local;

var server = http.createServer().listen(3000);
//
server.on('request', function(request, response) {
    //make local and server require file for url changes
    //var pathname = url.parse(request.url).pathname;
    //var query = url.parse(request.url, true).query;
    if (request.method == 'GET') {
        var requestOptions =  url.parse(request.url, true);
        console.log('PathName: ' + requestOptions.pathname + " Query: " + JSON.stringify(requestOptions.query));
        if (requestOptions.pathname == '/loadChar') {
            var string = preface + requestOptions.query['user'] + '/' + requestOptions.query['url'];
            fs.readFile(string, 'utf8', function (err, file) {
                if (err) {
                    if (err.code === 'ENOENT')
                        file = '';
                    else if (err.code !== 'ENOENT')
                        throw err;
                }
                response.writeHead(200, corsHeaders);
                response.end(file);
            });
        }
        else if (requestOptions.pathname == '/user') {
            console.log(preface + requestOptions.query['name'] + '/charList.json');
            fs.readFile(preface + requestOptions.query['name'] + '/charList.json', 'utf8', function (err, file) {
                if (err) {
                    if (err.code === 'ENOENT')
                        file = '';
                    else if (err.code !== 'ENOENT')
                        throw err;
                }
                response.writeHead(200, corsHeaders);
                response.end(file);
            });
        }
    }
    else if (request.method == 'OPTIONS') {
        response.writeHead(200, corsHeaders);
        response.end();
    }
    else if (request.method == 'POST') {
        // LOOK TO SEND INFO IN HEADERS!
        var postData = '';
        var decoded;
        request.on('data', function(chunk) {
            postData += chunk.toString();
        });
        request.on('end', function() {
            response.writeHead(200, 'OK', corsHeaders);
            response.end();
            decoded = JSON.parse(postData);

            fs.writeFile(preface + decoded['user'] + '/' + decoded['url'], decoded['data'], 'utf8', function(err, file) {
                if (err) throw err;

            });
        });
    }
    //response.writeHead(200, {'Content-Type': 'text/plain'});
   // response.write('Dick, Really?');
    //response.end();
});