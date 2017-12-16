$(document).ready( function() {
	var images = [];

	// add some incons to select option
	// $('select option').each( function() {
	// 	code = $(this).val().toLowerCase();
	// 	$(this).prepend($('<span></span>').addClass("ss ss-" + code));
	// })

	// ajax requesting api mtg
	function updateImages() {
		land = $('.land_on').data('land');
		set_code = $('select').val().toLowerCase();
		$.ajax({
			url : `https://api.magicthegathering.io/v1/cards?name=${land}&set=${set_code}&supertypes=Basic`,
			type : 'GET',
			dataType : 'json',

			success : function(response, statut) {
				count_lands = response.cards.length;
				$('#carousel').data('max', count_lands-1);
				$('#carousel').data('current', 0);
				loadImage($('#carousel').data('current'), $('#carousel img'), 0);
			}
		});
	}

	// land choice
	$('.land').on('click', function() {
		$('.land').addClass('land_off').removeClass('land_on');
		$(this).removeClass('land_off').addClass('land_on');
		updateImages();
	});

	$('.land:first').click();

	$('select').on('change', function() {
		// change active set
		name = $('select option:selected').text();
		code = $(this).val().toLowerCase();
	 	icon = $('<i></i>').addClass("ss ss-" + code);
		$('#active-set-h2 span').text(name);
		$('#active-set-h2 span').prepend(icon);
		updateImages();
	});

	$('select option:first').trigger('change');

	function loadImage(current, target, time_delay=300) {
		land = $('.land_on').data('land');
		set_code = $('select').val().toLowerCase();
		$.ajax({
			url : `https://api.magicthegathering.io/v1/cards?name=${land}&set=${set_code}&supertypes=Basic`,
			type : 'GET',
			dataType : 'json',

			success : function(response, statut) {
				lands = response.cards;
				target.fadeOut(time_delay)
				  .delay(time_delay)
				  .queue(function(next) {
				  			target.attr('src', lands[current].imageUrl)
				  		          .attr('alt', lands[current].set + ' ' + lands[current].name);
				  		    next();
				  })
				  .delay(time_delay)
				  .fadeIn(time_delay);
			}
		});
	}


	// first load
	loadImage($('#carousel').data('current'), $('#carousel img'), 0);

	$('.filter-left').on('click', function(e) {
		current = $('#carousel').data('current');
		current = (current == 0) ? $('#carousel').data('max') : current - 1;
		loadImage(current, $('#carousel img'));
		$('#carousel').data('current', current);
	});

	$('.filter-right').on('click', function(e) {
		current = $('#carousel').data('current');
		current = (current == $('#carousel').data('max')) ? 0 : current + 1;
		loadImage(current, $('#carousel img'));
		$('#carousel').data('current', current);
	});

	setInterval(function() {
		$('.filter-right').trigger('click');
	}, 3000);



});