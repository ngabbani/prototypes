$(document).ready(function(){
  $('.tt').tooltipster({
    theme: 'tooltipster-light'
  });

  $('#filter-button').click(function(e){
    e.preventDefault();
    height = $('#jobs-list-filter').height() + 30
    $('#jobs-list-push').toggleClass('active')
    if(!$('#jobs-list-push').hasClass('active')){
      $('#jobs-list-filter').css('margin-top', height * -1 + 'px');
    } else {
      $('#jobs-list-filter').css('margin-top', 0 + 'px');
    }
  });

  $('.filter .filter-title').click(function(){
    $(this).find('.filter-button').toggleClass('fa-plus fa-minus');
    $(this).parent().find('.filter-content').slideToggle();
  });
});
