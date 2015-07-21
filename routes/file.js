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

    client.get({
            index: "nim",
            type: "source",
            id: req.query.id
        },
        function (error, response) {
            res.json(response._source.source);
        })


});

module.exports = router;

