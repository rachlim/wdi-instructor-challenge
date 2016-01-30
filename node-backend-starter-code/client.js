/* 

I ♥ Movies Client
==========
Jeremiah Alexander

*/


var searchContainer, heartsContainer, searchInput, searchBtn, navHearts, navFavs, errorMessage, moviesContainer, uuid, shareLink;
var omdbSearchUrl = "http://www.omdbapi.com/?s=";
var omdbReadUrl = "http://www.omdbapi.com/?plot=full&i=";
var includedDetails = ["Released", "Genre", "Director", "Writer", "Actors", "Metascore"];

function setUUID(id){
	
	if ( !id || id === "" || id == uuid ) return;

	uuid = id;

	//update the browser url
	var stateObj = { uuid: uuid };
	history.pushState( stateObj, "I ♥ Movies || User Page", "?uuid=" + encodeURI(uuid) );
	
	//update the link to this page
	shareLink.textContent = window.location;
	shareLink.setAttribute("href", window.location);

	//make hearts section visible
	navHearts.className = "";
}
function displayError(message){
	errorMessage.innerHTML = message || "";
	if (!message){
		errorMessage.className = "alert alert-danger hidden";
	} else {
		errorMessage.className = "alert alert-danger";
	}
}

function clearMovies(){
	//clear all listings - todo. could instead reuse elements rather than creating them again
	while (moviesContainer.firstChild) 
	{
    	moviesContainer.removeChild(moviesContainer.firstChild);
	}
	searchInput.value = "";
}

//using the actual model id we remove a faviourite from our server
function removeFromHearts( oid ){

	var xmlhttpRequest = new XMLHttpRequest();

	//send post request to save new faviourite
	xmlhttpRequest.onreadystatechange = function(){
		if ( xmlhttpRequest.readyState === 4 ){
			//we'll ignore a success response and just out if we have an error
			if (xmlhttpRequest.status !== 200){
				displayError("Sorry but there was an error removing that heart, please reload the page and try again.");
			}
		}
	};
	xmlhttpRequest.open("DELETE", encodeURI("./favorites/" + oid), true);
	xmlhttpRequest.send();
}

//we make an ajax request to our server to save a movie to faviourites
function addToHearts( id, title ){

	var xmlhttpRequest = new XMLHttpRequest();

	//setup the data we need to send
	var params = encodeURI( "imdbID=" + id + "&title=" + title );
	
	if ( uuid ){
		//if we have a uuid we add with it, else one will be created for us
		params += "&uuid=" + uuid;
	}

	//send post request to save new faviourite
	xmlhttpRequest.open("POST", "./favorites", true);
	xmlhttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttpRequest.onreadystatechange = function(){
		if ( xmlhttpRequest.readyState === 4 ){
			if (xmlhttpRequest.status === 200){
				//we've added a heart, store our uuid for future retrival and addition
				setUUID(JSON.parse(xmlhttpRequest.responseText).uuid);
			} else {
				displayError("Sorry but there was an error adding to hearts, please reload the page and try again.");
			}
		}
	};

	xmlhttpRequest.send(params);
}
function displayMovie( data, container, hearted ){
	var btn;

	//update the formatting of the panel div and add the details elements
	var panel = document.createElement("div");
	panel.className = "panel-body";
	
	//if no poster is found it returns n/a so check for that
	if ( data.Poster != "N/A" ){
		var image = document.createElement("img");
		image.className = "img-rounded pull-left film-poster";
		image.src = encodeURI(data.Poster);
		panel.appendChild(image);
	}

	var body = document.createElement("div");
	body.className = "panel-body";
	panel.appendChild(body);

	var text = document.createElement("p");
	text.textContent = data.Plot;
	body.appendChild(text);

	var ul = document.createElement("ul");
	body.appendChild(ul);
	//display all other bits of info as a list
	for (var prop in data) {
        // skip if inherited 
        if ( !data.hasOwnProperty(prop) ) continue;
        if ( includedDetails.indexOf(prop) === -1) continue;
        //if it's an extra detail we want then add it to the list
		var li = document.createElement("li");
		ul.appendChild(li);
		li.textContent = prop + ": " + data[prop];
    }

	if ( hearted === true ) {
		//change the panel colour
		container.className = "panel panel-danger";
		btn = document.createElement("button");
		btn.className = "btn btn-default";
		btn.textContent = "un♥ this movie";
		body.appendChild(btn);

		//add an event listener for un saving this from faviourites
		btn.addEventListener("click", function(e){ 
			//highlight the panel & remove the button
			container.className = "panel panel-default";
			//remove the whole element
			container.parentElement.removeChild(container);
			removeFromHearts(container.id);
		}, false);

	} else {
		container.className = "panel panel-default";
		//create a button so the use can heart this
		btn = document.createElement("button");
		btn.className = "btn btn-default";
		btn.textContent = "♥ this movie";
		body.appendChild(btn);

		//add an event listener for saving this to faviourites
		btn.addEventListener("click", function(e){ 
			//highlight the panel & remove the button
			container.className = "panel panel-danger";
			//remove the button
			e.target.parentNode.removeChild(e.target);
			addToHearts(data.imdbID, data.Title);
		}, false);

	}

	container.appendChild(panel);
}

