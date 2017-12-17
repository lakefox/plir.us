window.onload = () => {
  window.scrollTo(0,0);
  load(() => {
    if (window.location.hash.length > 1) {
      for (var i = 0; i < window.posts.length; i++) {
        if (window.posts[i].id == window.location.hash.slice(1)) {
          show(i);
        }
      }
    }
    draw("all");
  });
}
function load(cb) {
  if (!window.posts) {
    var res = [];
    fetch("https://api.pushshift.io/reddit/search/submission/?subreddit=forhire&filter=link_flair_text,created_utc,title,author,id,selftext&sort=desc&size=500").then((raw) => {
      return raw.json();
    }).then((data) => {
      var posts = data.data;
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        if (post.author != "[deleted]" && post.selftext != "[removed]" && post.link_flair_text) {
          post.title = post.title.split(" ").slice(1).join(" ");
          if (post.link_flair_text == "For Hire") {
            post.title = post.title.slice(5);
          }
          post.created_utc = time(post.created_utc);
          res.push(post);
        }
      }
      window.posts = res;
      cb();
    });
  }
}
function time(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = month+' ' + date + ',' + year;
  return time;
}
function b(e) {
  document.querySelector("html").style.overflowY = "inherit";
  var type = e.innerHTML;
  draw(type);
}
function draw(type) {
  var html = "";
  document.querySelector(".posts").innerHTML = "";
  var posts = window.posts;
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].link_flair_text == type || type == "all") {
      html += "<div class='post' onclick='show("+i.toString()+")'>"+posts[i].title+" -&nbsp;"+posts[i].created_utc.replace(/ /g, "&nbsp;")+"</div>";
      if (i%10 == 9) {
        html += "<iframe class='post' data-aa='770844' src='//acceptable.a-ads.com/770844' scrolling='no' style='border:0px; padding:0;overflow:hidden' allowtransparency='true'></iframe>";
      }
    }
  }
  document.querySelector(".posts").innerHTML = html;
}
function show(index) {
  window.index = index;
  var post = window.posts[index];
  var converter = new showdown.Converter();
  var html = converter.makeHtml(post.selftext);
  document.querySelector("title").innerHTML = post.title;
  document.querySelector(".viewTitle").innerHTML = post.title;
  document.querySelector(".viewBody").innerHTML = html;
  window.location.hash = post.id;
  document.querySelector(".view").style.display = "inherit";
  window.y = window.scrollY;
  window.scrollTo(0,0);
  document.querySelector(".posts").style.display = "none";
}
function hide() {
  document.querySelector("title").innerHTML = "PLIRUS";
  document.querySelector(".view").style.display = "none";
  document.querySelector(".posts").style.display = "inherit";
  window.location.hash = "";
  window.scrollTo(0,window.y);
}
function message() {
  var post = window.posts[window.index];
  var a = document.createElement("a");
  a.target = "_blank";
  a.href = "https://www.reddit.com/message/compose/?to="+post.author+"&subject="+post.title;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
