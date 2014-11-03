//Gebruik hammer.js om met een doubletap het secondary menu te laten zien.
Hammer(document.getElementById("navigation")).on("doubletap", function() {
        	
        	//Laat een pop-up zien dat de doubletap geregistreerd is
        	/*alert('doubletap on div');*/

        	document.getElementById("genreMenu").classList.add('active');
        })