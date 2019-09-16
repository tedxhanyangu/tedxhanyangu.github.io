String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

var sponsorxhr = new XMLHttpRequest();
sponsorxhr.overrideMimeType("application/json");
sponsorxhr.open('GET', "/static/json/sponsor.json", true);
sponsorxhr.onreadystatechange = function () {
    if (sponsorxhr.readyState == 4 && sponsorxhr.status == "200") {
        var sponsor_json = JSON.parse(this.responseText);
        
        var sxhr = new XMLHttpRequest();
        sxhr.overrideMimeType("application/json");
        sxhr.open('GET', "/static/json/s_list.json", true);
        sxhr.onreadystatechange = function () {
            if (sxhr.readyState == 4 && sxhr.status == "200") {
                var s_json = JSON.parse(this.responseText);
                var sjson = s_json.sjson
                // 회차 순으로 재정렬
                sjson.sort(
                    function(a,b) {
                        return b.no - a.no;
                    }
                );

                var row = "<div class=\"row\">{}{}</div>"
                var episode = "<div class=\"row sponsor-episode\"><h2><strong>{}</strong>회차 스폰서 목록</h2></div>"
                var company_div = "<div class=\"col-md-offset-0 col-md-3 col-sm-offset-3 col-sm-6 col-xs-offset-1 col-xs-10\">\
                <div class=\"sponsor\">\
                <figure><div><img src=\"/image/sponsor/{}\" class=\"img-responsive\"></div></figure><div class=\"sponsor-members\"><h4>{}</h4></div>\
                </div>\
                </div>"

                var episode_array = new Array()
                for (var i in sjson){
                    var company_array = new Array()
                    for (var j in sjson[i].sponsors){
                        var company = sponsor_json[String(sjson[i].sponsors[j])]
                        company_array.push(company_div.format(company.image, company.name))
                    }
                    episode_array.push(row.format(episode.format(sjson[i].no), company_array.join("")))
                }
                document.getElementById("sponser_list").innerHTML = episode_array.join("")
            };
        };
        sxhr.send();
    };
};
sponsorxhr.send();