function loadHearts(){
	//we could persist the previous search results and just hide them but instead I've decided to clear them and reuse the same space
	clearMovies();
	//clear the error message
	displayError();

	//do a request to our server to load the hearts
	var xmlhttpRequest = new XMLHttpRequest();
	xmlhttpRequest.onreadystatechange = function(){
		if ( xmlhttpRequest.readyState === 4 ){
			if (xmlhttpRequest.status === 200){
				//now display our movie
				populateMovies( JSON.parse( xmlhttpRequest.responseText).movies, true );
			}
			else {
				displayError("Sorry but there was an error with your request, please reload the page and try again.");
			}
		}
	};
	xmlhttpRequest.open("GET", "./favorites/" + uuid, true);
	xmlhttpRequest.send(null);
}

//handle the loading of a movie
function loadMovie( id, container, hearted ){
	//clear the error message
	displayError();

	//when a movie is selected we do another request and expand the div like an accordian, we could close other divs but maybe it's nicer not too
	var xmlhttpRequest = new XMLHttpRequest();
	xmlhttpRequest.onreadystatechange = function(){
		if ( xmlhttpRequest.readyState === 4 ){
			var parsed = JSON.parse(xmlhttpRequest.responseText);
			if (xmlhttpRequest.status === 200 && parsed.Response !== "False"){
				//now display our movie
				displayMovie(parsed, container, hearted);
			}
			else {
				displayError("Sorry but there was an error with your request, please reload the page and try again.");
				//jump the page to the top
				window.location.href = "#";
			}
		}
	};
	xmlhttpRequest.open("GET", encodeURI(omdbReadUrl + id), true);
	xmlhttpRequest.send(null);
}

//handle movie selection
function onMovieSelected(e){
	//stop default action i.e. navigate to #
	event.preventDefault();

	//the containing div for our link is two levels up
	var container = e.target.parentElement.parentElement;
	var header = e.target.parentElement;

	//whilst we could allow opening and closing of panels we don't, so once expanded we just replace the link with a title
	var title = document.createElement("h3");
	title.className = "panel-title";
	title.textContent = e.target.textContent;
	header.appendChild(title);

	//remove the link
	e.target.parentNode.removeChild(e.target);

	loadMovie(container.id, container, false);
}


