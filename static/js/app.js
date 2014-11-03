//property: characteristics of an object
//method: tasks/functions that the object performs
//init: initialize: Naam van functie
//xhr: xHTMLrequest

/*flow:
1: MOVIEAPP word gemaakt 
2: Data word in localstorage gezet en zorgt dat die bruikbaar is
3: routie ziet wat de persoon gekozen heeft
4: transparency rendert de pagina op met content
5: de change functie in router verandert de route en laat de pagina zien
*/

//Global Scope
//created MOVIAPP namespace
var MOVIEAPP = MOVIEAPP || {}; //Namespace

(function () { //Local scope

	//1
	//Controller Init
	MOVIEAPP.controller = {
		init: function () {

			//log to check if the MOVIEapplication has come this far
			console.log("Start MOVIEapplicatie");

			MOVIEAPP.check.localStorage();
		}
	};
 	
 	//2
 	//Hier zorg ik ervoor dat de API data in de localStorage gezet wordt. 
 	//Hiermee laad de data aan het begin en hoeft de site daarna geen data meer op te halen
	MOVIEAPP.check = {
        localStorage: function() {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                console.log("localStorage supported");

				MOVIEAPP.xhr.trigger('GET', 'http://dennistel.nl/movies', function (response) {
					localStorage.setItem('movies', response);
					MOVIEAPP.router.init();
					console.log("localStorage set");
				});

            //FALLBACK if webstorage is not supported, JSON data is put in the global scope
            } else {
                console.log("no support for localStorage :(");

				MOVIEAPP.xhr.trigger('GET', 'http://dennistel.nl/movies', function (response) {
				    window.globalData = response;
					window.localStorage.getItem = function(){return globalData};

					MOVIEAPP.router.init();
				});
            }
        }
    };

	//Dit is het hart van de app, de content. Hier geef ik aan wat
	//In deze content moet staan.
	//Er wordt in de app vaak terug gegrepen naar deze functies.

	MOVIEAPP.content = {

		//content voor de about page
		about: {
			//about text
			title:'about',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non purus sollicitudin, pretium velit sit amet, facilisis orci. Aliquam nec feugiat turpis. Cras a nibh sit amet orci mattis sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquet massa at condimentum cursus. Aliquam eu sagittis eros. Suspendisse lacinia fringilla pellentesque. Nullam sodales nisi vitae egestas commodo. Nullam tincidunt neque in euismod malesuada. Aliquam dui neque, porttitor ac est at, vulputate pellentesque orci. Sed ultrices pharetra magna, sit amet viverra libero sagittis non. Integer nunc arcu, viverra nec metus laoreet, venenatis lacinia lectus. Vestibulum pulvinar ultricies sapien, sit amet commodo felis euismod nec. In malesuada neque vitae nibh luctus maximus. Nam volutpat, erat sed fringilla facilisis, turpis lectus finibus velit, nec tristique ipsum sem vel lacus.'
		},

		//wat moet er gebeuren in de movies page
		movies: function (){
            var genre = '';

            return  MOVIEAPP.underscore.manipulateData();

        },

		//een functie die een id meekrijgt waarin data per ID aangepast wordt.
        film: function(id) {
            return  MOVIEAPP.underscore.manipulateData(id);
        },
	
		//een genre waarin genre meegegeven wordt. Data wordt per genre aangepast.
        moviesGenre: function(genre){
            console.log('in moviesGenre', genre);
            return  MOVIEAPP.underscore.manipulateData(genre);
        }

	};

	//maak gebruik van de library underscore. Voegt reviews in 1 en zorgt dat genre gefilterd kan worden
	MOVIEAPP.underscore = {

		manipulateData: function(genre) {

            var data = JSON.parse(localStorage.getItem('movies'));

            //map reduce
            _.map(data, function (movie, i){
                    movie.reviews   = _.reduce(movie.reviews,   function(memo, review){   return memo + review.score; }, 0) / movie.reviews.length;
                    return movie;
                })  

            console.log('movie.reviews', data);
            return(this.filter(data, genre));
        },

		    filter: function (data, genre) {
            var hash = window.location.hash;
            console.log(hash);
            var splitHash = hash.split("/");
            console.log('in filter data =', data);

            if (splitHash[2] === "genre") {
                console.log('in filter genre=',genre);
                    var data = _.filter(data, function (data) {

                        if (_.contains(data.genres, genre)) {
                            console.log(data);
                            return data;
                        }
                   });
            }
            return data;
            console.log('lastreturn',data);
        }
    };

	//xhr object for API
	//Dit object zorgt ervoor dat er data met een server uitgewisselt kan worden. 
	//Send data, update data, request data, receive data

	MOVIEAPP.xhr = {
        trigger: function (type, url, success, data) {
            var req = new XMLHttpRequest;
            req.open('GET', url, true);

            req.setRequestHeader('Content-type','application/json');

            type === 'POST' ? req.send(data) : req.send(null);

            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status === 200 || req.status === 201) {
                        success(req.responseText);
                    }
                }
            }
        }
    };


	//De directives zorgen ervoor dat er links gekoppelt kunnen worden aan de html
	//en dat de ID's gekoppeld worden aan de detailpagina

	MOVIEAPP.directives = {
			image: {
				src: function() {
					return this.cover;
				}
			},

			details: {
				href: function() {
                    return '#/movies/' + (this.id - 1); 
				}
			}
		};

	//Roep de router aan. Hier ga ik content koppelen aan bepaale namen achter de link
	//Hier zeg ik dus dat wanneer een link doorgezet moet worden er content opgehaald moet worden uit een andere functie.
	//Dit gebeurt doormiddel van een library; Routie

	MOVIEAPP.router = {
		init:function () {

			//3
			//ziet wat de gebruiker heeft gekozen
			routie({
				'/about': function() {
					MOVIEAPP.sections.about('about');
					console.log("route about");

					MOVIEAPP.content.about;
				},

				'/movies': function() {
					MOVIEAPP.sections.movies('movies');
					console.log("route movies");

					MOVIEAPP.content.movies;
				},

				'/movies/:id': function(id) {
					MOVIEAPP.sections.movie('film', id);
					console.log("route movie id");
					MOVIEAPP.sections.film();
				},

				'/movies/genre/:genre': function(genre) {
                    MOVIEAPP.sections.movieGenre('movies', genre);
                 }
			});
		},

		//5 -> 
		//de functie die zorgt dat de route verandert
		change: function (route) {
			
			// anders de route uit de URL te houden.
			if(!route)
				var route = window.location.hash.slice(2);

			sections = qwery('section[data-route]'),
			section = qwery('[data-route=' + route + ']')[0];

			/*sections = qwery('section'),
			section = qwery('[data-route=' + route + ']')[0];*/

			//Show the section that is active(has the active class), hide the others
			if (section) {
				for(var i=0; i < sections.length; i++){
				sections[i].classList.remove('active')
				}
				section.classList.add('active');
			}

			if(!route) {
				sections[0].classList.add('active');
			}
		}
	};

	//4
	//Hier gaan we alles bij elkaar brengen. Er wordt een section opgehaald.
	//Doormiddel van een library; Transparency kan content gerenderd worden op het scherm bij een bepaalde route
	MOVIEAPP.sections = {
		
		init: function(){
			this.about();
			this.movies();
			MOVIEAPP.directives();
		},
		
		//render de about pagina	
		about: function(route){
			Transparency.render(qwery('[data-route=about]')[0], MOVIEAPP.content.about);
			MOVIEAPP.router.change();
		},

		//render alle films
		movies: function(route){

			MOVIEAPP.content.movies = JSON.parse(localStorage.getItem('movies'));
			Transparency.render(qwery('[data-route=movies]')[0], MOVIEAPP.content.movies, MOVIEAPP.directives);
			MOVIEAPP.router.change();
		},

		//render de detail pagina
		movie: function(route, id){

			Transparency.render(qwery('[data-route=movie-details]')[0], MOVIEAPP.content.film()[id], MOVIEAPP.directives);
			MOVIEAPP.router.change('movie-details');
		},

		//zorg ervoor dat de review score klopt. 
		film: function(id) {
            return  MOVIEAPP.underscore.manipulateData(id);
        },

        //render genres
        movieGenre: function(route,genre) {
            console.log('in renderMoviesGenre genre =', genre);
            console.log('render details');
            Transparency.render(qwery('[data-route=movies]')[0], MOVIEAPP.content.moviesGenre(genre), MOVIEAPP.directives);
            MOVIEAPP.router.change(route);
	}
};


	//DOM ready code
	domready(function(){
		//Start SCOREapplication
		MOVIEAPP.controller.init();
		console.log("dom is ready");
	});

})();

