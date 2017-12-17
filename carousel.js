$(document).ready( function() {
	var images = [];

	// add some incons to select option
	// $('select option').each( function() {
	// 	code = $(this).val().toLowerCase();
	// 	$(this).prepend($('<span></span>').addClass("ss ss-" + code));
	// })

	// Request to update current set/land-type 
	function updateImages() {
		land = $('.land_on').data('land');
		set_code = $('select').val().toLowerCase();
		$.ajax({
			url : `https://api.magicthegathering.io/v1/cards?name=${land}&set=${set_code}&supertypes=Basic`,
			type : 'GET',
			dataType : 'json',

			success : function(response, statut) {
				count_lands = response.cards.length;
				if (count_lands > 0) {
					$('#carousel').data('max', count_lands-1);
					$('#carousel').data('current', 0);
					loadImage(0, $('#carousel .response_area'), 0);
				} else {
					$('#carousel .response_area').text('Ooops no land here...');
				}
			}
		});
	}

	// land choice
	$('.land').on('click', function() {
		$('.land').addClass('land_off').removeClass('land_on');
		$(this).removeClass('land_off').addClass('land_on');

		// set body bg to land color
		console.log($(this).find('svg').children().attr('fill'));
		$('body').css('background-color', $(this).find('svg').children().attr('fill'));

		updateImages();
	});

	$('.land:first').click();

	$('select').on('change', function() {
		// change active set
		name = $('select option:selected').text();
		code = $(this).val().toLowerCase();
	 	icon = $('<i></i>').addClass("ss ss-" + code);
		$('#active-set-h2').text(name);
		$('.subtitle span:first').text('').append(icon);
		$('.subtitle span:last').text('').append(icon.clone());

		updateImages();
	});

	$('select option:first').trigger('change');

	function loadImage(current, target, time_delay=250) {
		land = $('.land_on').data('land');
		set_code = $('select').val().toLowerCase();
		$.ajax({
			url : `https://api.magicthegathering.io/v1/cards?name=${land}&set=${set_code}&supertypes=Basic`,
			type : 'GET',
			dataType : 'json',

			success : function(response, statut) {
				lands = response.cards;
				if (lands.length < 1) {
					target.fadeOut(time_delay)
						.queue(function(next) {
				  			target.text('Ooops no land here...');
				  		    next();
				  		})
						.fadeIn(time_delay);
				} else {
					target.fadeOut(time_delay)
					  .delay(time_delay)
					  .queue(function(next) {
					  			target.text('');
					  			new_elm = $('<img>').attr('src', lands[current].imageUrl)
					  		    					.attr('alt', lands[current].set + ' ' + lands[current].name);
					  			target.append(new_elm);
					  		    next();
					  })
					  .delay(time_delay)
					  .fadeIn(time_delay);
				}
			}
		});
	}

	// Carousel left/right arrow events
	$('.filter-left').on('click', function(e) {
		current = $('#carousel').data('current');
		current = (current == 0) ? $('#carousel').data('max') : current - 1;
		loadImage(current, $('#carousel .response_area'));
		$('#carousel').data('current', current);
	});

	$('.filter-right').on('click', function(e) {
		current = $('#carousel').data('current');
		current = (current == $('#carousel').data('max')) ? 0 : current + 1;
		loadImage(current, $('#carousel .response_area'));
		$('#carousel').data('current', current);
	});

	// Autochanging carousel every 3sec
	setInterval(function() {
		$('.filter-right').trigger('click');
	}, 3000);



});