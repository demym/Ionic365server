// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
 var debugActive=true;
 var iedebug=false;
 var rooturl="http://localhost:3000";
 //var rooturl="http://generali.mybluemix.net";
 //var rooturl="http://ssodemyapp.mybluemix.net";
 var users_url=rooturl+"";
 var contacts_url=rooturl+"/contacts";
 var locations_url=rooturl+"/locations";
 var assets_url=rooturl+"/assets";

 /*
 var atleti_service = new AtletiService();
 var gare_service = new GareService();
 */
 //var users_service = new UsersService();

 //var contacts_service = new ContactsService();*/

 var contacts_service=new GenericService("/contacts","record");
 var locations_service=new GenericService("/locations","record");
 var assets_service=new GenericService("/assets","record");
 
 var url="";
 
 var sessionId = localStorage.getItem('myCookieName');
 
// if there was no localStorage for the session id 
// the application is being run for the first time
// the session id must be created
if (!sessionId) {
    //sessionId = uuid.v4();
	sessionId="stkz";
    localStorage.setItem('myCookieName', sessionId);
}
 
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	return; 
 
    // if there is data being sent
    // add the sessionId to it
    if (options.data) {
        options.data += '&sessionId=' + sessionId;
    }
 
    // if there is no data being sent
    // create the data and add the sessionId
    else {
        options.data = 'sessionId=' + sessionId;
    }
 
});

/*
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    console.log("device is ready");
}
*/

	


 $(document).on("pagebeforeshow","#page_installazione_edit",function(){
	 
     var tipoinstall=sessionStorage.installType;
     var h1="Nuova installazione" 
     if (tipoinstall=="new") 
     {
	  $("#page_installazione_edit").find("h1").html(h1);	 
	 }	
     if (tipoinstall=="substitution") 
     {
	  $("#page_installazione_edit").find("h1").html("Sostituzione");	 
	 }	
     if (tipoinstall=="uninstall") 
     {
	  $("#page_installazione_edit").find("h1").html("Disinstallazione");	 
	 }		 
	 
	 
	 
 })
 $(document).on("pageinit","#login",function() {
	 
	 $("#page_installazione_edit #sel_locations").selectmenu();
	 $("#page_installazione_edit #sel_assegnatario").selectmenu();
	 $("#page_installazione_edit #sel_assets").selectmenu();
	 
	 
	
	 
	 debug("pageinit index");

	
	 
	 	

	 
    /* --------------------------------- Event Registration -------------------------------- */
    $('.search-key').on('keyup', function() {
	  findByName();
	});
    $('.help-btn').on('click', function() {
        alert("Employee Directory v3.4");
		//findByName();
		
    });
	
	  $("#index #logout").on("click",function(){
		  console.log("clicked logout");
		  
		  $.get(rooturl+"/login/logout",function(res){
		    console.log(res);
		   if (res.loggedin) {
			 
		   //$.mobile.changePage("#index");
		 } else
		 {
		   	 console.log("logged out"); 
		 
		 }
		  });
		  
		  $.mobile.changePage("#login"); 
		  
		  
		  /*
	  users_service.logOut().done(function (res) {
		 console.log("logged out"); 
		 $.mobile.changePage("#login");
	  });*/
	  
  });
  
  
  $("#mySelectFilter").on("keyup",function(){
	  console.log("filter installazioni");
	  listInstallations();
	 
 })	 

	 
 })
 

 

 /*
  $('#login #btn-submit').on('click', function() { 
    console.log("login button click")
	
	$.post("/login",{
		"a":"2"
		
		
	},function(data){
		
		console.log("login done");
		
	});
	
	/*
    users_service.checkLogin($("#txt-email").val(),$("#txt-password").val()).done(function (res) {
		 console.log(res.loggedin);
		 if (res.loggedin) {
			 
		 $.mobile.changePage("#index");
		 } else
		 {
			   $('#dlg-invalid-credentials').popup("open");
		  //$.mobile.changePage("#dlg-invalid-credentials");	 
		 }
  });
  
  });
  */
  $(document).on("pageinit","#page_installazioni",function(){
    
  });

