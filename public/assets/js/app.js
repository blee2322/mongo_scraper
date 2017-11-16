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
})