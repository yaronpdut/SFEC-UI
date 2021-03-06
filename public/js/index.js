
var filenamesList = undefined;

$(document).ready(function () {
    var options = { item: 'filename-item'};
    filenamesList = new List('left_content', options);
});

function triggerUpdate()
{
    var queryStr = $("#searchString").val();
    if (queryStr === null || queryStr.length < 3) {
        $('#source_code').html("");
        filenamesList.clear();
    }
    else {
        PostQueryRequestToServer(queryStr, $("#querytype").val())
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  //

$("#searchString").on('input', function () {
    triggerUpdate()
});

$("#querytype").on('change', function () {
    triggerUpdate()
});

function ProcessFiles(jsonRes)
{
    var extentions = {};

    jsonRes.forEach(function(currentValue, index, array)
    {
        var ext = currentValue.fileName.split('.').pop();
        if(extentions[ext] == undefined)
            extentions[ext] = 1;
        else
            extentions[ext] += 1;
    })

    var htmlBuf = "<b>File Type Distribution:</b>";

    var extensdionsList = Object.keys(extentions);

    for(var i = 0; i < extensdionsList.length; i++) {
        htmlBuf += extensdionsList[i] + "=>" + extentions[extensdionsList[i]]
        if(i < extensdionsList.length-1)
            htmlBuf += "|"
    }
    $("#results_stat").html(htmlBuf);
}

function PostQueryRequestToServer(searchStr, querytype) {

    $.ajax({
        url: encodeURI('query/?q=' + searchStr + '&t='+ querytype),
        type: 'GET',
        success: function (response) {
            var values = [];

            $.each(response, function (i, item) {
                values.push({filename: item.fileName, id: item.id, directory: item.directory});
            });
            ProcessFiles(response);

            filenamesList.clear();
            filenamesList.add(values);

            $(".filename").click(function (event) {
                var v = filenamesList.get("filename", event.target.innerText);
                console.log(v[0].values().id);
                retrieveFileFromServer(v[0].values().id, v[0].values().filename, v[0].values().directory);
            });
        }
    });
}

function fillFileDetails(response, fn, dir) {
    $('#source_code').html("<pre><code>" + (response) + "</pre></code>");
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
    var fullPath = dir + "\\" + fn

    $('#fileNameHeader').html('<h4><a href="' + fullPath + '">'+fullPath+'</a></h4>')
}

function retrieveFileFromServer(id, fn, dir) {
    $.ajax({
        url: 'file/?id=' + id,
        type: 'GET',
        success: function (response) {
            fillFileDetails(response, fn, dir)
        }
    });
}

