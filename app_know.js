$(document).ready(function(){
	$('#apply').click(function(e){
		e.preventDefault();
		$('#slide').addClass('show');
	});

	$('#step1-btn').click(function(){
		$('#step-1').fadeOut(function(){
			$('#step-3').fadeIn();
			$('#progress').css('width', '100%');
			$('#pb-3 .progress-bubble, #pb-2 .progress-bubble').addClass('bg-primary');
		})
	});	

	$('#step1-btn-bis').click(function(){
		$('#ldm').fadeOut(function(){
			$('#step-3').fadeIn();
			$('#progress').css('width', '100%');
			$('#pb-3 .progress-bubble').addClass('bg-primary');
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

	$('#return-ldm').click(function(){
		$('#ldm').fadeOut(function(){
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

	$('#btn-ldm').click(function(){
		$('#step-1').fadeOut(function(){
			$('#ldm').fadeIn();
			$('#progress').css('width', '50%');
			$('#pb-2').fadeIn().find('.progress-bubble').addClass('bg-primary');
			$('#pb-3 .progress-bubble').text('3');
		});
		
	})

	$('.list-group').each(function(){
		var $that = $(this);
		$(this).find('a').click(function(){
			$that.find('a').removeClass('active');
			$(this).addClass('active');
		});
	});

	$('#continue').click(function(){
		$('.progress').fadeOut();
		$('#step-3').fadeOut(function(){
			$('#preview').fadeIn();
		})
	});

	$('#close').click(function(e){
		e.preventDefault();
		$('#slide').removeClass('show');
	});

	$('#lettre a').click(function(){
		$('#lettre-text').text("(Madame, Monsieur), \nEtant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi). \nEn effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). \n(Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m'a permis d'acquérir de nombreuses compétences parmi celles que vous recherchez. \nJe possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel. \n(Si le candidat possède une expérience significative dans le poste à pourvoir) Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.")
	});
});