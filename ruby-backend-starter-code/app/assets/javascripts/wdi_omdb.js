// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
/**
 * Created by ea0723 on 1/22/16.
 */

$(document).ready(function (){

	var searchContainer = $('#searchContainer');
	var resultsContainer = $('#resultsContainer');

	$('form').on('submit', function (e) {
		e.preventDefault();
		searchContainer.find('ol').text('');
		resultsContainer.hide();
		$('#imageContainer').hide();
		var title = $('#title').val();
		var url = 'https://www.omdbapi.com/?s=' + title + '&type=movie&r=json';
		if (title == ''){
			alert("You didn't enter anything! Search box can't be blank");
		}
		else {
			console.log("movie title = " + title);
			console.log("search url = " + url);
			$.ajax(url, {
				success: function (data) {
					console.log(data);
					$.each(data['Search'], function(index, item){
						var result = item.Title;
						//console.log("item title = " + result);
						searchContainer.find('ol').append('<li><span class="link-ish" id="'+result+'">' + result + '</span></li>');
					});
				}
			})
		}
	});

	searchContainer.delegate('li>span.link-ish', 'click', function(e){
		console.log('clicked ');
		var title = e.target.id;
		var url = 'https://www.omdbapi.com/?t=' + title + '&type=movie&y=&plot=full&r=json';
		console.log("individual movie is " + title);
		console.log(url);
		$('#clear').show();
		$.ajax(url, {
			success: function (data) {
				console.log(data);
				var poster = data.Poster;
				resultsContainer.find('.title').html(data.Title);
				resultsContainer.find('.year').text(data.Year);
				resultsContainer.find('.actors').text(data.Actors);
				resultsContainer.find('.plot').text(data.Plot);
				resultsContainer.find('.rated').text(data.Rated);
				if (poster == 'N/A'){
					$('#imageContainer').find('.poster').html('<img src="/assets/images.png" height: "400px"/>');
				}
				else {
				$('#imageContainer').find('.poster').html('<img src="' + data.Poster + '" height: "200px"/>');
				}
				resultsContainer.show();
				$('#imageContainer').show();
				$(this).show(function () {
					$('html, body').delay('0').animate({scrollTop: $(document).height() - $(window).height() }, 0);
				});
			}
		});
	});

});

