$(document).ready(function(){
	$('#apply').click(function(e){
		e.preventDefault();
		$('#slide').addClass('show');
	});

	$('#step1-btn').click(function(){
		$('#step-1').fadeOut(function(){
			$('#step-2').fadeIn();
			$('#progress').css('width', '50%');
			$('#pb-2 .progress-bubble').addClass('bg-primary');
		})
	});

	$('#step2-btn').click(function(){
		$('#step-2').fadeOut(function(){
			$('#step-3').fadeIn();
			$('#progress').css('width', '100%');
			$('#pb-3 .progress-bubble').addClass('bg-primary');
		})
	});

	$('#return-2').click(function(){
		$('#step-2').fadeOut(function(){
			$('#step-1').fadeIn();
			$('#progress').css('width', '0%');
			$('#pb-2 .progress-bubble').removeClass('bg-primary');
		})
	});

	$('#return-3').click(function(){
		$('#step-3').fadeOut(function(){
			$('#step-2').fadeIn();
			$('#progress').css('width', '50%');
			$('#pb-3 .progress-bubble').removeClass('bg-primary');
		})
	});

	$('.list-group').each(function(){
		$(this).find('a').click(function(){
			$('.list-group a').removeClass('active');
			$(this).addClass('active');
		});
	});

	$('#continue').click(function(){
		$('.progress').fadeOut();
		$('#step-3').fadeOut(function(){
			$('#preview').fadeIn();
		})
	})
});