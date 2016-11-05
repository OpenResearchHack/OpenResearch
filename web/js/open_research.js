$(function () {
  console.log('START');
  /*
  PDFJS.getDocument('../example_media.pdf').then(function (pdfDocument) {
    console.log('Number of pages: ' + pdfDocument.numPages);
  });
  */
  //
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  //
  var url = '../example_media.pdf';

  //
  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  //
  // PDFJS.disableWorker = true;

  //
  // The workerSrc property shall be specified.
  //
  PDFJS.workerSrc = './js/pdf.worker.js';

  //
  // Asynchronous download PDF
  //
  PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
    //
    // Fetch the first page
    //
    pdf.getPage(10).then(function getPageHelloWorld(page) {
      var scale = 1;
      var viewport = page.getViewport(scale);
      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = window.innerHeight;
      canvas.width = viewport.width;
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
});