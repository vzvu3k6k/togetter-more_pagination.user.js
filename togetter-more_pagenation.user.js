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

  var match = url.match(/(?:&|\?)page=(\d+)/), newPageNum;
  if(match){
    newPageNum = +match[1];
  }else{
    newPageNum = 1;
  }

  var separatorIdPrefix = 'togetter-more_pagenation_page_separator_';

  var separatorId = separatorIdPrefix + newPageNum;
  var sep = document.getElementById(separatorId);
  if(newPageNum == 1){
    location.hash = '#tweet_list_head';
    return;
  }else if(sep){
    location.hash = separatorId;
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'document';
  xhr.addEventListener('load', function(xhrEvent){
    var insertPoint = event.target.parentNode.nextElementSibling.nextElementSibling;

    var hr = document.createElement('hr');
    hr.setAttribute('class', 'togetter-more_pagenation_page_separator');
    hr.setAttribute('id', separatorId);
    var p = document.createElement('togetter-more_pagenation_page_info');
    p.textContent = 'page: ';
    var a = document.createElement('a');
    a.setAttribute('class', 'togetter-more_pagenation_page_info');
    a.setAttribute('href', url);
    a.textContent = newPageNum;
    p.appendChild(a);

    var newTweetBoxChildren = Array.prototype.slice.call(
      xhr.responseXML.querySelector('.tweet_box').children, 0);

    appendPage([hr, p].concat(newTweetBoxChildren), insertPoint);
    location.href = 'javascript:void $.lazy()';
  });
  xhr.send(null);
});

function appendPage(newNodes, insertPoint){
  var parent = insertPoint.parentNode;
  var c;
  while(c = newNodes.shift()){
    parent.insertBefore(c, insertPoint.nextSibling);
    insertPoint = c;
  }
}
