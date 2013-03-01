dogs = ['lilo', 'fifi', 'max'];
cats = ['ringo', 'kitty', 'felix']
var pairAnimals = function(dog, cat) {
	return console.log(dog + " " + cat);
}; 

for (var i = 0; i < dogs.length; i++) {
	var dog = dogs[i];
	for (var ii = cats.length - 1; ii >= 0; ii--) {
		var cat = cats[ii];
		console.log(dog + " " + cat);
	};
};