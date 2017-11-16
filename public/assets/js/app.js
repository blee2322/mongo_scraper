$(document).ready(function() {
  //Scrape
  $('#scrape').on('click', function() {
    $.ajax({
      method: 'GET',
      url: '/scrape'
    }).done(function(data) {
      console.log(data)
      window.location = '/'
    })
  })

  //Save Article Button
  $('.save').on('click', function () {
      var thisId = $(this).attr('data-id');
      $.ajax({
        method: 'POST',
        url: 'articles/save/' + thisId
      }).done(function(data) {
        window.location = '/'
      })
  })
  //Delete Article Button
  $('.delete').on('click', function() {
    var thisId = $(this).attr('data-id');
      $.ajax({
        method: 'POST',
        url: '/articles/delete/' + thisId
      }).done(function(data) {
        console.log(data)
        window.location = 'saved'
      })
  })

  $('.saveNote').on('click', function() {
    var thisId = $(this).attr('data-id');
      $.ajax({
        method: 'POST',
        url: 'notes/save/' + thisId,
        data: {
          text: $('#noteText' + thisId).val()
        }
      }).done(function(data) {
        console.log(data);
        // $('#noteText' + thisId).val('');
        $('.modalNote').modal('hide');
        window.location ='/saved'
      })
  });

  $('.deleteNote').on('click', function(){
    var noteId = $(this).attr('data-note-id');
    var articleId = $(this).attr('data-article-id');
    $.ajax({
        method: 'DELETE',
        url: '/notes/delete/' + noteId + '/' + articleId
    }).done(function(data) {
      $('.modalNote').modal('hide');
      window.location = '/saved'
    })
  })
})