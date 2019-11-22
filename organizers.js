String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

var no = 17

function make_memberfig (position, members){
    var base_memberdiv = "<div class=\"{}\"><div class=\"team-member\"><figure><img src=\"image/organizers/{}/{}.jpg\" class=\"img-responsive gocoder\">\
    <figcaption><p>{}</p></figcaption></figure><div class=\"separator\"></div>{}{}{}</div></div>"

    var member = new Array();

    for (var j in members){
        if (position == "None"){
            var class_type = "col-md-offset-0 col-md-4 col-sm-offset-3 col-sm-6 col-xs-offset-1 col-xs-10"
            var pos = ""
        } else{
            var class_type = "col-md-offset-0 col-md-3 col-sm-offset-3 col-sm-6 col-xs-offset-1 col-xs-10"
            if (members[j].hasOwnProperty("leader")){
                var pos = "<p>Team leader</p>"
            } else{
                var pos = "<p>{}</p>".format(position)
            }
        }
        
        if (members[j].hasOwnProperty("name_null")){
            var name = ""
        } else{
            var name = "<h4>{}</h4>".format(members[j].name)
        }

        if (members[j].hasOwnProperty("figcaption")){
            var fig = members[j].figcaption
        } else{
            var fig = "-"
        }

        if (members[j].hasOwnProperty("sns")){
            var base_sns = "<ul class=\"social-icons icon-circle list-unstyled list-inline icon-rotate\">{}</ul>"
            var base_sns_li = "<li><a href=\"{}\" target=\"_blank\"><i class=\"fa fa-{}\"></i></a></li>"
            var sns_array = new Array();
            
            for (var k in members[j].sns){
                sns_array.push(base_sns_li.format(members[j].sns[k].link, members[j].sns[k].channel))
                var sns_ul = base_sns.format(sns_array.join(""))
            }
        } else{
            var sns_ul = ""
        }
        member.push(base_memberdiv.format(class_type, no, members[j].name, fig, name, pos, sns_ul))
    }

    return member
}


var organizersxhr = new XMLHttpRequest();
organizersxhr.overrideMimeType("application/json");
organizersxhr.open('GET', "/static/json/{}.json".format(no), true);
organizersxhr.onreadystatechange = function () {
    if (organizersxhr.readyState == 4 && organizersxhr.status == "200") {
        var json = JSON.parse(this.responseText);
        var organizers = json.organizers
        organizers.sort(
            function(a,b) {
                return a.no - b.no;
            }
        );

        var org_array = new Array();
        var base_row = "<div class=\"row text-center\"><div class=\"col-md-12 team-name\">{}<hr></div>\
        <div class=\"container\">{}</div></div>"

        for (var i in organizers){
            var div_num = 4
            var members = make_memberfig(organizers[i].position, organizers[i].members)

            if (organizers[i].position == "None"){
                div_num = 3
            }
            if (members.length > div_num){
                var row = "<div class=\"row\">{}</div>".format(members.slice(0, div_num).join("")) + "<div class=\"row\">{}</div>".format(members.slice(div_num).join(""))

            } else{
                var row = "<div class=\"row\">{}</div>".format(members.join(""))
            }
            org_array.push(base_row.format(organizers[i].team_div, row))
        };
        document.getElementById("organizers").innerHTML = "<div id=\"team\" class=\"team\"><div class=\"container\">{}</div></div>".format(org_array.join(""))
    };    
};
organizersxhr.send()