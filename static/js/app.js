//Global Scope
//created MOVIAPP namespace

var MOVIEAPP = MOVIEAPP || {}; //Namespace

(function () { //Local scope

	//data objecten
	MOVIEAPP.content = {

		about: {
			title:'about',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non purus sollicitudin, pretium velit sit amet, facilisis orci. Aliquam nec feugiat turpis. Cras a nibh sit amet orci mattis sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquet massa at condimentum cursus. Aliquam eu sagittis eros. Suspendisse lacinia fringilla pellentesque. Nullam sodales nisi vitae egestas commodo. Nullam tincidunt neque in euismod malesuada. Aliquam dui neque, porttitor ac est at, vulputate pellentesque orci. Sed ultrices pharetra magna, sit amet viverra libero sagittis non. Integer nunc arcu, viverra nec metus laoreet, venenatis lacinia lectus. Vestibulum pulvinar ultricies sapien, sit amet commodo felis euismod nec. In malesuada neque vitae nibh luctus maximus. Nam volutpat, erat sed fringilla facilisis, turpis lectus finibus velit, nec tristique ipsum sem vel lacus.'
		},

		movies: {
			title: 'movies',
			items: [
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", image: "https://pbs.twimg.com/profile_images/496363117681455106/X2aE1GcC_reasonably_small.jpeg" },
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", image: "https://pbs.twimg.com/profile_images/496363117681455106/X2aE1GcC_reasonably_small.jpeg" },
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", image: "https://pbs.twimg.com/profile_images/496363117681455106/X2aE1GcC_reasonably_small.jpeg" },
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", image: "https://pbs.twimg.com/profile_images/496363117681455106/X2aE1GcC_reasonably_small.jpeg" },
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", image: "https://pbs.twimg.com/profile_images/496363117681455106/X2aE1GcC_reasonably_small.jpeg" },
				{ title: "Guardians of the Galaxy", releaseDate: "15 September 2014", description: "description here", image: "https://pbs.twimg.com/profile_images/496363117681455106/X2aE1GcC_reasonably_small.jpeg" }
			]
		}
	};

	//image content
	MOVIEAPP.directives = {
			image: {
				src: function() {
					return this.image;
				}
			}
		}

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
					MOVIEAPP.sections.about();
					console.log("route about");
				},

				'/movies': function() {
					MOVIEAPP.sections.movies();
					console.log("route movies");
				}

			});
		},

		change: function () {
			var route = window.location.hash.slice(2),
			sections = qwery('section[data-route]'),
			section = qwery('[data-route=' + route + ']')[0];

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
			MOVIEAPP.sections.about();
			MOVIEAPP.sections.movies();
		},
		about: function(){
			Transparency.render(qwery('[data-route=about]')[0], MOVIEAPP.content.about);
			MOVIEAPP.router.change();
		},
		movies: function(){
			Transparency.render(qwery('[data-route=movies]')[0], MOVIEAPP.content.movies, MOVIEAPP.directives);
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