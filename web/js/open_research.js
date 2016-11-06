$(function () {
  PDFJS.disableWorker = true;

  //
  // The workerSrc property shall be specified.
  //
  PDFJS.workerSrc = './js/pdf.worker.js';

  var pageNum = getParameterByName('page') ? Number(getParameterByName('page')) : 1;
  var url = getParameterByName('pdf') ? decodeURI(getParameterByName('pdf')) : './example_media.pdf';

  function renderPDF(url, pageNum) {
    //
    // Prepare canvas using PDF page dimensions
    //
    $('#the-canvas').remove();
    var newCanvas = $('<canvas id="the-canvas"></canvas>');
    $(newCanvas).appendTo($('#pdfOuter'));

    //
    // Asynchronous download PDF
    //
    PDFJS.getDocument(url).then(function getPdf(pdf) {
      //
      // Fetch the first page
      //
      pdf.getPage(pageNum).then(function getPage(page) {
        var scale = 1;
        var viewport = page.getViewport(scale);

        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height; // window.innerHeight; //viewport.height;
        canvas.width = viewport.width;

        for(var i = 0; i < pdf.numPages; i++) {
          var pageNumMenuItem = $('<li id="' + i + '" href="#">Page ' + Number(i+1) + '</li>');
          pageNumMenuItem.bind("click", function() {
            console.log('url, pageNum', url, this.id);
            window.location.assign(window.location.pathname
              + "?pdf=" + url + "&page=" + this.id);
          });
          $(pageNumMenuItem).appendTo($('.dropdown-menu'));
        }
        //
        // Render PDF page into canvas context
        //
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        page.render(renderContext);
      });
    });
  }

  // Post a comment
  function postComment(){
    alert('what should i send you?');
    document.getElementById('postForm').submit();
  }

  renderPDF(url, 1);
  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  renderPDF(url, pageNum);
});
