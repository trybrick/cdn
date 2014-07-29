//document.write('<div id="tester" style="display:none;">an advertisement</div>');
var body = document.getElementsByTagName('body').item(0);
var tag = document.createElement('div');
tag.setAttribute('style', 'display:none;');
tag.setAttribute('id', 'tester');
body.appendChild(tag);

