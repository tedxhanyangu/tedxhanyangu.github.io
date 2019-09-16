String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
  };

var talksxhr = new XMLHttpRequest();
talksxhr.overrideMimeType("application/json");
talksxhr.open('GET', "/static/json/talks.json", true);
talksxhr.onreadystatechange = function () {
    if (talksxhr.readyState == 4 && talksxhr.status == "200") {

      var panel_array = new Array();
      var base_panel = "<div class=\"panel panel-default\">{}{}</div>";
      var base_panel_head = "<div class=\"panel-heading\"><h4 class=\"panel-title\"><img class=\"talk_img\" id=\"main{}_1\" src=\"./image/poster/{}_1.jpg\"><img class=\"talk_img\" id=\"main{}_2\" src=\"./image/poster/{}_2.jpg\"></h4></div>";
      var base_panel_body = "<div class=\"panel-body\">{}<div class=\"col-md-6\">{}</div><div class=\"col-md-6\">{}</div></div>";
      var base_talk = "<h4><{}: {}><br>『{}』 {}<br></h4>";
      var base_youtube = "<a href=\"{}\" target=\"_blank\"> - 강연 보러가기</a>";
      var base_notice = "<div class=\"col-md-12\"><h4><strong style=\"color:red\">{}</strong></h4></div>"
      
      var json = JSON.parse(this.responseText);
      var events = json.events;
      
      events.sort(
          function(a,b) {
              return b.no - a.no;
          }
      );
      
      for (var i in events){
        if (events[i].display == "on"){
          var len = Math.round(events[i].talks.length/2);
          var left_array = new Array();
          var right_array = new Array();
    
          var panel_head = base_panel_head.format(events[i].no, events[i].no, events[i].no, events[i].no);
          for(var j in events[i].talks){
            if (events[i].talks[j].hasOwnProperty("youtube")){
              var youtube = base_youtube.format(events[i].talks[j].youtube);
            } else{
              var youtube = "";
            };
            
            var talk = base_talk.format(events[i].talks[j].speaker, events[i].talks[j].occupation, events[i].talks[j].talk_title, youtube)
    
            if (j < len){
              left_array.push(talk);
            } else{
              right_array.push(talk);
            };
          };
          if (events[i].hasOwnProperty("notice")){
            var notice = base_notice.format(events[i].notice)
          } else{
            var notice = ""
          }
          var panel_body = base_panel_body.format(notice, left_array.join(""), right_array.join(""));
          var panel = base_panel.format(panel_head, panel_body);
          panel_array.push(panel);
        }

        var panel_group ="<div class=\"panel-group\">{}</div>".format(panel_array.join(""));
        document.getElementById("talks").innerHTML = panel_group;
      };
    };    
};
talksxhr.send()