function binddelclick(){
  console.log("binddelclick");	 
  $("#page_installazioni .delitem").on("click",function(){
	  
	         var id=$(this).attr("id").replace("del","");   
             if (confirm("Sicuro di voler cancellare questa installazione ?"))
			 { 
			 $.post(rooturl+"/installations/deletebyid/"+id,{
				 'a':'1'
				 
				 
			 },function(data){
				 
				console.log("delete post ok");
				//alert(data);
				$("div#installations").empty().append(data);
		        $('div[data-role=collapsible]').collapsible();
		        $('ul.collaps').listview();
				$("#page_installazioni .delitem").unbind("click");
		        binddelclick();
			 })
			 }
          });              
   
} 


   $(document).on("pageshow","#page_installazioni",function () {
	   
	
	 
	 console.log("pageinit installazioni")

	 $.get(rooturl+"/installations/findall",function(data) {
		 
		 $("div#installations").empty().append(data);
		 $('div[data-role=collapsible]').collapsible();
		 $('ul.collaps').listview();
		 $("#page_installazioni .delitem").unbind("click");
		 binddelclick();
		 
	 });
	 
 });
 

 
  $('#login #btn-submit').on('click', function() { 
    var uid=$("#txt-email").val();
	var psw=$("#txt-password").val();
    console.log("login button click")
	$.get(rooturl+"/login/"+uid+"/"+psw,function(res){
		 console.log(res);
		 if (res.loggedin) {
		 //req.session.username=uid;	 
		 //localStorage.setItem('username',uid); 	
         //setStorage("installbuffer",[]);		 
		 $.mobile.changePage("#index");
		 } else
		 {
		  $('#dlg-invalid-credentials').popup("open");
		  //$.mobile.changePage("#dlg-invalid-credentials");	 
		 }
		
		console.log("login done");
		
	});
	/*
    users_service.checkLogin($("#txt-email").val(),$("#txt-password").val()).done(function (res) {
		 console.log(res.loggedin);
		 if (res.loggedin) {
			 
		 $.mobile.changePage("#index");
		 } else
		 {
		  $('#dlg-invalid-credentials').popup("open");
		  //$.mobile.changePage("#dlg-invalid-credentials");	 
		 }
  });*/
  });
 
 
 $(document).on("pageinit","#page_installazione_edit",function(){
	 
	    
	    console.log("pageinit page_installazione_edit");
	 
	    contacts_service.initialize(contacts_url).done(function (c) {
        console.log("Contacts Service initialized");
		 $('#popD').popup();
		
		
		contacts_service.findAll().done(function(c){
			//console.log(JSON.stringify(c));
			 $(c).each(function(i){
			  var el=c[i];
			 // console.log(JSON.stringify(c[i]));
			  //console.log(el.LAST_NAME[0]);
			$("#sel_assegnatario").append("<option value='"+el.LAST_NAME[0]+"'>"+el.LAST_NAME[0]+"</option>");
			$("#sel_assegnatario").selectmenu('refresh');
			
		   })
			
		})
		
		  locations_service.initialize(locations_url).done(function (c) {
        console.log("Locations Service initialized");
		
		
		locations_service.findAll().done(function(c){
			 console.log(JSON.stringify(c));
			 $(c).each(function(i){
			  var el=c[i];
			  //console.log(JSON.stringify(c[i]));
			  //console.log(el.LAST_NAME[0]);
			  
			 
			    $("#sel_locations").append("<option value='"+el.NAME[0]+"'>"+el.NAME[0]+"</option>");
			    $("#sel_locations").selectmenu('refresh');
			
		})
			
		})
		
		
		

		//findAll();
    });
	
	
	   assets_service.initialize(assets_url).done(function (c) {
        console.log("Assets Service initialized");
		
		
		assets_service.findAll().done(function(c){
			//console.log(JSON.stringify(c));
			 $(c).each(function(i){
			  var el=c[i];
			  //console.log(JSON.stringify(c[i]));
			  //console.log(el.LAST_NAME[0]);
			$("#sel_assets").append("<option value='"+el.ASSET_SN+"'>"+el.ASSET_SN+"</option>");
			$("#sel_assets").selectmenu('refresh');
			
		})
			
		})
		
		
		

		//findAll();
    });
		
	
		
		$("#butGetAssetBarcode").on("click",function() {
			navigator.camera.getPicture(
			
			function(imageURI) {
				
				var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData; 
				$(image).show();

            }, 
			function(err) {
			
			  alert('Failed because: ' + message);
			}, 
            { 
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI });
			})
		});	
		
		
		
		
		$("#butAdd").on("click",function() {
			
			 //alert("add");
			 
			 
			 var installbuffer=[];
			 console.log("get installbuffer: "+installbuffer);
			 
			 var j={
				 
				 tipo: $("#tipoinstallazione").val(),
				 assignee: $("#sel_assegnatario").val(),
				 location: $("#sel_locations").val()
				 
			 }
			 
			 var l=installbuffer.length;
			 console.log("installbuffer length before: "+l);
			 l++;
			 installbuffer[l]=j;
			 console.log("installbuffer length after: "+l);
			 console.log("value: "+JSON.stringify(installbuffer));
			 
			 
			// setStorage("installbuffer",installbuffer);
			 
	
		
			 $.post(rooturl+"/installations/addItem",j,function(data){
				 
				 console.log("post done");
				  $('#popD').find("#testo").html("Asset aggiunto");
				  //$('#popD').popup();
				  
				  $("#carrello").empty().html(data);  
					// $("#carrellorecnum").html($(data).find("li").length+" elementi");
					 $("#carrello").listview("refresh");
				     $('#popD').popup('open');
				  
				 
			 })
			 
		
		})
		
		$("#butAddInstall").on("click",function() {
			
			 //alert("add");
			 $.post(rooturl+"/installations/addItem/addInstallation",{
				 tipo: $("#tipoinstallazione").val(),
				 assignee: $("#sel_assegnatario").val(),
				 location: $("#sel_locations").val()
				 
			 },function(data){
				 
				 console.log("post done");
				 //alert("Installazione inserita");
				  $('#popD').find("#testo").html("Installazione registrata");
				  //$('#popD').popup();
				  $('#popD').popup('open');
				 $.mobile.changePage("#page_installazioni");
				 
			 })
			
		})
		

		//findAll();
    });
	
	

	
	 

 $("#myFilter").on("keyup",function(){
	 var val=$("#myFilter").val();
	 
	 contacts_service.findByName(val).done(function (c) {
		 //alert(JSON.stringify(c));
		   $("#sel_assegnatario").empty();
		 $(c).each(function(i){
			  var el=c[i];
			  //console.log(JSON.stringify(c[i]));
			  //console.log(el.LAST_NAME[0]);
			
			$("#sel_assegnatario").append("<option value='"+el.LAST_NAME[0]+"'>"+el.LAST_NAME[0]+"</option>");
			$("#sel_assegnatario").selectmenu('refresh');
		 });	
		 
	 } );
	 
	 
	 
 })
 
  $("#myFilterAssets").on("keyup",function(){
	 var val=$("#myFilterAssets").val();
	 
	 assets_service.findByName(val).done(function (c) {
		 //alert(JSON.stringify(c));
		 	$("#sel_assets").empty();
		 $(c).each(function(i){
			  var el=c[i];
			  //console.log(JSON.stringify(c[i]));
			  console.log(el.ASSET_SN[0]);
		
			$("#sel_assets").append("<option value='"+el.ASSET_SN[0]+"'>"+el.ASSET_SN[0]+"</option>");
			$("#sel_assets").selectmenu('refresh');
		 });	
		 
	 } );
	 
	 
	 
 })
 
 //})
 

 

  
  
	

    /* ---------------------------------- Local Functions ---------------------------------- */
    function findByName() {
	    console.log("findbyname");
        atleti_service.findByName($('.search-key').val()).done(function (atleti) {
			
			console.log(atleti.length);
			atleti.sort(function(a,b){
				
				a1=a.cognome;
				b1=b.cognome;
			
			    if (a1>b1) return 1;
				if (a1<b1) return -1;
				return 0;
				
			})
			
            var l = atleti.length;
			//console.log(l);
            var e;
            $('#lista').empty();
            for (var i = 0; i < l; i++) {
                e = atleti[i];
                $('#lista').append('<li><a href="#employees/' + e.id + '">' + e.cognome + ' ' + e.nome + '</a></li>');
            }
			$('#lista').listview("refresh");
        });
    }


