window.onload = () => {
  window.scrollTo(0,0);
}
function load(query,type) {
  var res = [];
  fetch("https://api.pushshift.io/reddit/search/submission/?subreddit=forhire&filter=link_flair_text,created_utc,title,author,selftext&sort=desc&size=500&q="+encodeURIComponent(query)).then((raw) => {
    return raw.json();
  }).then((data) => {
    var posts = data.data;
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      if (post.author != "[deleted]" && post.selftext != "[removed]" && post.link_flair_text) {
        post.title = post.title.split(" ").slice(1).join(" ");
        post.created_utc = time(post.created_utc);
        if (post.link_flair_text == type) {
          res.push(post);
        }
      }
    }
    draw(res);
  });
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
  document.querySelector(".tags").innerHTML = "";
  var s = document.querySelector("#search").value.split(" ").filter(tag => tag != "");
  var type = e.innerHTML;
  var query = s.join("+");
  document.querySelector("html").style.overflowY = "inherit";
  for (var i = 0; i < s.length; i++) {
    document.querySelector(".tags").innerHTML += '<div class="tag">'+s[i]+'</div>';
  }
  load(query, type);
}
function draw(posts) {
  document.querySelector(".posts").innerHTML = "";
  for (var i = 0; i < posts.length; i++) {
    document.querySelector(".posts").innerHTML += "<div class='post' onclick='show("+i.toString()+")'>"+posts[i].title+" -&nbsp;"+posts[i].created_utc.replace(/ /g, "&nbsp;")+"</div>";
    if (i%10 == 9) {
      document.querySelector(".posts").innerHTML += "<iframe class='post' data-aa='770844' src='//acceptable.a-ads.com/770844' scrolling='no' style='border:0px; padding:0;overflow:hidden' allowtransparency='true'></iframe>";
    }
  }
  window.posts = posts;
}
function show(index) {
  window.index = index;
  var post = window.posts[index];
  var converter = new showdown.Converter();
  var html = converter.makeHtml(post.selftext);
  document.querySelector(".viewTitle").innerHTML = post.title;
  document.querySelector(".viewBody").innerHTML = html;
  document.querySelector(".view").style.display = "inherit";
  window.y = window.scrollY;
  window.scrollTo(0,0);
  document.querySelector(".page").style.display = "none";
}
function hide() {
  document.querySelector(".view").style.display = "none";
  document.querySelector(".page").style.display = "inherit";
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