//display the list of movies
function populateMovies( results, hearted ){

	clearMovies();

	//create a fragment to add each result to
	var fragment = document.createDocumentFragment();
	//add a new one for each
	for ( var i = 0; i < results.length; ++i){
		var article = document.createElement("article");
		article.className = "panel panel-default";

		//create a seperate title div also
		var header = document.createElement("div");
		header.className = "panel-heading";
		article.appendChild(header);

		//if we're displaying the hearts list then we display expanded else we use links
		if ( hearted ) {

			//if it's a heart then we have it saved, so we store the actual model id in the article to make deletion easy
			article.id = results[i]._id;
			//add a non-link header
			var title = document.createElement("h3");
			title.className = "panel-title";
			title.textContent = results[i].title;
			header.appendChild(title);

			//call our load movie function to populate the article
			loadMovie( results[i].imdbID, article, true );
		} else {

			//as a convenience we set the id of the container to the id we need for search
			article.id = results[i].imdbID;
			//add a link to our header and listen for clicks
			var link = document.createElement("a");
			link.setAttribute("href","#");
			link.textContent = results[i].Title;
	  		link.addEventListener("click", onMovieSelected, false);
			header.appendChild(link);	
		}
		
		//save article to our fragment
		moviesContainer.appendChild(article);
	}

	//append our completed fragment
	moviesContainer.appendChild(fragment);
}

//handle search being clicked
function onSearchClick() {
	
	//return if we're already searching, rather than store a bool, we'll just use the disabled state of the button
	if ( searchBtn.disabled ) {
		return;
	}

	//clear the error message before we begin our search
	displayError();

	//find what the user is search for
	var searchingFor = searchInput.value;

	//Disable the button and change the text so the user knows we are searching
	searchBtn.text = "Searching...";
	searchInput.disabled = searchBtn.disabled = true;

	//time to make our ajax request
	var xmlhttpRequest = new XMLHttpRequest();
	xmlhttpRequest.onreadystatechange = function(){
		if ( xmlhttpRequest.readyState === 4 ){
			var parsed = JSON.parse(xmlhttpRequest.responseText);
			if ( xmlhttpRequest.status === 200 && parsed.Response !== "False"){
				populateMovies( parsed.Search, false );
			}
			else {
				displayError("Sorry but there was an error with your request, please try again.");
			}
			//reenable our search button
			searchBtn.text = "Go!";
			searchInput.disabled = searchBtn.disabled = false;
		}
	};

	xmlhttpRequest.open("GET", encodeURI(omdbSearchUrl + searchingFor), true);
	xmlhttpRequest.send(null);
}
//handle search tab being select
function onNavSearchClick() {
	navSearch.className = "active";
	navHearts.className = ( uuid ) ? "" : "hidden";
	searchContainer.className = "";
	heartsContainer.className = "hidden";

	clearMovies();
	//stop the link being processed
	event.preventDefault();
}
//handle nav tab being select
function onNavHeartsClick() {
	navSearch.className = "";
	navHearts.className = "active";
	searchContainer.className = "hidden";
	heartsContainer.className = "";

	loadHearts();
	//stop the link being processed
	event.preventDefault();
}

//nice function found on stackoverflow for getting the url parameters - is that cheating?
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//all initialisation happens in our page load event
window.onload = function(){ 

	//check if we recieved a uid for the user
	setUUID( getParameterByName("uuid") );

	//cache our commonly referenced elements
	searchContainer = document.getElementById("searchContainer");
	heartsContainer = document.getElementById("heartsContainer");
	searchInput = document.getElementById("searchInput");
	searchBtn = document.getElementById("searchBtn");
	navSearch = document.getElementById("navSearch");
	navHearts = document.getElementById("navHearts");
	errorMessage = document.getElementById("errorMessage");
	moviesContainer = document.getElementById("movies");
	shareLink = document.getElementById("shareLink");

	//add an event listener for tab selection and form processing
	navSearch.addEventListener("click", onNavSearchClick, false);
	navHearts.addEventListener("click", onNavHeartsClick, false);
	searchBtn.addEventListener("click", onSearchClick, false);
	//also allow an enter key press to trigger the search
	searchInput.addEventListener("keydown", function(e){ 
		if (e.keyCode === 13 ){
			onSearchClick();
		}
	}, false);

	//finally if we've used our uuid jump straight to our page
	if ( uuid ) onNavHeartsClick();
};