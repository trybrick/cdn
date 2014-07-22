// overriding respond.ajax
// load after respond loaded
(function (win, doc, $, undefined) {
  var baseElem = doc.getElementsByTagName("base")[0];

  function fakejax(url, callback) {
    $.ajax({ url: url }).then(function (response) {
      callback(response);
    });
  }

  function buildUrls() {
    var links = doc.getElementsByTagName("link");

    for (var i = 0, linkl = links.length; i < linkl; i++) {

      var thislink = links[i],
				href = links[i].href,
				extreg = (/^([a-zA-Z:]*\/\/(www\.)?)/).test(href),
				ext = (baseElem && !extreg) || extreg;

      //make sure it's an external stylesheet
      if (thislink.rel.indexOf("stylesheet") >= 0 && ext) {
        (function (link) {
          fakejax(href, function (css) {
            link.styleSheet.rawCssText = css;
            respond.update();
          });
        })(thislink);
      }
    }
  }

  if (!respond.mediaQueriesSupported) {
    buildUrls();
  }

})(window, document, window.jQuery || window.Zepto || window.tire);