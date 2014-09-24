//Global Scope
//created MOVIAPP namespace

var MOVIEAPP = MOVIEAPP || {}; //Namespace

(function () { //Local scope

	//data objecten
	MOVIEAPP.content = {

		about: {
			title:'about',
			description: 'description here'
		},

		movies: {
			title: 'movies',
			items: [
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", cover: "image here" }
			]
		}
	};

	//Controller Init
	MOVIEAPP.controller = {
		init: function () {
			//log to check if the MOVIEapplication has come this far
			console.log("Start MOVIEapplicatie");

			//pull data: schedule, game, ranking
			MOVIEAPP.router.init();
		}
	};

	//router
	MOVIEAPP.router = {
		init:function () {
			routie({
				'/about': function() {
					MOVIEAPP.page.about();
					console.log("route about");
				},

				'/movies': function() {
					MOVIEAPP.page.movies();
					console.log("route about");
				}

			});
		},

		change: function () {
			var route = window.location.hash.slice(2),
			sections = qwery('section[data-route]'),
			sections = qwery('[data-route=' + route + ']')[0];

			//Show the section that is active(has the active class), hide the others
			if (section) {
			for(var i=0; i < sections.lenght; i++){
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

		},
		about: function(){
			Transparency.render(qwery('[data-route=about]')[0], MOVIEAPP.content.about);
			MOVIEAPP.router.change();
		},
		movies: function(){
			Transparency.render(qwery('[data-route=movies]')[0], MOVIEAPP.content.movies);
			MOVIEAPP.router.change();
		}
	};

	//DOM ready code
	domready(function(){
		//Start SCOREapplication
		MOVIEAPP.controller.init();
		console.log("dom is ready");
	});

})();