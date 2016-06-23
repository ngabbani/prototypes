$(document).ready(function(){
  $('.progress.percent').each(function(){
    var percent = $(this).data('percent');
    var bar = $(this).find('.progress-meter');
    bar.css('width', percent + "%");
  });

  $('.progress-calcul').each(function(){
    var bar = $(this).find('.progress');
    var big = 0;
   
    bar.each(function(){
      var number = $(this).data('calcul');
      if(number >= big) {
        big = number;
      }
    });

    bar.each(function(){
      var number = $(this).data('calcul');
      var percent = number * 100 / big;
      $(this).find('.progress-meter').css('width', percent + "%");
    });
  });

  $('.see-more, .top-bloc p').click(function(){
    $('.top-bloc p').toggleClass('see-you');
    var h = $('.top-bloc p').height();
    console.log($('.top-bloc p').hasClass('see-you'));
    if( $('.top-bloc p').hasClass('see-you') ){
      $('.left-top-align').css('margin-top', "-" + (h + 97) + "px");
    } else {
      $('.left-top-align').css('margin-top', "-194px");
    }
  });
});
