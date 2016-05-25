$(document).ready(function(){
  $('.tt').tooltipster({
    theme: 'tooltipster-light'
  });

  $('#filter-button').click(function(e){
    e.preventDefault();
    $('#jobs-list-push, #jobs-list-content').toggleClass('active')
  });


  $button = $('.filter').find('filter-title');
  $icon = $button.find('.filter-button');
  $content = $('.filter').find('.filter-content');

  $('.filter .filter-title').click(function(){
    $(this).find('.filter-button').toggleClass('fa-plus fa-minus');
    $(this).parent().find('.filter-content').slideToggle();
  });
});
