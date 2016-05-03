$(document).ready(function(){

  // $('.collapse').click(function(){
  //   $(this).find('i.fa').toggleClass('collapse-active');
  //   $(this).next('.collapse-content').slideToggle();
  // });

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