Vue.filter('hexadecimal', function(value, fixed) {
	value = value.toString(16).toUpperCase()
	while (value.length < fixed) {
		value = '0'+value
	}
	return value
});