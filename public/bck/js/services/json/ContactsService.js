var ContactsService = function() {

    var url;

    this.initialize = function(serviceURL) {
		debug(serviceURL);
        url = serviceURL ? serviceURL : "http://localhost:5000/contacts";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function(searchKey) {
	     if (searchKey==null) searchKey="";
        return $.ajax({url: url + "?cognome=" + searchKey});
    }
	
	 this.findAll = function() {
        console.log("Contacts findAll");
		
        return $.ajax({url: url });
    }
	
	
	

}