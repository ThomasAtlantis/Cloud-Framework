let res = [];
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        window.addEventListener("message", function(e) {
            res.push(e.data);
        }, false);
        $(".zwcb105L").each(function() {
            _getItem($(this).attr("_position"));
        });
        var id = setTimeout(() => {
            chrome.extension.sendMessage({data: res}, 
            function(response) {console.log(response); });
        }, 100);
        sendResponse("CTS");
    }
);
function _getItem(index) {
    $('body').append(
        '<script> \
            (function (index) { \
                let item = require("system-core:context/context.js") \
                .instanceForSystem.getList() \
                .getElementDataByPosition(index); \
                window.postMessage({ \
                    "name": item.server_filename, \
                    "path": ' + "'[\"' + item.path + '\"]'" + ', \
                    "size": item.size, \
                    "type": item.category \
                }, "*"); \
            })(' + index + ') \
        </script>');
}