var UsersService = function() {

    var url;
	

    this.initialize = function(serviceURL) {
		debug(serviceURL);
        url = serviceURL ? serviceURL : "http://localhost:5000";
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
	
	 this.findAll = function(searchKey) {

        return $.ajax({url: "/users" });
    }
	
	
	this.checkLogin = function(user,psw) {
		
		if (!user) user="aaa";
		if (!psw) psw="aaa";
		 
		 console.log("users service checklogin user="+user+" password="+psw);
		 
		 var urlx=url +"/login/"+user+"/"+psw;

        return $.ajax({url: urlx });
    }
	
	this.logOut=function(){
		console.log("Users service logout");
		var urlx=url +"/login/logout";

		return $.ajax({url: urlx });
		
	}


}