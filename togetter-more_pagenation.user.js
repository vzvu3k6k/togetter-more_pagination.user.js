// ==UserScript==
// @name           Togetter: 継ぎ足しpagenation
// @description    ページャーをクリックしたらその下に内容を継ぎ足す
// @version        1.0
// @author         vzvu3k6k
// @match          http://togetter.com/li/*
// @namespace      http://vzvu3k6k.tk/
// @license        CC0
// ==/UserScript==

window.addEventListener('click', function(event){
  if(event.button != 0) return;

  var pagenationLinks = document.querySelectorAll('.tweet_box .pagenation a');
  if(Array.prototype.indexOf.call(pagenationLinks, event.target) == -1) return;

  var url = event.target.href;
  if(url.indexOf('http://togetter.com/li/') != 0) return; // prevent XSS by cross-origin XHR

  event.preventDefault();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'document';
  xhr.addEventListener('load', function(xhrEvent){
    var insertPoint = event.target.parentNode.nextElementSibling.nextElementSibling;

    var hr = document.createElement('hr');
    hr.setAttribute('class', 'togetter-more_pagenation_page_separator');
    var p = document.createElement('togetter-more_pagenation_page_info');
    p.textContent = 'page: ';
    var a = document.createElement('a');
    a.setAttribute('class', 'togetter-more_pagenation_page_info');
    a.setAttribute('href', url);
    var match;
    if(match = url.match(/(&|\?)page=(\d+)/)){
      a.textContent = match[1];
    }else{
      a.textContent = '1';
    }
    p.appendChild(a);

    var newTweetBoxChildren = Array.prototype.slice.call(
      xhr.responseXML.querySelector('.tweet_box').children, 0);

    appendPage([hr, p].concat(newTweetBoxChildren), insertPoint);
    location.href = 'javascript:void $.lazy()';
  });
  xhr.send(null);
}, true);

function appendPage(newNodes, insertPoint){
  var parent = insertPoint.parentNode;
  var c;
  while(c = newNodes.shift()){
    parent.insertBefore(c, insertPoint.nextSibling);
    insertPoint = c;
  }
}