/*
function findAll() {
	    console.log("findall");
        atleti_service.findAll().done(function (atleti) {
			
			console.log(atleti.length);
			/*atleti.sort(function(a,b){
				
				a1=a.cognome;
				b1=b.cognome;
			
			    if (a1>b1) return 1;
				if (a1<b1) return -1;
				return 0;
				
			})*/
			/*
            var l = atleti.length;
			//console.log(l);
            var e;
            $('#lista').empty();
            for (var i = 0; i < l; i++) {
                e = atleti[i];
                $('#lista').append('<li><a href="#employees/' + e.id + '">' + e.cognome + ' ' + e.nome + '</a></li>');
            }
			$('#lista').listview("refresh");
        });
    }
	
	*/
	
	/*
	
	$(document).on("pageinit","#page_atleti",function() {
		
		debug("pageinit atleti");
	/*	
	 atleti_service.findAll().done(function (data) {
			 	debug("got data: ")+data;
			$("#page_atleti #lista_atleti").append(data);
			 
		 });
		return;
		
		$.ajax({
		type: "GET",
		url: "http://localhost:5000/atleti",
		dataType: "html",
		success: function(data) {
		 	debug("got data: ")+data;
			$("#page_atleti #lista_atleti").append(data);
			 
		}});
		
	
	
	
	*/
	
