
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

function PostQueryRequestToServer(searchStr, querytype) {

    $.ajax({
        url: 'query/?q=' + searchStr + '&t='+ querytype,
        type: 'GET',
        success: function (response) {
            var values = [];

            $.each(response, function (i, item) {
                values.push({filename: item.fileName, id: item.id, directory: item.directory});
            });

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

function fillFileDetails(response) {
    $('#source_code').html("<pre><code>" + (response) + "</pre></code>");
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
    $('#fileNameHeader').html("<h4>" + dir + "\\" + fn + "</h4>")
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

