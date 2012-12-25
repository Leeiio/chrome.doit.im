(function (window) {
    var Doitim = {
        postMessage:function () {
            var BaseURL = "https://mail.qq.com";
            var $iframe = $('#mainFrame').contents();
            var subject = $iframe.find('#subject').text();
            var content = $iframe.find('#contentDiv0').text();
            if(content.length > 250){
                content = content.substr(0,250) + '...';
            }
            var link = $iframe.find('.qm_ico_reopen').parent().prev().find('a').attr('href');
            link = BaseURL + link.match(/\/cgi[^\s']+/g);
            content = link + '\n\n' + content;
            var sender = $iframe.find('.settingtable .grn').text();
            var title = '[' + sender + '] ' + subject;
            title = title.length > 255 ? title.substr(0, 255) : title;
            var data = {
                type:'qmail',
                title:title,
                content:content
            };
            console.log(data)
            window.postMessage({ type: "FROM_PAGE", text: "Hello from the QQ mail webpage!", object: data }, "*");
        }
    };
    window.Doitim = Doitim;
})(window);