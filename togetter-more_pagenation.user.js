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
    appendPage(xhr.responseXML, insertPoint);
    location.href = 'javascript:void $.lazy()';
  });
  xhr.send(null);
}, true);

function appendPage(nextPage, insertPoint){
  var newTweetBox = nextPage.querySelector('.tweet_box');
  var tweetBox = document.querySelector('.tweet_box');
  var c;
  while(c = newTweetBox.firstElementChild){
    tweetBox.insertBefore(c, insertPoint.nextSibling);
    insertPoint = c;
  }
}
