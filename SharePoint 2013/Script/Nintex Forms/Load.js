(function ($) {

    $._loadJS = $._loadJS || [];

    function getParameterByName(input, name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(input);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    var src = $('script:last').attr('src');
    if (src) {
        var path = getParameterByName(src, 'path');
        if (path == "") {
            return;
        }
        if (path.indexOf('/') != 0) {
            return;
        }
        if ($.inArray(path, $._loadJS) != -1) {
            return;
        }

        $._loadJS.push(path);
        var promise = $.ajax(path, {
            async: false,
            cache: false,
            dataType: 'script'
        });
        promise.fail(function () {
            if (console.log) {
                console.log('failed to request: ' + path);
            }
        });
        promise.done(function (content, status, xhr) {
            if (content) {
                var head = document.getElementsByTagName("head")[0];
                var js = document.createElement("script");
                js.type = "text/javascript";
                js.text = content;
                head.appendChild(js);
            }
        });
    }
})(NWF$);