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
  var url = './example_media.pdf';

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


  function renderPDF(url, pageNum) {
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
        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = window.innerHeight; //viewport.height;
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
  }

  function getUser(){
    $.ajax({
            url: "/api/v1/user",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(resultData) {
                //here is your json.
                  // process it

            },
            error : function(jqXHR, textStatus, errorThrown) {
            },

            timeout: 120000,
        });
  }

  function getComment(id){
    console.log('Get comment with id'+id);
    $.ajax({
            url: '/api/v1/comment/' + id,
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(resultData){
                //here is your json.
                  // process it
                  alert(JSON.stringify(resultData));
            },
            error : function(jqXHR, textStatus, errorThrown) {
              alert('error');
            },
            timeout: 120000,
        });
  };

  function getComments()
  {
    console.log('getComments...')
    $.ajax({
            url: "/api/v1/comment",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(resultData){
                //here is your json.
                  // process it
                  alert(JSON.stringify(resultData));
            },
            error : function(jqXHR, textStatus, errorThrown) {
              alert('error');
            },
            timeout: 120000,
        });
  }

  // Post a comment
  function postComment(){
    var comment = document.postForm.getElementById('comment-body').value;
    var postData = {
      author: "",
      paper: "",
      content: comment,
      voteplus: null,
      voteminus: null
    };

    $.ajax({
        url: '/api/v1/comment',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(postData),
        success: function(response){
          alert(JSON.stringify(response));
        },
        error: function(){
            alert('error');
        }
    });
  }

  /* Form methods */
  $('#postCommentInput').bind("click", postComment);
  $('#getCommentsInput').bind("click", getComments);

  renderPDF(url, 1);
});
