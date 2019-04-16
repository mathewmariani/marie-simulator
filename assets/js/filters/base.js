Vue.filter('base', function(value, filter, fixed) {
	switch (filter) {
	case "ascii":
		return String.fromCharCode(value)
	case "decimal":
		value = (value > 0x7F) ? value - 0x100 : value
		return value.toString(10)
	case "hexadecimal":
		value = value.toString(16).toUpperCase()
		while (value.length < fixed) {
			value = '0'+value
		}
		return value
	case "octal":
		return value.toString(8)
	}
});