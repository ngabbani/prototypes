$(document).ready(function(){
  $('.tt').tooltipster({
    theme: 'tooltipster-light'
  });

  $('#filter-button').click(function(e){
    e.preventDefault();
    $('#jobs-list-push, #jobs-list-content').toggleClass('active')
  });

  $('.filter .filter-title').click(function(){
    $(this).find('.filter-button').toggleClass('fa-plus fa-minus');
    $(this).parent().find('.filter-content').slideToggle();
  });
});
