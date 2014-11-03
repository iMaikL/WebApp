//Gebruik hammer.js om met een pan het secondary menu te laten zien.
Hammer(document.getElementById("navigation")).on("pandown", function() {
        	
        	//Laat een pop-up zien dat de doubletap geregistreerd is
        	//alert('pandown on div');
        	document.getElementById("genreMenu").classList.add('active');
        })

//Gebruik hammer.js om met een doubletap het secondary menu te laten verdwijnen.
Hammer(document.getElementById("content")).on("doubletap", function() {
        	
        	//Laat een pop-up zien dat de doubletap geregistreerd is
        	//alert('panup on div');
        	document.getElementById("genreMenu").classList.remove('active');
        })