
var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('cfg.json', 'utf8'));
var logdev = require('util');
var S = require('string');

function eascapeEScharacters(queryString)
{    //
    var escChars = [ '+', '-', '=', '&&', '||', '>', '<', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '/', '\\'];
    var thestr = S(queryString);

    console.log("Before:" + thestr.toString());
    for(var i = 0; i < escChars.length; i++) {
        thestr = thestr.replaceAll(escChars[i], '\\' + escChars[i]);
    }
    console.log("After:" + thestr.toString());
    return thestr;
}

router.get('/', function (req, res, next) {

    var client = new elasticsearch.Client({
        host: cfg.serverAddress + ':' + cfg.serverPort
    });

    // @TBD Add validation check for all variables.

    var QBbyType = {};
    var searchBody = {};
    
    if(req.query.t == "full")
    {
        searchBody = {
        q: "source:*" + eascapeEScharacters(req.query.q) + "*",
        from: 0,
        size: 100,
        fields: ["directory", "filename"],
        lowercaseExpandedTerms : true,
        minScore: 0.5
        }
    }
    else if(req.query.t == "prefix")
    {
        searchBody = {
        q: "source:" + eascapeEScharacters(req.query.q) + "*",
        from: 0,
        size: 100,
        fields: ["directory", "filename"],
        lowercaseExpandedTerms : true,
        minScore: 0.5
        }
        
    }
    else if(req.query.t == "exact")
    {
        searchBody = {
        q: "source:" + "*" + eascapeEScharacters(req.query.q) + "*",
        from: 0,
        size: 100,
        fields: ["directory", "filename"],
        lowercaseExpandedTerms : true,
        minScore: 0.5
        }
        
    }
 

    client.search(searchBody).then(function (body) {
        var results = [];
        for (var i = 0, tot = body.hits.hits.length; i < tot; i++) {
            results.push({
                id: body.hits.hits[i]._id,
                fileName: body.hits.hits[i].fields.filename[0],
                directory: body.hits.hits[i].fields.directory[0]
            })
        }
        res.json(results);
    }, function (error) {
        console.trace("Error");
    });

});

module.exports = router;