//})




function debug(text,plugname) {
    if (debugActive==false) return; 
    if (plugname==null) plugname="";
	 
	 if (iedebug==true) 
	 { 
	  alert("DEBUG\n"+text); 
	 }
	if (window.console && window.console.log)
	{
	  window.console.log("DEBUG (iedebug="+iedebug+") - "+plugname.toUpperCase()+" - "+text);
	 } 

  }


function getStorage(key)
{
 var retrievedObject = localStorage.getItem(key);
 console.log("retrived string from storage: "+retrievedObject);
 var j;
 if (retrievedObject)
 {	 
  j=JSON.parse(retrievedObject);
 } else j="";
 console.log("getStorage key "+key+" : "+j);
 return j;	
}

function setStorage(key,strobj)
{
 console.log("setting key "+key+" to value "+JSON.stringify(strobj));	
 
 //localStorage.setItem(key, JSON.stringify(vobj));	 
 localStorage.setItem(key, JSON.stringify(strobj));	 
}


function newInstallation()
{
 console.log("new installation");	
 sessionStorage.installType="new";
 $.mobile.changePage("#page_installazione_edit"); 
	
	
}

function newUninstall()
{
 console.log("new uninstall");	
 sessionStorage.installType="uninstall";
 listInstallations(function(){
	 
  $.mobile.changePage("#page_select_installazioni"); 	 
 });
 
	
	
}
function newSubstitution()
{
 console.log("new substitution");	
 sessionStorage.installType="substitution";
 listInstallations(function(){
  $.mobile.changePage("#page_select_installazioni"); 	 
	 
 })
 
	
	
}

function listInstallations(callback)
{
 var filter=$.trim($("#mySelectFilter").val()).toLowerCase();
 
 $.get(rooturl+"/installations/findselectall",function(data) {
	 
	     //console.log(JSON.stringify(data));
		 var htm="<ul data-role=listview class='ui-listview'>"
		 
		 $(data.rows).each(function(i){
			 var doIt=true;
			 var row=data.rows[i];
			 if (filter!="")
			 {
			  if (row.doc.name.toLowerCase().indexOf(filter)==-1) {
				  doIt=false;
			  }	 
				 
			 }	 
			 if (doIt)
			 {
			  htm+='<li class="ui-btn ui-btn-icon-right ui-icon-carat-r"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" id="doc_'+row.doc._id+'" onclick="javascript:editInstall(this)">'+row.doc.name+'</a></li>'	 
				 
			 }
			 
			 
			 
		 })
		 htm+="</ul>"
		// alert(htm);
		 
		 $("div#installations").empty().append(htm);
		 $('div[data-role=collapsible]').collapsible();
		 $('ul.collaps').listview();
		 $("#page_installazioni .delitem").remove();
		 //binddelclick();
		 if (callback) callback();
		 
	 });	
	
}



//page logic


