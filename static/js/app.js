//https://github.com/aproskam/Front-End2-201415/blob/master/WebApp%20-%20Eindopdracht/static/js/app.js

//property:
//method:
//init: initialize
//xhr: xHTMLrequest

//Global Scope
//created MOVIAPP namespace

var MOVIEAPP = MOVIEAPP || {}; //Namespace

(function () { //Local scope


		//Controller Init
	MOVIEAPP.controller = {
		init: function () {

			//log to check if the MOVIEapplication has come this far
			console.log("Start MOVIEapplicatie");

			MOVIEAPP.check.localStorage();

			/*pull data: schedule, game, ranking
			MOVIEAPP.router.init();
			//log and parse API data
			MOVIEAPP.xhr.trigger("GET", "http://dennistel.nl/movies", function(data){
			console.log('parsed data', JSON.parse(data));
			})*/
		}
	};
 
	MOVIEAPP.check = {
        localStorage: function() {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                console.log("localStorage supported");

				MOVIEAPP.xhr.trigger('GET', 'http://dennistel.nl/movies', function (response) {
					localStorage.setItem('movies', response);
					localStorage.setItem('film', response);
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

                // no native support for HTML5 storage :(
                // maybe try dojox.storage or a third-party solution
            }
        }
    };

	//data objecten
	MOVIEAPP.content = {

		about: {
			title:'about',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non purus sollicitudin, pretium velit sit amet, facilisis orci. Aliquam nec feugiat turpis. Cras a nibh sit amet orci mattis sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquet massa at condimentum cursus. Aliquam eu sagittis eros. Suspendisse lacinia fringilla pellentesque. Nullam sodales nisi vitae egestas commodo. Nullam tincidunt neque in euismod malesuada. Aliquam dui neque, porttitor ac est at, vulputate pellentesque orci. Sed ultrices pharetra magna, sit amet viverra libero sagittis non. Integer nunc arcu, viverra nec metus laoreet, venenatis lacinia lectus. Vestibulum pulvinar ultricies sapien, sit amet commodo felis euismod nec. In malesuada neque vitae nibh luctus maximus. Nam volutpat, erat sed fringilla facilisis, turpis lectus finibus velit, nec tristique ipsum sem vel lacus.'
		},

		movies: {

		},

		film: {

        },

        moviesGenre: function(genre){
            console.log('in moviesGenre', genre);
            return  MOVIEAPP.underscore.manipulateData(genre);
        }

	};

	MOVIEAPP.underscore = {

		manipulateData: function() {

            var data = JSON.parse(localStorage.getItem('movies'));

            //map reduce
            _.map(data, function (movie, i){
                    movie.reviews   = _.reduce(movie.reviews,   function(memo, review){   return memo + review.score; }, 0) / movie.reviews.length;
                    //movie.directors = _.reduce(movie.directors, function(memo, director){ return memo + director.name + ' '; }, '');
                    //movie.actors    = _.reduce(movie.actors,    function(memo, actor){    return memo + actor.actor_name + ', ';}, '');
                    //return movie;
                })  
            console.log('movie.reviews', data);
            return data;
        },

		    filter: function (data, genre) {
            var hash = window.location.hash;
            console.log(hash);
            var splitHash = hash.split("/");
            //console.log(splitHash[2]);
            //console.log(splitHash[2] === "genre");
            console.log('in filter data =', data);
            var input = document.querySelector(".input").value;
            console.log('input is', input)

            if (splitHash[2] === "genre") {
                console.log('in filter genre=',genre);
                    var data = _.filter(data, function (data) {

                        if (_.contains(data.genres, genre)) {
                            console.log(data);
                            return data;
                        }
                   });
            } else if (input.length > 0) {
                
                var data = _.filter(data, function (data){
                    var title = data.title.toLowerCase();
                    _.contains(title, input)
                });

                /*var data = _.filter(data, function(data) {
                    console.log('in search function input = ', input, 'en data is', data);
                                var title = data.title.toLowerCase();
                                
                                if (title.indexOf(input.toLowerCase()) !=-1) {
                                    return data;
                                }
                            });*/
            }

            return data;
        }
    };

	//xhr object for API
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


	//image content
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

	//router
	MOVIEAPP.router = {
		init:function () {

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

	//Page render
	MOVIEAPP.sections = {
		init: function(){
			this.about();
			this.movies();
			MOVIEAPP.directives();
		},
		about: function(route){
			Transparency.render(qwery('[data-route=about]')[0], MOVIEAPP.content.about);
			MOVIEAPP.router.change();
		},
		movies: function(route){

			MOVIEAPP.content.movies = JSON.parse(localStorage.getItem('movies'));
			Transparency.render(qwery('[data-route=movies]')[0], MOVIEAPP.content.movies, MOVIEAPP.directives);
			MOVIEAPP.router.change();
		},

		movie: function(route, id){

			MOVIEAPP.content.film = JSON.parse(localStorage.getItem('movies'))[id];
			Transparency.render(qwery('[data-route=movie-details]')[0], MOVIEAPP.content.film, MOVIEAPP.directives);
			MOVIEAPP.router.change('movie-details');
		},

		film: function(id) {
            return  MOVIEAPP.underscore.manipulateData(id);
        },
        //render the genres
        movieGenre: function(route,genre) {
            console.log('in renderMoviesGenre genre =', genre);
            console.log('render details');
            Transparency.render(qwery('[data-route=genre]')[0], MOVIEAPP.content.moviesGenre(genre), MOVIEAPP.directives);
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

