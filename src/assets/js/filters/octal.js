Vue.filter('decimal', function(value) {
	return value.toString(8).toUpperCase()
});