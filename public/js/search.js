
function loadFile(id) {
    $.ajax({
        url: 'file/?id=' + id,
        type: 'GET',
        success: function (response) {
            trHTML = "<pre><code>"
            trHTML += (response);
            trHTML += "</pre></code>"
            $('#sourcefile').html(trHTML);
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });

        }
    });

}

function QueryRest(searchStr) {

    $.ajax({
        url: 'query/?q=' + searchStr,
        type: 'GET',
        success: function (response) {
            var trHTML = '<ul class="list">';
            var listValues = [];


            $.each(response, function (i, item) {
                trHTML +=
                    "<li>" +
                    "<a id=\"" + item.id + "\" class=\"source_click\" href=\"#\">" + item.fileName + "</a>"
                    + "</li>";
                    listValues.push({"fileName" : item.fileName})
            });

            trHTML += '</ul>';
            $('#results').html(trHTML);


            var options = {
                valueNames: [ 'filename' ],
                searchClass : 'search'
            };
            var resultsList = new List('results', options, listValues);
            console.log(resultsList);
/*
             $(".search").on('input', function () {
                    var queryStr = $("#filterString").val();
                    resultsList.search(queryStr);
             });
*/
            $(".source_click").click(function (event) {
                // alert(event.target.id);
                loadFile(event.target.id);
            });


        }
    });
}

function setFile(id) {
    $('#sourcefile').html("<p>" + id + "</p>");
}
function doSubmit() {
    $.ajax({
        url: 'query/' + $("input:first").val(),
        type: 'GET',
        success: function (response) {
            var r = JSON.parse(response);
            console.log(r.hits);
            var trHTML = '';
            $.each(r, function (i, item) {
                trHTML += "<li>" + item.fileName + "</li>";
                console.log(item.fileName, item.directory);
            });
            $('#results').html(trHTML);
        }
    });
}

hljs.initHighlightingOnLoad();

