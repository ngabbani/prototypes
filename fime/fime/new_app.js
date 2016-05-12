$(document).ready(function(){
  $('.progress.percent').each(function(){
    var percent = $(this).data('percent');
    var bar = $(this).find('.progress-meter');
    bar.css('width', percent + "%");
  });

  $('.progress-calcul').each(function(){
    var bar = $(this).find('.progress');
    var total = 0;
   
    bar.each(function(){
      var number = $(this).data('calcul');
      total = total + number;
    });

    bar.each(function(){
      var number = $(this).data('calcul');
      var percent = number * 100 / total;
      $(this).find('.progress-meter').css('width', percent + "%");
    });
  });

  $('#see-more, .top-bloc p').click(function(){
    $('.top-bloc p').toggleClass('see-you');
    var h = $('.top-bloc p').height();
    console.log($('.top-bloc p').hasClass('see-you'));
    if( $('.top-bloc p').hasClass('see-you') ){
      $('.left-top-align').css('margin-top', "-" + (h + 89) + "px");
    } else {
      $('.left-top-align').css('margin-top', "-200px");
    }
  });
});