$(function() {
    $("#btnGen").click(function() {
        $("#result").empty();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "RTS" }, function (response) {
                console.log(response);
            });
        });
    });
});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        for (var i in request.data) {
            let url = "https://pan.baidu.com/api/filemetas?target=" + encodeURI(request.data[i].path) +
                "&dlink=1&channel=chunlei&web=1&app_id=250528&bdstoken=2f935ef7d1ed3cf8d11b9a6" + 
                "c0f1ca4f7&logid=MTU2Nzk0NTk3Njc5ODAuMzI5ODk5NDE1MDM0OTk3Mg==&clienttype=0";
            let type = 'UNK'; let disable = "";
            let index = request.data[i].name.lastIndexOf(".");
            if (index != -1) {
                type = request.data[i].name.substring(index + 1, request.data[i].length);
                type = type.toUpperCase();
                request.data[i].name = request.data[i].name.substring(0, index);
            } else {
                disable = "disabled";
            }
            let item = '<div class="list-group-item">' + 
            '<p class="list-group-item-heading">' + request.data[i].name + '</p>' +
            '<div class="d-flex flex-row">' +
                '<button class="p-2 btn btn-primary" disabled>' + type + '</button>' +
                '<button class="p-2 btn btn-light copy_path"' + disable + '><span class="mdi mdi-link"></span> 复制路径</button>' + 
                '<button class="p-2 btn btn-light copy_link"' + disable + '><span class="mdi mdi-iframe-outline"></span> 复制链接</button>' + 
                '<input class="p-2 clipboard_path" style="display: none" value=\'' + request.data[i].path.substring(2, request.data[i].path.length - 2) + '\'></input>' +
                '<input class="p-2 clipboard_link" style="display: none" value="' + url + '"></input>' +
            '</div></div>';
            $("#result").append(item);
        }
        $('.copy_link').click(function () {
            $(this).parent().find("button.btn-light").hide();
            $(this).parent().find("input.clipboard_link").show();
            $(this).parent().find("input.clipboard_link").select();
            $(this).parent().find("input.clipboard_link").on('blur', function() {
                $(this).hide();
                $(this).parent().find("button.btn-light").show();
            });
        });
        $('.copy_path').click(function () {
            $(this).parent().find("button.btn-light").hide();
            $(this).parent().find("input.clipboard_path").show();
            $(this).parent().find("input.clipboard_path").select();
            $(this).parent().find("input.clipboard_path").on('blur', function() {
                $(this).hide();
                $(this).parent().find("button.btn-light").show();
            });
        });
        sendResponse("CTS");
    }
);