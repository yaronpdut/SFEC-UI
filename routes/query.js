/**
 * Created by yaronpd on 14/07/2015.
 */
var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('cfg.json', 'utf8'));



router.get('/', function (req, res, next) {

        // host: '1.9.65.77:9200',
    var client = new elasticsearch.Client({
        host: cfg.serverAddress + ':' + cfg.serverPort
    });

    var results = [];

    // @TBD Add validation check for all variables.

    client.search({
        q: "source:*" + req.query.q + "*",
        from: 0,
        size: 100,
        fields: ["directory", "filename"],
        lowercaseExpandedTerms : true,
		minScore: 0.5

    }).then(function (body) {
        var hits = body.hits.hits;
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
        console.trace(error.message);
    });

});

module.exports = router;

