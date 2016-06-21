$(document).ready(function(){
  $('.tt').tooltipster();
  
  $('#jobs-list-filter').css('margin-top', ($('#jobs-list-filter').height() + 60) * -1 + 'px');

  $('#filter-button').click(function(e){
    e.preventDefault();
    height = $('#jobs-list-filter').height() + 60
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

  $('#rdb_tools_button').click(function(){
    $('#rdb_tools').slideToggle();
  });

  var $navbar = $(".sticky-nav, #resume_details"),
        y_pos = $navbar.offset().top,
        height = $navbar.height();

    $(document).scroll(function() {
      var scrollTop = $(this).scrollTop();

      if (scrollTop > y_pos) {
          $navbar.addClass("fixed");
      } else if (scrollTop <= y_pos) {
          $navbar.removeClass("fixed");
      }
  });
});
