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
    // events 정렬
    var json = JSON.parse(this.responseText);
    events = json.events;
    events.sort(
      function(a,b) {
          return b.no - a.no;
      }
    );

    // 최초 상태 만들기
    var talks = document.getElementById('talks')
    var panel_group = make_elemente("div", ["panel-group"])
    talks.appendChild(panel_group)   

    delete talks
    delete panel_group

    // 렌더링
    var panel_group = document.getElementsByClassName("panel-group")[0]
  
    for (var i in events){
      if (events[i].display == "on"){

        var panel = make_elemente("div", ["panel", "panel-default"])
        var panel_head = make_elemente("div", ["panel-heading"])
        var head = make_elemente("h4", ["panel-title"])

        
        // head 정의
        for(var n in [...Array(2).keys()]){
          var num = Number(n) + 1
          var img_id = "{}_{}".format(events[i].no, num)
          var image = make_elemente("img", ["talk_img", "lazy"], img_id)
          image.src = "./image/poster/{}.jpg".format(img_id)
          head.appendChild(image)
        };
        panel_head.appendChild(head)

        // body 정의
        var panel_body = make_elemente("div", ["panel-body"])
        
        // notice 추가
        if (events[i].hasOwnProperty("notice")){
          var notice = make_elemente("strong")
          notice.stlye = "color:red"
          notice.innerText = events[i].notice

          var h4 = make_elemente("h4")
          h4.appendChild(notice)
          var div = make_elemente("div", ["col-md-12"])
          div.appendChild(h4)

          panel_body.appendChild(div)
        };

        // talk 추가
        var left = make_elemente("div", ["col-md-6"])
        var right = make_elemente("div", ["col-md-6"])
        
        var len = events[i].talks.length;
        len = Math.round(len/2);

        for (var j in events[i].talks){
          var talk = make_elemente("h4")
          talk.innerHTML = "<{}: {}><br> 『{}』".format(events[i].talks[j].speaker, events[i].talks[j].occupation, events[i].talks[j].talk_title)

          if (events[i].talks[j].hasOwnProperty("youtube")){
            var youtube = make_elemente("a")
            youtube.href = events[i].talks[j].youtube
            youtube.target = "_blank"
            youtube.innerText = " - 강연 보러가기"
            talk.appendChild(youtube)
          }
          talk.appendChild(make_elemente("br"))

          if (j < len){
            left.appendChild(talk)
          } else{
            right.appendChild(talk)
          }
        };
        panel_body.appendChild(left)
        panel_body.appendChild(right)

        panel.appendChild(panel_head)
        panel.appendChild(panel_body)
        panel_group.appendChild(panel)
      };
    };
  };
};
talksxhr.send()

function make_elemente(tag_name=null, classList=null, id=null) {
  var new_tag = document.createElement(tag_name)
  if(classList != null){
    for(var i in classList){
      new_tag.classList.add(classList[i])
    }
  }

  if(id != null){
    new_tag.id = id
  }
  return new_tag
};