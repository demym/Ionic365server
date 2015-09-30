var GenericService = function(u,t) {

    console.log("Generic service instantiated with url="+u+" and tag="+t);
    var url=u;
	var tag=t;

    this.initialize = function(serviceURL,serviceKeyword) {
		debug(serviceURL);
        url = serviceURL ? serviceURL : "http://localhost:5000"+url;
		tag=serviceKeyword;
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/id/" + id});
    }

    this.findByName = function(searchKey) {
	     if (searchKey==null) searchKey="";
        return $.ajax({url: url + "/nome/" + searchKey});
    }
	
	 this.findAll = function() {
        console.log("Service "+" findAll");
		
        return $.ajax({url: url });
    }
	
	
	
	
	
	

}