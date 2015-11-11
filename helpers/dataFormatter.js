module.exports = {

	formatQueryIntoOptions: function(query) {
	  var result = {
	  	query: {}
	  };
	  for (var k in query) {
	    // special cases
	    if (k.toLowerCase() === 'borough') {
	      result.query.borough = this.titleCase(query[k]);
	    } else if (k.toLowerCase() === 'skip') {
		    result.skip = parseInt(query[k]);
	    } else if (k.toLowerCase() === 'limit') {
		    result.limit = parseInt(query[k]);
		  } else {
		  	result.query[k.toLowerCase()] = query[k];
		  }
	  }
	  return result;
	},

	// not using
	formatCourtsData: function(courts) {
	  var data = {
	    courts: {},
	    boroughs: []
	  };
	  for (var i = 0; i < courts.length; i++) {
	    var borough = courts[i].borough;
	    if (data.boroughs.indexOf(borough) === -1) {
	      data.courts[courts[i].borough] = [];
	      data.boroughs.push(borough);
	    }
	    data.courts[borough].push(courts[i]);
	  }
	  return data;
	},

	titleCase: function(str) {
	  return str.split(' ').map(function(w){return w.toLowerCase().replace(w.charAt(0).toLowerCase(), w.charAt(0).toUpperCase())}).join(' ');
	}

};