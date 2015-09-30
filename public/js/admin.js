var pictureSource; // picture source
var destinationType; // sets the format of returned value
var scheda={};
//var rooturl="http://localhost:3000";
//var rooturl="http://9.71.92.76:3000";
//var rooturl="http://192.168.1.3:3000";
var rooturl="http://ssodemyapp.mybluemix.net";
var logactive=true;
var isPhone=false;
var boname="scheda";
var bonames="Schede";
var eventsArray=[];
var docsArray=[];
var calendarType=1;
var currentview="agendaWeek";
var currentdate=new Date();
var calcreated=false;
var aspectRatio=0.6;
var deletingEvent=false;
var meetingcolor="#3333CC";
var eventcolor="#009933";
var calendar;
var updatecal=false;
var users=[];
var calendarview="list";
//var tplurl=rooturl+"/";
var tplurl="";
var cookieDays=3;
var isCordovaApp = false;
var storage;
var doc_categories="BlueMix,SoftLayer,Storage,Verse";
var pushNotification;
var shareMenu=false;
var selectedObjects={ db: "",rows:[]}
var selectModeOn=false;
var socialframesrc="http://ibmblritalia.tumblr.com/";
var stoppropagate=false;
//var tplurl="http://localhost:3000/";


/*
$(document).delegate('#index', 'pageinit', function(){
//	 $.event.special.tap.emitTapOnTaphold = false;
//	initPageIndex();
	
// do stuff 
})
$(document).delegate('#page_calendar', 'pageinit', function(){
//	initPageCalendar();
// do stuff 
})
		
*/	

function doLogin(){
	var page=$("#login2");
	var email=page.find("#txt-email").val();
	var psw=page.find("#txt-password").val();
	var ck=$("#chck-rememberme").attr("checked");
	progressStart("Loggin in...","Log-in");
	$.ajax({
			url: rooturl+"/events/login",
			data: {
				email: email,
				password: psw
			},
            type: "POST"})
        .done(function(data) {
			progressStop();
			console.log("login result: "+JSON.stringify(data));
			if (data.loggedin=="true")
			{
			 toast("login successfull");	
		     if (ck=="checked")
			 {
				 
			  setCookie("email",email,cookieDays);	 
			  setCookie("psw",psw,cookieDays);
			  console.log("setted cookies")
			 } else {
				deleteCookie("email");
			  deleteCookie("psw");
			  console.log("deleted cookies");
				 
			 }
			 console.log(data.email+" "+data.firstname+" "+data.lastname+" "+data.role+" "+data.company)
             $("#index #accountPanel #useremail").html(email) ;
			 $("#index #accountPanel #username").html(data.firstname+" "+data.lastname) ;
			  $("#index  #welcome").html("Welcome <b>"+data.firstname+" "+data.lastname+"</b>") ;
			  	  $("#index  #homeusername").html("<b>"+data.firstname+" "+data.lastname+"</b>") ;
				  $("#index  #homerole").html("<b>"+data.role+"</b>") ;
			 $("#index #accountPanel #userrole").html("role: "+data.role+" - "+data.company) ;
			 //$("#index #accountPanel #usercompany").html(data.company) ;
			 console.log("userid: "+data.id);
			 setCookie("user",JSON.stringify(data));
			 //alert(getCookie("user"));
			 var c=JSON.parse(getCookie("user"));
			 //alert(c.role);
			 $.mobile.changePage("#index");
			} else {
				$("#login2 #dlg-invalid-credentials").popup("open");
			}	
			
		   

		})
        .fail(function() {
			progressStop();
			toast("Error getting elibrary documents","long");
			//dlg.dialog('close');
		});	
	

	
}	


function showLoginPage() {
	
	//alert("showLoginPage");
	var em=getCookie("email");
	var pw=getCookie("psw");
	
	//alert("cookies: "+em+" - "+pw);
	if (em && pw)
	{
     $("#login2 #txt-email").val(em);
	 $("#login2 #txt-password").val(pw);
		
	} else {
		$("#login2 #txt-email").val("");
	 $("#login2 #txt-password").val("");
	}
	//alert(em+" - "+pw);
	$.mobile.changePage("#login2");
}

function doLogout(){
	//showLoginPage();
	 gConfirm("Do you really want to log out ?","Log out",function() {
		showStartPage();
	},function() {
		
		
	});
	
	//$.mobile.changePage("#login");
	
}	

function showStartPage() {
	$.mobile.changePage("#login");
}

function gotoReachMe()
{
 
/*	$('#reachme #repframe').load(function() {
	alert("loaded iframe")	 
      var ibody=$(this).contents().find("body");
	  alert(ibody.html());
	  //ibody.not(".ibm-live-assistance").hide();
	  
});*/
	$.mobile.changePage("#reachme");
}

function doSignup(){
	 
	var page=$("#signup");
    var firstname=page.find("#txt-first-name").val(); 	
	var lastname=page.find("#txt-last-name").val();
	var email=page.find("#txt-email").val();
	var psw=page.find("#txt-password").val();
	var confirmpsw=page.find("#txt-password-confirm").val();
	
	var error=false;
	var errfields="";
	
	if ($.trim(email)=="") {
	  error=true;
      errfields+="email not specified\n";	  
	}
		if ($.trim(psw)=="") {
	  error=true;
      errfields+="password not specified\n";	  
	}
	
		if ($.trim(confirmpsw)=="") {
	  error=true;
      errfields+="confirm password not specified\n";	  
	}
	
	
	if (error)
	{
	 alerta("ERROR\n\n"+errfields);
     return;	 
		
	}
	
	var data={
			firstname: firstname,
				lastname: lastname,
				email: email,
				password: psw,
				url: rooturl
		
	}
	
	//alert(JSON.stringify(data));
	
	 $.ajax({
			url: rooturl+"/events/signupuser",
			data: data,
            type: "POST"})
        .done(function(data) {
			alert(JSON.stringify(data));
			//console.log("list result: "+JSON.stringify(data));
		   $.mobile.changePage("#dlg-sign-up-sent",{
			   role: "dialog" 
			   
		   })

		})
        .fail(function() {
			toast("Error getting elibrary documents","long");
			//dlg.dialog('close');
		});	
	
	
}


function initPageIndex() {
	//$("#eventDialog").dialog();
	 $.ajax({
            //url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
			url: rooturl+"/events/listusers",
            type: "GET"})
        .done(function(data) {
			//console.log("list result: "+JSON.stringify(data));
			if (data.rows)
			{	
			var rows=data.rows;
			colog("Found "+rows.length+" users");
			//var events=[];
			var idx=-1;
			
			for (var i=0; i<rows.length; i++)
			{
		     var doc=rows[i].doc;
			 users.push(doc);
			
			}	
		    
			//alert(JSON.stringify(events));
			} else colog("No rows found");


		})
        .fail(function() {
			toast("Error getting elibrary documents","long");
			//dlg.dialog('close');
		});	
	
}	

function showCalendar(){
	//alert("calendar");
	setCalendar(1);
	$.mobile.changePage("#page_calendar");
	
}

function gotoIndex() {
	$.mobile.changePage("#index");
}

function gotoElib() {
	
	refreshElibrary();
	
	// DINOOOOOOOOOOOOOO
	
	$("#menuPanel").panel("close");
	
	var walllibrary = new Freewall("#freewallLibrary");
	walllibrary.reset({
		selector: '.bricklibrary',
		animate: true,
		cellW: 200,
		cellH: 250,
		onResize: function() {
			walllibrary.fitWidth();
		}
	});
	walllibrary.filter(".pdf");

	$(".filter-label-library").click(function() {
			$(".filter-label-library").removeClass("active");
			var filterlibrary = $(this).addClass('active').data('filter');
			if (filterlibrary) {
				walllibrary.filter(filterlibrary);
			} else {
				walllibrary.unFilter();
			}
			walllibrary.fitWidth();
	});
			
	walllibrary.fitWidth();
	
	$.mobile.changePage("#page_elibrary");
	
}

function refreshElibrary(callback)
{
	console.log("refreshElibrary") 
  	var role="";
	var company="";
	var uid="";
	
	var c=getCookie("user");
	
	if (JSON.parse(c).role) role=JSON.parse(c).role;
	if (JSON.parse(c).company) company=JSON.parse(c).company;
	if (JSON.parse(c).id) uid=JSON.parse(c).id;

	//alert(role);
	
	var link="/events/listelibrary";
	//if (role.toLowerCase()=="customer") link+="/"+company;
	if (role.toLowerCase()=="customer") link+="/byuserid/"+uid;
  docsArray=[];	 
  $.ajax({
            //url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
			url: rooturl+link,
            type: "GET"})
        .done(function(data) {
			colog("list result: "+JSON.stringify(data));
			var rows=data.rows;
			$(rows).each(function(i){
				var row=rows[i];
				docsArray.push(row.doc);
				
			});
			colog("Found "+rows.length+" elibrary documents");
			colog("docsArray lenght: "+docsArray.length);
			var html = new EJS({url: tplurl+'tpl/elibrary.ejs'}).render(docsArray); 
	  
	 
	 
	 $("#page_elibrary #freewallLibrary").empty().append(html);
	 
	   if (callback) callback();

	 
          // $("#page_elibrary #ulelib").empty().append(html);
		   //$("#page_elibrary #recnum").empty().html(docsArray.length+" documents");
			//var events=[];
			
			$("#page_elibrary #ulelib").find("li").on("taphold",function() {
				return;
				var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					if (role.trim().toLowerCase()=="customer") return;
					
				}
				
						/*
				shareMenu=true;
				var li=$(this)
				li.addClass("shareSelected");
				selectedObjects={db: "",rows: []};
				selectShare(li,"elibrary");
				// ero qui
				return;
				*/
				
				
			    var id=$(this).find("a").attr("id").split("_")[0];
				var rev=$(this).find("a").attr("id").split("_")[1];
				var obj={ 
				 id: id,
				 rev: rev
				};
  			   gConfirm("Confirm delete of the document ?","Confirm delete",function() {
				  progressStart("Deleting document"); 
				 $.ajax({
             		url: rooturl+"/events/deletedocument",
					data: obj,
                    type: "POST"
				 }).done(function(data) {
					  progressStop();
                      refreshElibrary();
					  
				 });	  
				},function() {
					  
					  
				 });  
			});	  
		});	
 
}

function gotoCalendar() {
	$.mobile.changePage("#page_calendar");
	$("#menuPanel").panel("close");
}
	
function initPageCalendar(callback)
{		
   
   //alert("initPageCalendar");
    $("#page_calendar #mcolor").css("background",meetingcolor).css("color","white");
	$("#page_calendar #ecolor").css("background",eventcolor).css("color","white");
    colog("pageinit calendar");
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
	eventsArray=[];
	
	var role="";
	var company="";
	var uid="";
	
	var c=getCookie("user");
	
	if (JSON.parse(c).role) role=JSON.parse(c).role;
	if (JSON.parse(c).company) company=JSON.parse(c).company;
	if (JSON.parse(c).id) uid=JSON.parse(c).id;

	//alert(role);
	
	var link="/events/listcalendarevents";
	//if (role.toLowerCase()=="customer") link+="/"+company;
	if (role.toLowerCase()=="customer") link+="/byuserid/"+uid;
	
	//GET CALENDAR EVENTS
	 $.ajax({
            //url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
			url: rooturl+link,
            type: "GET"})
        .done(function(data) {
			//console.log("list result: "+JSON.stringify(data));
			if (data.rows)
			{	
			var rows=data.rows;
			
			colog("Found "+rows.length+" calendar events");
			//var events=[];
			var idx=-1;
			
			for (var i=0; i<rows.length; i++)
			{
			 var doc=rows[i].doc;	
			 idx++;
			 var sdate=moment(doc.start,"YYYYMMDDHHmm");
			 var edate=moment(doc.end,"YYYYMMDDHHmm");
			 var beg=new Date();
			 
			 colog(sdate+"-"+edate)
			 var allday=false;
			 var evtype="meeting";
			 var color=meetingcolor;
			 
			 if (doc.eventtype) {
				evtype=doc.eventtype;
			 }
			 
			 if (evtype=="event") color=eventcolor;
			 
			 if (doc.allday) {
				if (doc.allday=="true") allday=true; 
				 
			 }
			 
			 
			 var event={
				 "id": doc._id,
				 "rev": doc._rev,
				 "title": doc.summary,
				 "summary": doc.summary,
				 "begin": sdate.toDate(),
				 "start": sdate.toDate(),
				 "end": edate.toDate(),
				 "allDay": allday,
				 "eventtype": evtype,
				 "color": color,
				 "customer": doc.customer,
				 "url": doc.url,
				 "regurl": doc.regurl,
				 "location": doc.location,
				 "description": getSafe(doc.description),
				 "sharewith":getSafe(doc.sharewith)
			 };
			 
			 eventsArray.push(event);
			
			}	
			
			//alert(JSON.stringify(events));
			
			sortEvents();
			
			renderCalendar();
			setCalendarView("list");
			if (callback) callback();
			}

		})
        .fail(function() {
			toast("Error getting events list","long");
			//dlg.dialog('close');
		});	
	
	//alert(date);
    

	
	

}

function sortEvents() {
	
	eventsArray.sort(function(a,b){
		var a1=a.start;
		var b1=b.start;
		
		if (a1>b1) return 1;
		if (a1<b1) return -1;
		
		
		return 0;
	})
	
	
}

function delEvent(doc)
{
	 deletingEvent=true;
     colog("deleteEvent "+doc.id+" rev "+doc.rev)	
 

 
 progressStart("Deleting event...");
 $.ajax({
			url: rooturl+"/events/deletecalendarevent",
            type: "POST",
            data: doc})
        .done(function(dat) {
			// navigator.notification.alert(data, function() {}, "Avviso");
			//alert("done: "+data);
			
				
			 deletingEvent=false;
			 return;
			colog("event "+doc.id+" removed ");
			colog(JSON.stringify(data));
		    progressStop();
			initPageCalendar();
			

		})
        .fail(function() {
			toast("Error deleting","long");
			
		});	
	
}


function setCalendarView(view)
{
 colog("setcalendarview "+view)	
 
 aspectRatio=0.6;
 if (view=="month") aspectRatio=1.2;
  $("#calwrap").show();	 
  $("#eventlist").hide();	
 if (view=="list")
 {
  $("#calwrap").hide();	 
  $("#eventlist").show();
  refetchCal();  
  return;	 
 }
 $('#calendar').fullCalendar('render');
 currentview=view;
 $("#calendar").fullCalendar('changeView', view )	;
 $("#calendar").fullCalendar('option', 'aspectRatio', aspectRatio )	;
 $("#calPanel").panel("close");
 rebindCal();
}


function viewEvent(obj){
	var id=$(obj).attr("id").split("_")[0];
	//alert(id);
	
	 var html = new EJS({url: tplurl+'tpl/eventview.ejs'}).render(getEventById(id)); 
	 
     $("#eventview #content").empty().append(html);
	 $.mobile.changePage("#eventview",{
		 srole: "dialog"
	 })
	
	
	
}

function uploadDocument()
{
	var catdocs=doc_categories.split(",");
	var catdat=[];
	
	$(catdocs).each(function(i){
		var cat={ doc: {}}
		cat.doc.id=catdocs[i];
		cat.doc.value1=catdocs[i];
		cat.doc.value2="";
		catdat.push(cat);
		
	})
	 var htm= new EJS({url: tplurl+'tpl/categories.ejs'}).render(catdat); 
	 //alert(htm);
	 $("#page_upload #doctags").empty().append(htm);
	
	$.get(rooturl+"/events/listusers",function(data){
		//alert(data.rows.length);
		//var htm="";
		var idlist="";
		$(data.rows).sort(function(a,b){
			var a1=a.doc.lastname;
			var b1=b.doc.lastname;
			if (a1<b1) return 1;
			if (a1>b1) return -1;
			return 0;
		})
		
		$(data.rows).each(function(i){
			var user=data.rows[i].doc;
			var id=user.id;
			var firstname=user.firstname;
			var lastname=user.lastname;
			data.rows[i].value1=lastname+" "+firstname;
			data.rows[i].value2=user.role;
			data.rows[i].value3=user.company;
			data.rows[i].value4=user.email;
			//alert(data.rows[i].value4);
			//htm+="<option value='"+id+"'>"+lastname+" "+firstname+"</option>"
			//htm+="<li>"+lastname+" "+firstname+"</li>"
			if (idlist.trim()!="") idlist+=",";
			idlist+=id;
			
		})
		
		//createMultipleCheckboxes("#pageupload #users",data.rows);
		 var htm= new EJS({url: tplurl+'tpl/shareusers2.ejs'}).render(data.rows); 
		$("#page_upload #users").empty().append(htm);
		
		
		//htm= new EJS({url: tplurl+'tpl/shareusers.ejs'}).render(data.rows); 
		//$("#page_upload #users").empty().append(htm);
		
		$("#page_upload #sharewithusers").val(idlist);
	})
	  $("#page_upload #titolo").val("");
	  
	  	  $("#page_upload #createddate").val(moment().format("YYYYMMDDHHmm"));
	  
	  var arr=doc_categories.split(",");
	  var opt="";
	  $(arr).each(function(i) {
		  opt+="<option value='"+arr[i]+"'>"+arr[i]+"</option>";
		  
		  
	  });
	  $("#page_upload #doccategory").html(opt);
	  
  $("#page_upload #fileattach").val("");  
  $.mobile.changePage("#page_upload",{
		 srole: "dialog"
	 })	

	
}

function goUploadDoc() {
$("#preview").html('');
//$("#preview").html('<img src="loader.gif" alt="Uploading...."/>');


var users="";
$("div#users input:checkbox").each(function() {
	
	var ck=$(this);
	var id=ck.attr("id");
	var checked=ck.attr("checked");
	if (checked=="checked")
	{
	 if (users.trim()!="") users+=",";	
	 users+=id;
	}
	
})
//alert("users:"+users);

var tags="";
$("div#doctags input:checkbox").each(function() {
	
	var ck=$(this);
	var id=ck.attr("id");
	var checked=ck.attr("checked");
	if (checked=="checked")
	{
	 if (tags.trim()!="") tags+=",";	
	 tags+=id;
	}
	
})
colog("tags: "+tags);

$("#page_upload #sharewithusers").val(users);
$("#page_upload #tags").val(tags);

var doit=true;
if ($("#page_upload #titolo").val().trim()=="") {
	
	alert("Please insert title for this document");
	doit=false;
}

if (!doit) return; 
progressStart("Uploading document");

$("#imageform").attr("action",rooturl+"/upload");
$("#imageform").ajaxForm(
{
target: '#preview',
success: function() { 
         progressStop();
	     toast("Uploaded");
	     gotoElib();
}
}).submit();
	
}



function getProp(doc,prop)
{
 if (doc.prop)
 {
  return doc.prop; 	 
 } else return "";
	
}


function viewDocument(obj){
	if (stoppropagate){
		
		stoppropagate=false;
		return;
	}
	var id=$(obj).attr("id").split("_")[0];
	
	  $("#page_viewdocument #viewdoc #urlframe").attr("src","").hide();
	  $("#pdfembed").attr("src","").hide();
	//alert(id);
	
	 //var html = new EJS({url: 'tpl/documentview.ejs'}).render(getDocumentById(id)); 
	 
	 var doc=getDocById(id);
	 colog("doc: "+JSON.stringify(doc));
	 //alert(doc.path);
	 var path="";
	 var url="";
	 var filename="";
	 var createdby="";
	 if (doc.url) url=doc.url;
	 if (doc.filename) filename=doc.filename;
	 $("#page_viewdocument #viewdoc #imgdoc").empty().hide();
	 $("#page_viewdocument #viewdoc #filelink").hide();
	 if (doc.createdby) createdby=doc.createdby;
	 if (doc.path) {
		if (doc.path.trim()!="")
		{			
		path=doc.path.replace("public","").substring(1); 
		path = path.replace(/\\/g,"/");
		
		 var showImage=false;
	  if (path.toLowerCase().indexOf("jpg")>-1) showImage=true;
	  if (path.toLowerCase().indexOf("png")>-1) showImage=true;
	  if (path.toLowerCase().indexOf("pdf")>-1) {
		  
		   downloadElibDoc(rooturl+"/"+path);
		   return;
		  //$("#pdfembed").attr("src",rooturl+"/"+path).show();
		  var url="http://docs.google.com/viewer?url="+encodeURIComponent(rooturl+"/"+path)+"&embedded=true";
		  //alert(url);
		   $("#page_viewdocument #viewdoc #urlframe").attr("src",url);
		    $("#page_viewdocument #viewdoc #urlframe").attr("width","800");
			$("#page_viewdocument #viewdoc #urlframe").attr("height","600");
		  $("#page_viewdocument #viewdoc #urlframe").css("border","1px solid black").show();
		  
	  } else $("#pdfembed").attr("src","").hide();
	 // alert(showImage)
	  if (showImage)
	  {
        $("#page_viewdocument #viewdoc #imgdoc").attr("src",rooturl+"/"+path).css("width","320px").css("height","340px");
		$("#page_viewdocument #viewdoc #imgdoc").css("border","1px solid black").show();
	  } else $("#page_viewdocument #viewdoc #imgdoc").empty().hide();
	  
	   $("#page_viewdocument #viewdoc #filelink").show();
	   $("#page_viewdocument #viewdoc #filelink").off("tap");
	   $("#page_viewdocument #viewdoc #filelink").on("tap",function() {
		    
		 //alert(rooturl+"/"+path);	
		 
		 //if (isPhone) downloadElibDoc(rooturl+"/"+path);
		 downloadElibDoc(rooturl+"/"+path);
		 
	 })
		}
	 } 
	
	 //path=doc.path.replace("public/","");
	  //alert(path);
	  $("#page_viewdocument #viewdoc #title").html(doc.titolo);
	  $("#page_viewdocument #viewdoc #category").html(doc.category);
	  $("#page_viewdocument #viewdoc #createddate").html(doc.createddate);
	  $("#page_viewdocument #viewdoc #filename").html(filename);
	  $("#page_viewdocument #viewdoc #url").html(url);
	   $("#page_viewdocument #viewdoc #path").html(path);
	     $("#page_viewdocument #viewdoc #createdby").html(createdby);
	  
	  
	  if (doc.url)
	  {	  
	  if (doc.url.toLowerCase().indexOf("youtube")>-1) { //url is a youtube video
		  
		var obj='<object id="obj" gstyle="width:100%;height:100%;width: 820px; height: 461.25px; float: none; clear: both; margin: 2px auto;" data="http://www.youtube.com/v/GlIzuTQGgzs"></object>';
		  
		  var ytcode=doc.url.split("watch?v=")[1];
		  var yturl="http://www.youtube.com/embed/"+ytcode+"?feature=player_embedded";
		  $("#page_viewdocument #viewdoc #urlframe").attr("src",yturl);
		  $("#page_viewdocument #viewdoc #urlframe").css("border","1px solid black").show();
		  //$("#viewdoc").append(obj);
	  }
	  } else  $("#page_viewdocument #viewdoc #urlframe").show();
	  
	
	  

	 
	 $.mobile.changePage("#page_viewdocument",{
		 srole: "dialog"
	 })
	
	
	
}

function downloadElibDoc(p)
{
 	
 //alert(p);
 colog("downloadElibDoc "+p)
 var store = cordova.file.dataDirectory;
 
 
var localfile=store+"temp.pdf"; 
//var localpath=fileSystem.root.toURL() +"download/temp.pdf";
localfile="/sdcard/Download/temp.pdf";
colog("localfile:"+localfile);
var fileTransfer = new FileTransfer();
var uri = encodeURI(p);

fileTransfer.download(
    uri,
    localfile,
    function(entry) {
        console.log("download complete: " + entry.fullPath);
		colog("download completed into "+entry.fullPath);
		//window.plugins.fileOpener.open(localfile);
		var uurl=entry.toURL();
		//alert(uurl);
	/* var ref = cordova.InAppBrowser.open(uurl,  '_blank', 'location=yes');*/
	//window.open(entry.toURL(), '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');   IOS ONLY
	
	//return;
	
	cordova.plugins.fileOpener2.open(localfile,
       'application/pdf', 
    { 
        error : function(e) { 
           alert('Error status: ' + e.status + ' - Error message: ' + e.message);
        },
        success : function () {
           colog('file opened successfully');                
        }
    }
);
    },
    function(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("upload error code" + error.code);
		alert("download error: "+error.code);
    }
); 
	
}


function renderCalendar()
{
 colog("renderCalendar "+eventsArray.length+" - "+calcreated);

 
 if (1==1)
 {
	 //alert(currentdate)
	 $("#page_calendar #calendar").fullCalendar("destroy");
	  $("#page_calendar #calendar").empty();
     $('#page_calendar #calendar').fullCalendar({
			header: {
				left: 'prev',
				center: 'title',
				right: 'next'
				//sright: 'month,agendaWeek,agendaDay'
			},
			defaultDate: currentdate,
			defaultView: currentview,
			editable: false,
			events: eventsArray,
		    eventRender: function(event, element) {
				$(element).css("border","2px solid black");
				$(element).addClass("evento");
				$(element).append("<input type=hidden class=evid value='"+event.id+"' />");
				$(element).append("<input type=hidden class=evrev value='"+event.rev+"' />");
			}, 
			gotoDate: currentdate,
			handleWindowResize: false,
			aspectRatio: aspectRatio,
			windowResize: function(view) {
                 colog('The calendar has adjusted to a window resize');
				 $('#page_calendar #calendar').fullCalendar('option', 'aspectRatio',0.6);
            },
			loading: function (bool) {
               if (bool) {
                   $("#page_calendar #calendar").css({"visibility": "hidden"});
                   //alert('Rendering with events');
               } else {
                   $("#page_calendar #calendar").css({"visibility": "visible"});
				   colog("calendar loaded");
				   alert("calendar loaded")
				    setCalendarView(calendarview);
                   //alert('Rendered and ready to go');
               }
           },
			theme: false,
			firstDay: 1,
			axisFormat: 'HH:mm', 
			scrollTime: "08:00:00",
			weekends: false,
			dayClick: function(dayDate, allDay, ev, view) {
				//alert(dayDate);
				
				var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					if (role.trim().toLowerCase()=="customer") return;
					
				}
				
				
				colog("dayclick");
				currentdate=dayDate;
				var data=moment(dayDate).format('DD/MM/YYYY');
				//var data=dayDate.format("L"); 
				//alert("day click "+data);
				colog('dayClick - ' + dayDate + ', allDay:' + allDay + ' - ' + view.title);
		        $("#eventDialog").find("h3").html("Add event");
	            $("#eventDialog").find("#currdate").val(data);
				$("#eventDialog").find("#txtTitle").val("");
				$("#eventDialog").find("#txtDescr").val("");
				$("#eventDialog").find("#allday").attr("checked",false);
				$("#eventDialog").find("#savemode").val("add");
				$("#eventDialog").find("#savebutton").html("Add event");
				$("#eventDialog").find("#saveid").val("");
				$("#eventDialog").find("#saverev").val("");
				
				populatecustomers();
				
				
				
		    	/*var sdata=dayDate.format("dd/mm/yyyy");
				var edata=dayDate.format("dd/mm/yyyy");*/
				
				
				var sdata=moment(dayDate).format("DD/MM/YYYY HH:MM");
				var edata=sdata;

				
				
				//alerta(sdata); 
				$("#eventDialog  #startdate").val(sdata.split(" ")[0]);
				$("#eventDialog  #starttime").val(sdata.split(" ")[1]);
				$("#eventDialog  #enddate").val(edata.split(" ")[0]);
				$("#eventDialog  #endtime").val(edata.split(" ")[1]);
				
				
				
				
				
				/*$("#eventDialog  #startdate").val(sdata);
				$("#eventDialog  #enddate").val(sdata);*/
				//alert(sdata);
				 $.mobile.changePage("#eventDialog");
				return;

            }
	
	  });
	  //$("#page_calendar #calendar").fullCalendar("gotoDate",currentdate);
	//$("#calendar").draggable();
	 
	 calcreated=true;
	// alert("èpostion")
	 rebindCal();
	
	// $(".fc-header-left").html("<div class='demy-button-prev'></div>");
 }
 else
  {
	 $("#page_calendar #calendar").fullCalendar("refetchEvents");
	 refetchCal();
	 rebindCal();
	 
 }
}

function populatecustomers()
{
 $("#eventDialog").find("#customers").empty()
				
				
				var custlist="";
				console.log(JSON.stringify(users))
				for (var i=0; i<users.length; i++)
				{
				 if (users[i].customers)
				 {	 
				 var cust=users[i].customers;
				 
				 var arr=cust.split(",");
				 
				 for (var j=0; j<arr.length; j++)
				 {
				  var c=$.trim(arr[j]);
                  if (custlist.indexOf(c)==-1)
				  {
				   if ($.trim(custlist)!="") custlist+=",";
                   custlist+=c; 				   
				  }					  
				  
					 
				 }
				 
                			 
				 
				 }	
				}
				
				var arr=custlist.split(",");
				for (var i=0; i<arr.length; i++ )
				{
				 var cst=arr[i];	
				 $("#eventDialog").find("#customers").append("<option value='"+cst+"'>"+cst+"</option>");		
					
				}	
	
}

function editEvent(id)
{
 //alert(id); 
 var ev=getEventById(id);
 $("#eventDialog").find("h3").html("Update event");
	            $("#eventDialog").find("#currdate").val(ev.start);
				$("#eventDialog").find("#txtTitle").val(ev.title);
				$("#eventDialog").find("#txtDescr").val(ev.descr);
				$("#eventDialog").find("#savemode").val("edit");
				$("#eventDialog").find("#saveid").val(ev.id);
				$("#eventDialog").find("#saverev").val(ev.rev);
				if (ev.allDay) {
					 $("#eventDialog").find("#allday").attr("checked",true);
				} else  $("#eventDialog").find("#allday").attr("checked",false);
				$("#eventDialog").find("#savebutton").html("Save event");
				var defaultValue = ev.start;
				
				var sdata=moment(ev.start).format("DD/MM/YYYY HH:mm");
				
				var edata=sdata;
				if (ev.end) edata=moment(ev.end).format("DD/MM/YYYY HH:mm");
				
				
				//alerta("event click "+sdata+" "+edata); 
				$("#eventDialog  #startdate").val(sdata.split(" ")[0]);
				$("#eventDialog  #starttime").val(sdata.split(" ")[1]);
				$("#eventDialog  #enddate").val(edata.split(" ")[0]);
				$("#eventDialog  #endtime").val(edata.split(" ")[1]);
				populatecustomers();
				//alert(ev.customer);
				$("#eventDialog #customers").val(ev.customer);

	            $.mobile.changePage("#eventDialog"); 
	
}

function rebindCal()
{
 $(".fc-event").unbind("taphold");
 $(".fc-event").unbind("vclick");
 $(".fc-event").bind("taphold",function() {
	 
	     var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					if (role.trim().toLowerCase()=="customer") return;
					
				}   

		 colog("taphold event");
		 var questo=$(this);
		 if (!$(this).hasClass("fc-event")) questo=$(this).parent();
		 var id=questo.find("input.evid").val();
		 var rev=questo.find("input.evrev").val()
		 deleteEvent({id: id, rev: rev, title: ""});
		
	 });
	 $(".fc-event").bind("vclick",function() {
		 
		 
		 console.log("tap event");
		 var questo=$(this);
		 if (!$(this).hasClass("fc-event")) questo=$(this).parent();
		 var id=questo.find("input.evid").val();
		 var rev=questo.find("input.evrev").val()
		 //find event
		 
		 var evento=getEventById(id);
		 var html = new EJS({url: tplurl+'tpl/eventpop.ejs'}).render(evento); 
		 $("#page_calendar #eventPopup #popcontent").empty().html(html).find("tr td:eq(1)").each(function() {
			 $(this).css("font-weight","bold");
			 
		 });
		 $("#page_calendar #eventPopup").popup("open",{
			 positionTo: "window",
			 overlayTheme: "a"
		 });
		 return;
		 
		/* for (var i=0; i<eventsArray.length; i++)
		 {
		  var ev=eventsArray[i];
          if (ev.id==id) {
			  //found
			    $("#eventDialog").find("h3").html("Update event");
	            $("#eventDialog").find("#currdate").val(ev.start);
				$("#eventDialog").find("#txtTitle").val(ev.title);
				$("#eventDialog").find("#txtDescr").val(ev.descr);
				$("#eventDialog").find("#savemode").val("edit");
				$("#eventDialog").find("#saveid").val(id);
				$("#eventDialog").find("#saverev").val(rev);
				if (ev.allDay) {
					 $("#eventDialog").find("#allday").attr("checked",true);
				} else  $("#eventDialog").find("#allday").attr("checked",false);
				$("#eventDialog").find("#savebutton").html("Save event");
				var defaultValue = ev.start;
				
				var sdata=moment(ev.start).format("DD/MM/YYYY HH:mm");
				
				var edata=sdata;
				if (ev.end) edata=moment(ev.end).format("DD/MM/YYYY HH:mm");
				
				
				alerta("event click "+sdata+" "+edata); 
				$("#eventDialog  #startdate").val(sdata.split(" ")[0]);
				$("#eventDialog  #starttime").val(sdata.split(" ")[1]);
				$("#eventDialog  #enddate").val(edata.split(" ")[0]);
				$("#eventDialog  #endtime").val(edata.split(" ")[1]);
				populatecustomers();
				//alert(ev.customer);
				$("#eventDialog #customers").val(ev.customer);

	            $.mobile.changePage("#eventDialog");
			  
			  
		  }		  
			 
		 }
		*/
	 })	
}

function getEventById(id)
{
 var retvalue=null;	
 for (var i=0; i<eventsArray.length; i++)
 {
		  var ev=eventsArray[i];
          if (ev.id==id) {	
	         retvalue=ev;
			}
 }			
  return retvalue;
 }  

function getDocById(id)
{
 var retvalue=null;	
 //alert(docsArray.length);
 for (var i=0; i<docsArray.length; i++)
 {
		  var ev=docsArray[i];
		  colog("doc id: "+ev.id+" ")
          if (ev._id==id) {	
	         retvalue=ev;
			}
 }			
  return retvalue;
 }  
 
function deleteEvent(event)
{
 var evtitle=event.title;
 var id=event.id;
 colog("evtitle: "+evtitle); 
 gConfirm("Do you really want to delete the event "+evtitle,"Event delete",
					function() {
						colog("ok delete");
						progressStart("Deleting event");
						 $.ajax({
							url: rooturl+"/events/deletecalendarevent",
							type: "POST",
							data: event})
							.done(function(data) {
								progressStop();
								
								for(var i = eventsArray.length-1; i--;){
									var el=eventsArray[i];
									if (el.id === id){
										toast("event deleted");
										eventsArray.splice(i, 1);
									} 
								}
								sortEvents();
								$("#calendar").fullCalendar('refetchEvents');
								
								refetchCal();
								rebindCal();
								//updatecal=true;
								
								/*
								$("#calendar").fullCalendar( 'removeEvents');
                                $("#calendar").fullCalendar( 'addEventSource', eventsArray );
								*/
								 //initPageCalendar();
								//$.mobile.changePage("#page_calendar");
							});
						
					},
					function() {
						progressStop();
						colog("no delete");
						
					})	
}

function getDayEvents(date){
	    var data=date.format("YYYYMMDD"); 
	    colog(date.format().substring(0,10))
	    var ev=$('#calendar').fullCalendar('clientEvents');
		//alert(ev.length);
		var htm="";
        ev.forEach(function(entry) {
			//console.log(entry.start.format()+"-"+entry.title)
			var start=entry.start.format("YYYYMMDD");
			var startt=entry.start.format("DD/MM/YYYY hh:mm");
            if (start == data){
                colog(data+" - "+entry['title']);
				htm+='<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="#">'+startt+" - "+entry.title+'</a></li>';
			}
            else if (entry['start'] <= date.format() && entry['end'] >= date.format()){
                alert(entry['title']);}
         });
		 $("#uldayevents").empty().append(htm);

    }


function toZDate(txt)
{
 var arr=txt.split("/");
 return arr[2]+"-"+arr[1]+"-"+arr[0]; 
	
}		
function toZTime(txt)
{
 var isPM=false;	
  if (txt.indexOf("PM")>-1) isPM=true;
 txt=txt.replace("AM","");	
 txt=txt.replace("PM","");
 txt=$.trim(txt);
 var arr=txt.split(":");
 if (isPM)
 {
  colog("cest PM");	 
  arr[0]=parseInt(arr[0],10)+12;	 
  if (arr[0]>23) arr[0]="0"+(arr[0]-23);
  	colog(arr[0]) 
	
 }
 
 return arr[0]+":"+arr[1]+":00"; 
	
}		
function saveEvent()
{
   var dlg=$("#eventDialog");
   var savemode=$("#eventDialog").find("#savemode").val();
   var id=$("#eventDialog").find("#saveid").val();
   var rev=$("#eventDialog").find("#saverev").val();
   var evtype=$("[name=radiogroup]:checked").val();
   var customer=$("#eventDialog #customers").val();
   var url=$("#eventDialog #eventurl").val();
   var regurl=$("#eventDialog #eventregurl").val();
   var location=$("#eventDialog #location").val();
   var descr=$("#eventDialog #txtDescr").val();
   //alert($('#startdate').data('datebox').theDate);
   
  // alert($("#startdate").val()+"  "+$("#startdate").val());
   
   //var sdate=toZDate($("#startdate").val())+"T"+toZTime($("#starttime").val());
   //var edate=toZDate($("#enddate").val())+"T"+toZTime($("#endtime").val());
   
   
   
   var sdate=moment($("#startdate").val()+" "+$("#starttime").val(),"DD/MM/YYYY HH:mm")
   var edate=moment($("#enddate").val()+" "+$("#endtime").val(),"DD/MM/YYYY HH:mm")
   //alert(sdate);
   //return;   
   //var tdate=dlg.find("#currdate").val().replace("\"", "").replace("\"", "");    
	
  //  alert(sdate+"    "+edate) 	
	
   
   
   //sdate=new Date(sdate); 
   //edate=new Date(edate); 
   
    //  alert(sdate	  +"\n"+edata)
   
   //var sdata=moment(sdate).format("dddd, MMMM Do YYYY, HH:mm");
   //var edata=moment(edate).format("dddd, MMMM Do YYYY, HH:mm");
   //alert(sdata)
   //var edata=edate.format();
   
   var sdata=sdate.format("YYYYMMDDHHmm");
   var edata=edate.format("YYYYMMDDHHmm");
   //alert(sdata+" "+edata)
   
   //var ddate=new Date(dlg.find("#currdate").val());
   
  // alert(sdate+"  "+edate+"  "+ddate)
   var title=dlg.find("#txtTitle").val()
   
   var allday=false;
   if ($("#allday:checked").length>0)
   {
	// alert("allday");
     allday=true;	 
	   
   }
   
  // alert(sdata+"    "+edata)
   
   if ($.trim(title)==""){
	   
	   alerta("Please input title for event");
	   return;
	   
   }
   
    var color=meetingcolor;
			 
	 if (evtype=="event") color=eventcolor;
   
  var ev= {
            "summary": title,
            "begin": sdata,
			"start": sdata,
            "end": edata,
			"allDay": allday,
			"eventtype": evtype,
			"title": title,
			"color": color,
			"customer": customer,
			"url": url,
			"regurl": regurl,
			"description": descr,
			"location": location
            
        }	
	
	//alert("saving event "+JSON.stringify(ev));
	
    var saveurl="/events/savecalendarevent";
	
	if (savemode=="edit") {
	  saveurl="/events/updcalendarevent";
      ev.id=id;
      ev.rev=rev;	  
		
	}
	
	progressStart("Adding event");
	//alert(eventsArray.length)
 $.ajax({
            //url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
			url: rooturl+saveurl,
            type: "POST",
            data: ev})
        .done(function(data) {
			ev.id=data.id;
			ev.rev=data.rev;
			colog("save result: "+JSON.stringify(data));
			if (savemode=="edit")
			{
			 for (var i=0; i<eventsArray.length; i++){
				 var e=eventsArray[i];
				 if (e.id==ev.id) {
					 var ev2=ev;
					 ev2.start=moment(sdata,"YYYYMMDDHHmm").toDate();
					 ev2.end=moment(edata,"YYYYMMDDHHmm").toDate();
					 eventsArray[i]=ev2;
				 }
				 
			 }	
			} else {
				var ev2=ev;
					 ev2.start=moment(sdata,"YYYYMMDDHHmm").toDate();
					 ev2.end=moment(edata,"YYYYMMDDHHmm").toDate();
				eventsArray.push(ev2); 
			}	
			colog("events: "+eventsArray.length);
			sortEvents();
			//$('#calendar').fullCalendar('removeEvents');

            //$('#calendar').fullCalendar('events', eventsArray );	
			//$('#calendar').fullCalendar( 'refetchEvents' );
			//$('#calendar').fullCalendar('addEventSource',eventsArray);
			//$('#calendar').fullCalendar( 'refetchEvents' );
			//$('#calendar').fullCalendar( 'rerenderEvents' )
			//$('#calendar').fullCalendar( 'refresh' )
 		    //dlg.dialog('close');
			progressStop();
			updatecal=true;
			$.mobile.changePage("#page_calendar");
			//$("#calendar").fullCalendar( 'renderEvent', ev ,true  );
			//$("#page_calendar #calendar").css("border","4px solid yellow");
			
			//$("#page_calendar #calendar").fullCalendar( 'removeEvents');
			//$("#calendar").fullCalendar("addEventSource",eventsArray);
			/*
            $("#page_calendar #calendar").fullCalendar( 'addEventSource', eventsArray );
			$('#page_calendar #calendar').fullCalendar( 'refresh' )
			*/
			//alert("fatto");

		})
        .fail(function() {
			toast("Error posting","long");
			//dlg.dialog('close');
		});	
	
	
}
		
		
function setCalendar(tipo,callback)
{
calendarType=tipo;	
initPageCalendar(function() {
	if (callback) callback();
	
});
$("#page_calendar #menuPanel").panel("close");
$("#page_calendar #calPanel").panel("close");
	
}		
		
var app = {
    initialize: function() {
			colog("app.initialize")
        this.bind();
    },
	
	onCameraSuccess: function(mediaFiles) {
  
       toast("Photo acquired",'long'); 
	
	   var i, path, len;
       for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
        // do something interesting with the file
		 $("#fotoAnteprima").attr("src", path).css({width: "128px", height: "128px"});
       }
	
   
  
    },
	
	onCameraError: function(errorMessage) {
  
     //navigator.notification.alert(errorMessage, function() {}, "Errore");
	 toast("Error acquiring photo: "+errorMessage,'long'); 
  
   },
	
	onMenuButton: function() {
		//navigator.notification.alert("MenuButton pressed!",function() {}, "Informazione");
		/*
		var pageid=$.mobile.activePage.attr('id');
		$("#"+pageid+" #btnBack").trigger("click");
		*/
		
		
		/*
		var pageid=$.mobile.activePage.attr('id');
		var l=$("#"+pageid+" #menuPanel").length;
		if (l==0){
			var htm='<div id="menuPanel" data-role="panel" data-theme="b">'+$("#homePage #menuPanel").html()+'</div>';
			//toast(htm,'long');
			$("#"+pageid+" [data-role=header]").before(htm);
			$("#"+pageid+" #menuPanel").panel();
			$("#"+pageid+" #menuExit").on("tap", function(event) {
		       app.exit();
			});
	 
		}
		var pageid=$.mobile.activePage.attr('id');
		$( "#"+pageid+" #menuPanel" ).panel("toggle");
		*/
		
		var pageid=$.mobile.activePage.attr('id');
		$( "#"+pageid+" #menuPanel" ).panel("toggle");
	},
	
	onBackButton: function() {
		//navigator.notification.alert("MenuButton pressed!",function() {}, "Informazione");
		var pageid=$.mobile.activePage.attr('id');
		var btn=$("#"+pageid+" #btnBack");
		if (btn.length>0){
		  $("#"+pageid+" #btnBack").trigger("click");	
			
		} else $.mobile.back();
		
		
	},
	
	online: function() {
         
        $("#btnInviaSchede").removeClass("ui-disabled");
    },
     
    offline: function() {
         
        $("#btnInviaSchede").addClass("ui-disabled");
    },
     
	isOnline: function() {
         
        var networkState = navigator.connection.type;
		toast(networkState,'short')
         
        return ((networkState != Connection.NONE) && (networkState != Connection.UNKNOWN));
    }, 
	 
    bind: function() {
		//alert("bind")
	    document.addEventListener('deviceready', onDeviceReady, false);
		colog("added deviceready event listening");
	     
		 
		 
    },
     
    deviceready: function() {
			colog("deviceready")
		document.addEventListener("online", app.online, false);
        document.addEventListener("offline", app.offline, false);
	    document.addEventListener("menubutton", app.onMenuButton, false);
		document.addEventListener("backbutton", app.onBackButton, false);
	
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
		
		if (navigator.userAgent.indexOf("Android") != -1) {
             $.mobile.defaultPageTransition = 'none';
             $.mobile.defaultDialogTransition = 'none';
             $.mobile.buttonMarkup.hoverDelay = 0
         }
		 

		
		docready();
		 

	 
	
        
        app.start();
    },
 
    start: function() {
     
        //...
    },
	
	exit: function() {
 
        navigator.notification.confirm(
          "Vuoi uscire dall'applicazione?",
            function(buttonIndex) {
                 
                if (buttonIndex == 1) navigator.app.exitApp();
            },
            "Informazione",
            "Sì,No");
    },
	
	storage:window.localStorage,
     

	loadAllSchede: function(callback){
		 $.ajax({
            url: rooturl+"/schede",
            type: "GET"})
         .done(function(data) {
			 //alert(JSON.stringify(data));
			 callback(data);
		 });
			// navigator.notification
		
	},
};

function exitapp()
{
	app.exit();
	
}

function init(){
	colog("init")
	app.initialize();
	debugga(navigator.userAgent);
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
     isPhone=true;
} else {
    isPhone=false;
}

// isCordovaApp = !!window.cordova;
 
//isCordovaApp = (document.URL.indexOf('http://') === -1)   && (document.URL.indexOf('https://') === -1);
 
 console.log("Running on Cordova: "+isCordovaApp);
 
  //isPhone=isCordovaApp; 
  //isPhone=true;
  toast("isPhone:"+isPhone);
   
	
   if (!isPhone) {
	 
     colog("not running on smartphone, launching docready") 
	 
	 
	 
	 
     docready();	 
	   
   } else  colog("running on smartphone") 
   
   

	
	
// do stuff 
  
	
	
}
 
/*
 
$(document).ready(function() {

    app.initialize();
	debugga(navigator.userAgent);
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
     isPhone=true;
} else {
    isPhone=false;
}
   
	
   if (!isPhone) {
	 
     console.log("not running on smartphone, launching docready") 
     docready();	 
	   
   }
	
});
*/

 $(document).one('pagebeforecreate', function(event) {
	 colog("pageberforecreate ")
	var data={} ;
	
	/*
	var apage=event.target.id;
	var pl=$("#"+apage+" #menuPanel").length;
	//alert("active page: "+apage+" - panels: "+pl);
	if (pl==0)
	{	
     var panel= new EJS({url: tplurl+'tpl/menupanel.ejs'}).render(data); 
     $.mobile.pageContainer.prepend(panel);
    }	 
    $("#menuPanel").panel();
	*/
 });
 
 function onDeviceReady(){
	 
	 		colog("deviceready")
			
			
			
		document.addEventListener("online", app.online, false);
        document.addEventListener("offline", app.offline, false);
	    document.addEventListener("menubutton", app.onMenuButton, false);
		document.addEventListener("backbutton", app.onBackButton, false);
	
	   // window.open = cordova.InAppBrowser.open;
	
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
		
		if (navigator.userAgent.indexOf("Android") != -1) {
             $.mobile.defaultPageTransition = 'none';
             $.mobile.defaultDialogTransition = 'none';
             $.mobile.buttonMarkup.hoverDelay = 0
         }
		 
		 
		 /*
		  pushNotification = window.plugins.pushNotification;
		 
		 //PUSH NOTIFICATIONS PLUGIN
		 if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
    pushNotification.register(
    pushSuccessHandler,
    pushErrorHandler,
    {
        "senderID":"403763864066",
        "ecb":"onPushNotification"
    });
} else if ( device.platform == 'blackberry10'){
    pushNotification.register(
    successHandler,
    errorHandler,
    {
        invokeTargetId : "replace_with_invoke_target_id",
        appId: "replace_with_app_id",
        ppgUrl:"replace_with_ppg_url", //remove for BES pushes
        ecb: "pushNotificationHandler",
        simChangeCallback: replace_with_simChange_callback,
        pushTransportReadyCallback: replace_with_pushTransportReady_callback,
        launchApplicationOnPush: true
    });
} else {
    pushNotification.register(
    tokenHandler,
    errorHandler,
    {
        "badge":"true",
        "sound":"true",
        "alert":"true",
        "ecb":"onNotificationAPN"
    });
}
		 

		*/
		docready();
		 

	 
	
        
        app.start();
	 
	 
 }
 
 
function gotoTryAndBuy(){
	
	$("#trybuy").off("pageshow");
	$("#trybuy").on("pageshow",function() {
		 $("#trybuy #all").trigger("click");
		
	});
	$.mobile.changePage("#trybuy");
	
	
} 
 
function openContact(nome){
	
 console.log(nome);	
 $("#reachme #ContactPopup ").popup("open");
	
} 

 function ldLogonSuccess(accessToken)
    {
        alert(token);
    }

    function ldLogonFailure(){
        alert('Fail');
    }

function docready()
{
	
	 
	  colog("docready");
	  storage=window.localStorage;
	  
	  
	  
	  SocialGap.Linkedin_ChangeSettings('77m4gl9l7fgf9m', 'lhuq3lTGd7dOUWhZ', 'https://www.linkedin.com/uas/oauth2/authorization', 'ldScopes');
	  

	  
	 //$("#index").backstretch("img/background_IBM.jpg"); 
	  $("#page_calendar #eventPopup").popup();
	  $("#reachme #ContactPopup ").popup();
	  
	  $("#page_shareusers #ulshare").listview();
	   $("#page_calendar #ulevlist").listview();
	  //$("#page_calendar #page_shareusers").popup();
	  /*
	  $("#scheda h3").html(boname);
	  $("#homePage h3").html(bonames.toUpperCase());
	  $("#elencoSchede h3").html(bonames.toUpperCase());
	  $.event.special.tap.emitTapOnTaphold = false;
	     FastClick.attach(document.body);
	  */
	  //	$( "#menuPanel" ).panel();
	  
	   $.event.special.tap.emitTapOnTaphold = false;
	     FastClick.attach(document.body);
		 


     colog("fastclick attached");
	 
	 $("#trybuy div.linkfiltro a").each(function() {
		 var questo=$(this);
		 var hr=questo.attr("href");
		 
		 questo.on("tap",function() {
			 window.open(hr,"_system");
			 
		 })
		 
		 var hr2="javascript:window.open('"+hr+"','_system')";
		 
		 //questo.attr("href",hr2);
		 questo.attr("href","#");
		 
		 
	 })
	 
	 $('li').bind('mouseover', function(){
   return false;
    });
	 //$("[data-role=content]").css("height",0);
    $("[data-role=content]").css("min-height",window.innerHeight);
	 
	 var header = $('[data-role=header]').outerHeight();
     var panel = $('[data-role=panel]').height();
     var panelheight = panel - header;
    /*$('[data-role=panel]').css({
       'top': header,
       'min-height': panelheight
    });*/
	 

    initPageIndex();
    //initPageCalendar();
	 //setCalendar(1);
//	 $.event.special.tap.emitTapOnTaphold = false;
//	initPageIndex();
    $('.ui-btn input').bind('touchstart', function() {
      $(this).css('background-color', 'black');
    });

calendar=$("#calendar_page #calendar");

$('.ui-btn input').bind('touchend', function() {
    $(this).css('background-color', 'white');
});
	  


  $("#page_elibrary").on("pageinit",function() {
	  
	    var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					//alert(role);
					if (role.trim().toLowerCase()=="customer") { 
					
					$("#page_elibrary #btnAdddoc").hide();
					
					}
					
				}
	  
	   
	    $( "#page_elibrary #menuPanel" ).panel();
  });

	
  $("#page_calendar").on("pageinit",function() {
	  //alert("pagecalendar init")
	  colog("pagecalendar init")
	   $('.ui-btn input').bind('touchstart', function() {
    $(this).css('background-color', 'black');
});

$('.ui-btn input').bind('touchend', function() {
    $(this).css('background-color', 'white');
});
	  
	  $( "#page_calendar #menuPanel" ).panel();
	  $( "#page_calendar #calPanel" ).panel();
  })	
  	  
	  
	  //ex pagebeforeshow

				
	  
  $("#page_calendar").on("pageshow",function(event){
	   
	  // alert("pageshow calendar");
	  
	  if (updatecal)
	  {
	   $("#calendar").fullCalendar("refetchEvents");
	   refetchCal();
	   rebindCal();
		updatecal=false;	   
	  } else {
		  $('#page_calendar #calendar').fullCalendar('render');
		  rebindCal();
	  }
	  
	  
	  /*
	  $("#calendar").fullCalendar("removeEvents");
	  $("#calendar").fullCalendar("addEventSource",eventsArray);
	  */
  })	  
	  
  $("#index").on('pageshow',function(event){	  
  //$("#page_calendar").on('init',function(event){
//	 $.event.special.tap.emitTapOnTaphold = false;
//	initPageIndex();
    //alert("pageinit calendar");
    initPageCalendar();
	
// do stuff 
    })
	  
		
		/*
		
  window.plugins.webintent.startActivity({
      action: window.plugins.webintent.ACTION_VIEW,
      url: theFile.toURL(),
      type: 'application/vnd.android.package-archive'
    },
    function() { alert("sharing")},
    function() {
      alert('Failed to open URL via Android Intent.');
      console.log("Failed to open URL via Android Intent. URL: " + theFile.fullPath)
    }
);
		*/
		return;
		
}


function sviewEvent(){
	
}

function sviewDocument() {
	
	
}

function refetchCal()
{
 //$("#calendar").fullCalendar("refetchEvents");
 
 var arr=[];
 
 $(eventsArray).each(function(i){
	 
	 arr.push(eventsArray[i]);
	 
 })
 
 arr.sort(function(a,b){
	 var a1=moment(a.start).format("YYYYMMDDHHmmSS");
	 var b1=moment(b.start).format("YYYYMMDDHHmmSS");
	if (a1>b1) return -1;
	if (a1<b1) return 1;
	return 0; 
	 
 })
 
  $("#page_calendar #evcount").html(arr.length+" events found");
 var html = new EJS({url: tplurl+'tpl/eventlist.ejs'}).render(arr); 
 $("#page_calendar ul#ulevlist").empty().append(html);
 $("#page_calendar ul#ulevlist").listview({
	autodividers:true,
	autodividersSelector: function ( li ) {
		// "li" is the list item, you can get the text via li.text()
		// and then you return whatever you want - in text that is
		var now=moment().format("YYYYMMDDHHmmSS");
		//console.log("now "+now);
		//console.log(li.find("a").find("table td span").length);
		var data=li.find("a table span.date").attr("id");
		if (!data) data="date_00000000000000";
		//console.log("data: "+data);
		//data=data.replace("date_","");
		
		var retval="Present events";
		now="date_"+now;
		console.log(data+" - "+now);
		if (data>now) retval="Future events";
		if (data<now) retval="Past events";
		
		//console.log("retval: "+retval)
		
		return retval;
	}
}).listview("refresh");
 	$("#page_calendar #ulevlist").find("li").off("taphold");
 	$("#page_calendar #ulevlist").find("li").on("taphold",function(event) {
		
		        
				return;
		        
			    var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					if (role.trim().toLowerCase()=="customer") return;
					
				}
				
				colog("taphold on calendar event list");
						
			    selectModeOn=true;			
				shareMenu=true;
				var li=$(this)
				
				//$("#page_calendar #ulevlist").find("li").off("tap");
				selectedObjects={db: "",rows: []};
				selectShare(li,"eventcalendar");
				
				
				return false;
		
				
		        var questo=$(this);
			    var id=$(this).find("a").attr("id").split("_")[0];
				var rev=$(this).find("a").attr("id").split("_")[1
				];
				var obj={ 
				 id: id,
				 rev: rev
				};
  			   gConfirm("Confirm delete of the event ?","Confirm delete",function() {
				  progressStart("Deleting document"); 
				  var aid=questo.find("a").attr("id");
				  var arr=aid.split("_");
				  var id=arr[0];
		         var rev=arr[1];
				// alert(id+" - "+rev)
		         deleteEvent({id: id, rev: rev, title: ""});
				},function() {
					  
					  
				 });  
			});	  

	
		  
	  $("#page_calendar #ulevlist").find("li").on("tap",function(event) {
		  console.log("tap on event, selectModeOn: "+selectModeOn)
					//if (selectModeOn) selectShare($(this),"eventcalendar");
					
				});
}

var scheda = {
 
    send: function() {
         
        navigator.notification.confirm("Confermi l'invio delle schede?",
                                       scheda.confirmedSend,
                                       "Conferma invio",
                                       "Sì,No");
    },
	
	save: function(schd,success,fail) {
		
		//alert("scheda save");
         
        if (scheda.data.nome != "") {
			
			
			
			/*delete scheda.data._id;
			delete scheda.data._rev;*/
			
		//	 scheda.data.coordinate = position.coords;
        //alert(JSON.stringify(scheda.data));
        app.storage.setItem( scheda.data.nome, JSON.stringify(scheda.data));
		//refreshSchede();
		/*
		 navigator.geolocation.getCurrentPosition(
                    scheda.onPositionSuccess,
					
					
                    scheda.onPositionError, 
                    {maximumAge: 5000, timeout: 5000, enableHighAccuracy: true});
		
		*/
		var func="addScheda";
		if (scheda.data._id) func="updScheda";
		
		colog("posting "+JSON.stringify(scheda.data));
		   $.ajax({
            //url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
			url: rooturl+"/schede/"+func,
            type: "POST",
            data: scheda.data})
        .done(function(data) {
			// navigator.notification.alert(data, function() {}, "Avviso");
			//alert("done: "+data);
			if (data.error)
			{
			 fail();	
			}	else {
				
				//app.storage.clear(); 
			 //navigator.notification.alert(JSON.stringify(scheda.data), function() {}, "Avviso");
			// navigator.notification.alert(JSON.stringify(scheda.data), function() {}, "Avviso");
			colog("save result: "+JSON.stringify(data));
			//refreshSchedeServer();
			success();
			}
			
			//successCallback();
		})
        .fail(function() {
			toast("Error posting","long");
			
		});
		
         
		
           
       
        }
    },
  
    onPositionSuccess: function(position) {
         
        scheda.data.coordinate = position.coords;
        toast(JSON.stringify(scheda.data),"short");
        app.storage.setItem( scheda.data.nome, JSON.stringify(scheda.data));
		refreshSchedeServer();
    },
  
    onPositionError: function(error) {
  
        var messaggio = "";
  
        switch (error.code) {
         
            case PositionError.PERMISSION_DENIED:
                messaggio = "L'applicazione non è autorizzata all'acquisizione della posizione corrente";
                break;
             
            case PositionError.POSITION_UNAVAILABLE:
                messaggio = "Non è disponibile la rilevazione della posizione corrente";
                break;
             
            case PositionError.TIMEOUT:
                messaggio = "Non è stato possibile rilevare la posizione corrente";
                break;
        }
         
        toast(messaggio,"long");
    },
	
	
	
	load: function(nome) {
     
        if (nome != "") {
             
			 
			 
            var value = app.storage.getItem($.trim(nome));
            scheda.data = JSON.parse(value);
        }
    },
	
	loadById: function(id,callback) {
		 delete scheda.data._id;
		 delete scheda.data._rev;
		 $.ajax({
            url: rooturl+"/schede/findById/"+id,
            type: "GET"})
         .done(function(data) {
			 colog("loadbyid "+id+": "+JSON.stringify(data));
			 scheda.data=data;
			 callback(scheda);
		 });
		
		
	},
	
	remove: function(id,rev) {
		
		debugga(id+" "+rev);
     
        if (id != "") {
            //app.storage.removeItem($.trim(nome));
			$.ajax({
            //url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
			url: rooturl+"/schede/delScheda",
            type: "POST",
            //data: {id: scheda.data._id, rev: scheda.data._rev 
			data: {id: id, rev: rev }
			})
        .done(function(data) {
			// navigator.notification.alert(data, function() {}, "Avviso");
			//alert("done: "+data);
			//app.storage.clear(); 
			// navigator.notification.alert(JSON.stringify(scheda.data), function() {}, "Avviso");
			//alerta(JSON.stringify(data));
			refreshSchedeServer();
			//successCallback();
		})
        .fail(function() {
			toast("Error posting","long");
			
		});
        }
    },
	
	send: function(listaSchede, successCallback, failCallback) {
  
        $.ajax({
            url: "http://ssodemyapp.mybluemix.net/schede/addScheda",
            type: "POST",
            data: listaSchede})
        .done(function(data) {
			// navigator.notification.alert(data, function() {}, "Avviso");
			//alert(data);
			//app.storage.clear(); 
			successCallback();})
        .fail(failCallback);
    },
	
	
	
	data: {nome: "", indirizzo: "", descrizione: "", prezzo: "0,00",  coordinate: {}, photoURI: "", barcode: ""}
}	


function refreshSchedeServer()
{
	  debugga("refreshSchedaServer");
	  //navigator.notification.activityStart("Caricamento", "loading");
	  progressStart("Lettura dati");
	  app.loadAllSchede(function(data){
		  
		  if (data.error)
		  {
			toast("errore","long");  
			  
		  } else {
		  
		  //alert(data);
		  

          var elencoSchede = $("#liElencoSchede");
            elencoSchede.html("");
			
			var lih='<li data-role="list-divider" role="heading" data-theme="b">'+data.rows.length+' schede</li>';
			elencoSchede.append(lih);
			
			data.rows.sort(function(a,b) {
			  if ((a.doc.nome)	&& (b.doc.nome))
			  {	  
				var nome1=a.doc.nome.toLowerCase();
				var nome2=b.doc.nome.toLowerCase();
				if (nome1>nome2) return 1;
				if (nome1<nome2) return -1;
			  }	
				return 0;
				
			});
			
			$("#recnum").html(data.rows.length+" "+bonames);
			var html = new EJS({url: tplurl+'tpl/tpl01.ejs'}).render(data.rows); 
			elencoSchede.empty().append(html);
			
			elencoSchede.find("li").on("tap",function() {
				var id=$(this).find("a").attr("id").split("_")[0];
				 colog("requesting id "+id);
				 
				 progressStart("Lettura dati");
				 scheda.loadById(id,function(data) {
					 progressStop();
					 //alert(JSON.stringify(data));
				 $("#txtNome").val(scheda.data.nome);
                 $("#txtIndirizzo").val(scheda.data.indirizzo);
                 $("#txtDescrizione").val(scheda.data.descrizione);
                 $("#txtPrezzo").val(scheda.data.prezzo);
				 $("#scanDiv").html(scheda.data.barcode);
				 
				 if ($.trim(scheda.data.photoURI)!="")
				 {
				  //alert(scheda.data.photoURI);	 
			      $("#fotoAnteprima").attr("src",scheda.data.photoURI).css({width: "128px", height: "128px"});
				  //alert($("#fotoAnteprima").attr("src"));
                  $("#fotoAnteprima").on("tap",function() {
					  $("#fullPhoto").attr("src",scheda.data.photoURI).css({width: "400px", height: "700px"});
					   $.mobile.changePage("#viewPhoto",{role: "dialog"});
					  
					  
				  });				  
				 } else {
				 	 
				  $("#fotoAnteprima").attr("src","img/nophoto.jpg").css({width: "128px", height: "128px"}); 	 
				 }
				  $("#scheda h3").html("Modifica "+boname);
                 $.mobile.changePage("#scheda");
					 
				 });
         
                return false;
				
			})
			
			elencoSchede.find("li").on("taphold",function() {
				
				var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					if (role.trim().toLowerCase()=="customer") return;
					
				}
				
			
				
			    var id=$(this).find("a").attr("id").split("_")[0];
				   var rev=$(this).find("a").attr("id").split("_")[1];
				  // scheda.remove(id,rev);
					  
                   //   $.mobile.changePage("#elencoSchede");
				   
				   
				  gConfirm("Confermi l'eliminazione della scheda?","Conferma eliminazione",function() {
					  scheda.remove(id,rev);
					  
                      $.mobile.changePage("#elencoSchede");
				  },function() {
					  
					  
				  });  
     /*
              navigator.notification.confirm("Confermi l'eliminazione della scheda?",function(buttonIndex) {
					  
                    if (buttonIndex == 1) {
                      scheda.remove(id,rev);
					  
                      $.mobile.changePage("#elencoSchede");
                   }
                 },"Conferma eliminazione","Sì,No");
				 */
                return false;
			
			});
             /*
            for (var i=0; i<data.rows.length; i++) {
				
			   scheda.data=data.rows[i].doc; 	
 
               var li = $("<li data-theme='c'><a href='#' id='"+data.rows[i].doc._id+"_"+data.rows[i].doc._rev+"' data-transition='slide'>" +  data.rows[i].doc.nome +  "</a></li>");
  
               li.on("tap", function() {
				  
          				  
				   
				 
				
         
               //  scheda.load($(this).text());
				 //navigator.notification.alert(JSON.stringify(scheda.data), function() {}, "Avviso");
				 
				 var id=$(this).find("a").attr("id").split("_")[0];
				 console.log("requesting id "+id);
				 
				 progressStart("Lettura dati");
				 scheda.loadById(id,function(data) {
					 progressStop();
					 //alert(JSON.stringify(data));
				 $("#txtNome").val(scheda.data.nome);
                 $("#txtIndirizzo").val(scheda.data.indirizzo);
                 $("#txtDescrizione").val(scheda.data.descrizione);
                 $("#txtPrezzo").val(scheda.data.prezzo);
				 $("#scanDiv").html(scheda.data.barcode);
				 
				 if ($.trim(scheda.data.photoURI)!="")
				 {
				  //alert(scheda.data.photoURI);	 
			      $("#fotoAnteprima").attr("src",scheda.data.photoURI).css({width: "128px", height: "128px"});
				  //alert($("#fotoAnteprima").attr("src"));
                  $("#fotoAnteprima").on("tap",function() {
					  $("#fullPhoto").attr("src",scheda.data.photoURI).css({width: "400px", height: "700px"});
					   $.mobile.changePage("#viewPhoto",{role: "dialog"});
					  
					  
				  });				  
				 } else {
				 	 
				  $("#fotoAnteprima").attr("src","img/nophoto.jpg").css({width: "128px", height: "128px"}); 	 
				 }
                 $.mobile.changePage("#scheda");
					 
				 });
         
                return false;
              });
    

              li.on("taphold", function() {
  
                   var id=$(this).find("a").attr("id").split("_")[0];
				   var rev=$(this).find("a").attr("id").split("_")[1];
				  // scheda.remove(id,rev);
					  
                   //   $.mobile.changePage("#elencoSchede");
     
              navigator.notification.confirm("Confermi l'eliminazione della scheda?",function(buttonIndex) {
					  
                    if (buttonIndex == 1) {
                      scheda.remove(id,rev);
					  
                      $.mobile.changePage("#elencoSchede");
                   }
                 },"Conferma eliminazione","Sì,No");
				 
                return false;
               });
	
               elencoSchede.append(li);
	          
            }
            */
            
			
            elencoSchede.listview("refresh");	
		  }
		 //navigator.notification.activityStop();
		 progressStop();
	  });	  
	
}


function progressStart(text)
{
 if (isPhone) {
	 
   navigator.notification.activityStart(text, "caricamento...");	
 } else
 {
   $.mobile.loading( 'show', {
	text: text,
	textVisible: true,
	theme: 'z',
	html: ""
   });
     	 
 }	 
}
function progressStop()
{
 if (isPhone) {
	 navigator.notification.activityStop();
 }	 
{
   $.mobile.loading( 'hide');
     	 
 }	  
}


function refreshSchede()
{

		  
	 
      var elencoSchede = $("#liElencoSchede");
            elencoSchede.html("");
			
			var lih='<li data-role="list-divider" role="heading" data-theme="b">'+app.storage.length+' schede</li>';
			elencoSchede.append(lih);
             
            for (var i=0; i<app.storage.length; i++) {
 
               var li = $("<li data-theme='c'><a href='#' data-transition='slide'>" + 
                app.storage.key(i) + 
                "</a></li>");
  
               li.on("tap", function() {
         
                 scheda.load($(this).text());
				 //navigator.notification.alert(JSON.stringify(scheda.data), function() {}, "Avviso");
				 
				 
         
                 $("#txtNome").val(scheda.data.nome);
                 $("#txtIndirizzo").val(scheda.data.indirizzo);
                 $("#txtDescrizione").val(scheda.data.descrizione);
                 $("#txtPrezzo").val(scheda.data.prezzo);
				 $("#scanDiv").html(scheda.data.barcode);
				 
				 if ($.trim(scheda.data.photoURI)!="")
				 {
				  //alert(scheda.data.photoURI);	 
			      $("#fotoAnteprima").attr("src",scheda.data.photoURI).css({width: "128px", height: "128px"});
				  //alert($("#fotoAnteprima").attr("src"));
                  $("#fotoAnteprima").on("tap",function() {
					  $("#fullPhoto").attr("src",scheda.data.photoURI).css({width: "400px", height: "700px"});
					   $.mobile.changePage("#viewPhoto",{role: "dialog"});
					  
					  
				  });				  
				 } else {
				 	 
				  $("#fotoAnteprima").attr("src","img/nophoto.jpg").css({width: "128px", height: "128px"}); 	 
				 }
				  $("#scheda h3").html("Modifica "+boname);
                 $.mobile.changePage("#scheda");
              });
    

              li.on("taphold", function() {
				  
				  
				  var u=getCookie("user");
				if (u.trim()!="") {
					var user=JSON.parse(u);
					var role=user.role;
					//alert(role);
					if (role.trim().toLowerCase()=="customer") return;
					
				}
				
				
  
                  var key = $(this).text();
     
                  navigator.notification.confirm("Confermi l'eliminazione della scheda?",function(buttonIndex) {
                    if (buttonIndex == 1) {
                      scheda.remove(key);
                      $.mobile.changePage("#elencoSchede");
                   }
                 },"Conferma eliminazione","Sì,No");
               });
	
               elencoSchede.append(li);
	
            }

             
            elencoSchede.listview("refresh");	
			
			// });
	
}


function alerta(txt)
{
 if (isPhone)
 {
  navigator.notification.alert(txt, function() {}, "Avviso"); 
 }	else alert(txt);	
	
}

function debugga(txt)
{
 console.log(txt)	;
}

function newScheda()
{
 //	data: {nome: "", indirizzo: "", descrizione: "", prezzo: "0,00",  coordinate: {}, photoURI: "", barcode: ""}	
 delete scheda.data._id;
 delete scheda.data._rev;
 scheda.data.nome="";
 scheda.data.indirizzo="";
 scheda.data.descrizione="";
 scheda.data.prezzo="";
 scheda.data.coordinate="";
 scheda.data.photoURI="";
 scheda.data.barcode="";
 
  $("#txtNome").val("");
  $("#txtIndirizzo").val("");
  $("#txtDescrizione").val("");
  $("#txtPrezzo").val("");
  $("#scanDiv").html("No code");
  $("#fotoAnteprima").attr("src","img/nophoto.jpg").css({width: "128px", height: "128px"});
 
 $("#scheda h3").html("Nuova "+boname);
$.mobile.changePage("#scheda");	
}

function toast(msg,duration)
{
 if (isPhone) {
  window.plugins.toast.show(msg, duration, 'center', function(a){}, function(b){});		 
 } else {
	 console.log("toast: "+msg);
 }
 
	
}

function gConfirm(question,title,onYes,onNo) {
	
	if (isPhone){
		
		
		 navigator.notification.confirm(
  
            question,
  
            function(buttonIndex) {
  
              if (buttonIndex == 1) {
               onYes();
             } else onNo();
            },
            title, 
            "Sì,No");
		
		
		
	} else
	{
	 if (confirm(question))
     {
	  onYes();	 
	 }	else
	 {
	  onNo();	 
	 }		 
		
		
	}
	
}


/*

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

*/
function colog(txt)
{
 if (!logactive) return;	
 console.log(txt)	
}

function getCookie(c_name)
{
 var c_value;	
 if (isPhone)
 {
 // alert("getting localstorage "+c_name);	 
   c_value=storage.getItem(c_name)
   if (!c_value) c_value="";
 } else {	 
	
	
 c_value = document.cookie;
var c_start = c_value.indexOf(" " + c_name + "=");
if (c_start == -1)
  {
  c_start = c_value.indexOf(c_name + "=");
  }
if (c_start == -1)
  {
  c_value = null;
  }
else
  {
  c_start = c_value.indexOf("=", c_start) + 1;
  var c_end = c_value.indexOf(";", c_start);
  if (c_end == -1)
    {
    c_end = c_value.length;
    }
  c_value = unescape(c_value.substring(c_start,c_end));
  }
  }
return c_value;
}

function setCookie(c_name,value,exdays)
{
 if (isPhone) {
	// alert("setting localstorage "+c_name+" to "+value);
  	 storage.setItem(c_name, value);	 
 }	
 else
 {
 
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
 }
 
// alert(getCookie(c_name));
}



var deleteCookie = function(name) {
	if (isPhone) {
	// alert("removing localstorage "+name);	
	 storage.removeItem(name);
	} else {
	 
	 
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
};


function createMultipleCheckboxes(selector,array){
         selector="#page_upload #users"; 
        // $("#page_upload #users").append('<fieldset id="cbFieldSet" data-role="controlgroup">');
		 var htm="<table width='100%'>";
		 
         var length = array.length;
         for(var i=0;i<length;i++){
			htm+='<tr><td width="20px"><input type="checkbox" id="'+array[i].doc.it+'"/></td><td>'+array[i].doc.lastname+" "+array[i].doc.firstname+'</td></tr>';
			
           // $("#cbFieldSet").append('<input type="checkbox" data-iconpos="left" name="cb-'+i+'" id="cb-'+i+'" value="'+array[i].doc.firatname+'"/><label for="cb-'+i+'">'+array[i].doc.firstname+'</label>');
         }
		 htm+="</table>";
		 $(selector).empty().append(htm);
         
        // $("#content").trigger("create");
        // $("#showBtn").css("visibility","visible");
        }
		

function shareUsers(sel,ids,db,sharelist){
	 selectedObjects.db=db;
	 $.get(rooturl+"/events/listusers",function(data){
		//alert(data.rows.length);
		//var htm="";
		var idlist="";
		$(data.rows).sort(function(a,b){
			var a1=a.doc.lastname;
			var b1=b.doc.lastname;
			if (a1<b1) return 1;
			if (a1>b1) return -1;
			return 0;
		})
		
		
		var udata={
			rows: []
		};
		
		$(data.rows).each(function(i){
			var user=data.rows[i].doc;
			var id=user._id;
			var firstname=user.firstname;
			var lastname=user.lastname;
			var role="USER";
			if (user.role) role=user.role.toLowerCase();
			
			data.rows[i].value1=lastname+" "+firstname;
			data.rows[i].value2=user.role;
			data.rows[i].value3=user.company;
			data.rows[i].value4=user.email;
			data.rows[i].id=id;
			data.rows[i].sharelist=sharelist;
			
			if (role=="customer") udata.rows.push(data.rows[i]);
			//htm+="<option value='"+id+"'>"+lastname+" "+firstname+"</option>"
			//htm+="<li>"+lastname+" "+firstname+"</li>"
			if (idlist.trim()!="") idlist+=",";
			idlist+=id;
			
		})
		
		//createMultipleCheckboxes("#pageupload #users",data.rows);
		 var htm= new EJS({url: tplurl+'tpl/shareusers2.ejs'}).render(udata.rows); 
		 $(sel).find("#ulshare").empty().append(htm);
		 $("#page_shareusers [type=checkbox]").checkboxradio();
		 $("#page_shareusers #ulshare").listview("refresh");
		 $("#page_shareusers #shareid").val(ids);
		//$("#page_shareusers #ulshare a").removeClass("ui-btn");
	
		 
		 
		 
		 
	     //var apage=$.mobile.activePage.attr('id');
		 //alert(apage);
		// $("#"+apage+" #page_shareusers").popup("open");
		 
		 
		 $.mobile.changePage("#page_shareusers",{
			 role: "dialog"
		 })
	 }); 
	
}

function shareUsersOk() {
	
	//alert("ok");
	
	var shareObj={
		db: selectedObjects.db,
		ids:  $("#page_shareusers #shareid").val(),
		users: ""
		
	}
	
	
	
	
	var userlist="";
	$("#page_shareusers input:checkbox:checked").each(function() {
		console.log("checked "+$(this).attr("id"));
		var ck=$(this);
		if (userlist.trim()!="") userlist+=",";
		userlist+=ck.attr("id");
		//shareObj.users.push(ck.attr("id"));
	
		
	});
	
	//alert(userlist);
	
	
	console.log("sharing with users: "+userlist)
	
    var ids="";
	$(selectedObjects.rows).each(function(i){
		var row=selectedObjects.rows[i];
		var id=row.id;
		console.log("pushing id "+id)
		if (ids.trim()!="") ids+=",";
		ids+=id;

		
		
		
		
		
	})
	
	//shareObj.ids=ids;
	shareObj.users=userlist;
	
	
	
	console.log(JSON.stringify(shareObj));
    var retpage="#page_calendar";
	  if (shareObj.db=="elibrary") {
				   retpage="#page_elibrary";
				  // refreshElibrary();
				   }
	
        $.ajax({
            url: rooturl+"/events/addshare",
            type: "POST",
            data: shareObj})
        .done(function(data) {
			// navigator.notification.alert(data, function() {}, "Avviso");
			//alert(data);
			//app.storage.clear(); 
			     if (shareObj.db=="elibrary") {
					 refreshElibrary(function() {
						 
						 console.log("elibrary refreshed");
						 $.mobile.changePage(retpage) 
						 
					 });
				 }
				 if (shareObj.db=="eventcalendar") {
					 setCalendar(1,function() {
						  $.mobile.changePage(retpage) 
						 
					 });
				 }
	
		 })
		 
        .fail(function() {
			
			
		});
	
	
	
	         
	           
	          

	
}


function selectShareCancel(){
	selectedObjects={db: "",rows: []};
	$(".shareSelected").removeClass("shareSelected");
	var apage=$.mobile.activePage.attr('id');	
	$("#"+apage+" #sharebar").hide();
	//$("#page_calendar #ulevlist").find("li").off("tap");
	selectModeOn=false;
	
}

function selectShare(li,db){
	
	//alert("selectShare "+db);
    selectedObjects.db=db;
	var has=li.find(".imgli").hasClass("shareSelected");
	var a=li.find("a");	
	var id=a.attr("id").split("_")[0];
	
	console.log(id);
	
	if (has){
		li.find(".imgli").removeClass("shareSelected");
		
	} else {

	li.find(".imgli").addClass("shareSelected");
	selectedObjects.rows.push({"id": id})
	}	
    
	console.log(JSON.stringify(selectedObjects));

	var apage=$.mobile.activePage.attr('id');
	//alert(apage);
	
	$("#"+apage+" #sharebar").show();
	
	var n=li.closest("ul").find("img.shareSelected").length;
	//alert(n);
	
	var parola="events";
	if (db=="elibrary") parola="documents";
	
	$("#"+apage+" #nselected").html(n+" "+parola+" selected");
	
	
}



function deleteSelected(){
	
	
}


function getSafe(obj){
	if (obj) return obj;
	return "";
	
}

function gotoSocial(){
	
	var url="http://gse.dst.ibm.com/sales/gss/download/repenabler/FeedProvider?repid=dino_ravasi@it.ibm.com&pagetype=rep&country=IT&language=it&item=Messages&type=rss&callback=?";
	//url="http://usatocellulare.it";
	//url="http://www.yahoo.it"
	var app_token="caz"
	
	var rss={ rows: []};
	
        $.ajax({
            url: rooturl+"/events/crossd",
            type: "POST",
            data: {
				host: "http://gse.dst.ibm.com",
				path: "sales/gss/download/repenabler/FeedProvider?repid=anna.scarsi@it.ibm.com&pagetype=rep&country=IT&language=it&item=Messages&type=rss&callback=?",
				url: url,
				format: "xml"
				
			}})
        .done(function(data) {
			// navigator.notification.alert(data, function() {}, "Avviso");
			//alert(data);
			//app.storage.clear(); 
			     console.log(data);
				 
				 //alert(data.rss.channel.length);
				 
				 $(data.rss.channel[0].item).each(function(i){
					 rss.rows.push(data.rss.channel[0].item[i]);
				 })
				 
				  var htmMessage= new EJS({url: tplurl+'tpl/rssMyMessage.ejs'}).render(rss.rows); 		  
				  $("#freewallSocial").html(htmMessage);
				  
				  
			var wallSocial = new Freewall("#freewallSocial");
				wallSocial.reset({
				selector: '.brickSocial',
				animate: true,
				cellW: 200,
				cellH: 'auto',
				onResize: function() {
					wallSocial.fitWidth();
				}
			});
			
			wallSocial.container.find('.brickSocial img').load(function(){
				wallSocial.fitWidth();
			});
				  
	  				  	  
			$.mobile.changePage("#page_social")
			
	
		 })
		 
        .fail(function() {
			
			
		});
return;
	
	$.get(url,function(data) {
    console.log("Request received: " + data);
    });
  
	
	
	
	
	return;
	
	window.open(socialframesrc,'_system');
	
	//$.mobile.changePage("#page_social")
	
	
	
	
}


function gotoTools(){
	$.mobile.changePage("#page_tools")
	
	
	
	
}


function openMail(mail) {
	
	window.location.href = "mailto:?subject=Something to share with you...";
	
}


function downloadAndOpenPDF(url, fileName, folder) {
    var fileTransfer = new FileTransfer();
    var filePath = folder + fileName;

    console.log('################# filepath');
    console.log(filePath);

    fileTransfer.download(
        url,
        filePath,
        function(entry) {
            console.log('********OK!', filePath);
            window.plugins.pdfViewer.showPdf(filePath);
        },
        function (error) {
            console.log('Failed, do something');
            console.log(error.code);
            console.log(error.source);
            console.log(error.target);
            console.log(error.http_status);
            alert('Oh no, something went wrong');
        }
    );
}




var users={ rows: []};
var edituser={};

var customers={ rows: []};
var editcustomer={};


function showUsersPage(){
	
	
	$.get(rooturl+"/events/listusers",function(data){
		//alert(data.rows.length);
		//var htm="";
		var idlist="";
		$(data.rows).sort(function(a,b){
			var a1=a.doc.lastname;
			var b1=b.doc.lastname;
			if (a1<b1) return 1;
			if (a1>b1) return -1;
			return 0;
		})
		
		$(data.rows).each(function(i){
			var user=data.rows[i].doc;
			var id=user.id;
			var firstname=user.firstname;
			var lastname=user.lastname;
			data.rows[i].value1=lastname+" "+firstname;
			data.rows[i].value2=user.role;
			data.rows[i].value3=user.company;
			data.rows[i].value4=user.email;
			//alert(data.rows[i].value4);
			//htm+="<option value='"+id+"'>"+lastname+" "+firstname+"</option>"
			//htm+="<li>"+lastname+" "+firstname+"</li>"
			users.rows.push(data.rows[i]);
			if (idlist.trim()!="") idlist+=",";
			idlist+=id;
			
		})
		
		//createMultipleCheckboxes("#pageupload #users",data.rows);
		 var htm= new EJS({url: tplurl+'tpl/admin_users.ejs'}).render(data.rows); 
		 //alert(htm);
		 $("#page_users #divusers").empty().append(htm);
		 progressStop();
	     $.mobile.changePage("#page_users");
	});
	
		
}

function showCustomersPage(){
	
	
	$.get(rooturl+"/events/listobjects/customers",function(data){
		//alert(data.rows.length);
		//var htm="";
		var idlist="";
		$(data.rows).sort(function(a,b){
			var a1=a.doc.lastname;
			var b1=b.doc.lastname;
			if (a1<b1) return 1;
			if (a1>b1) return -1;
			return 0;
		})
		
		$(data.rows).each(function(i){
			var user=data.rows[i].doc;
			var id=user.id;
			var firstname=user.firstname;
			var lastname=user.lastname;
			data.rows[i].value1=lastname+" "+firstname;
			data.rows[i].value2=user.role;
			data.rows[i].value3=user.company;
			data.rows[i].value4=user.email;
			//alert(data.rows[i].value4);
			//htm+="<option value='"+id+"'>"+lastname+" "+firstname+"</option>"
			//htm+="<li>"+lastname+" "+firstname+"</li>"
			customers.rows.push(data.rows[i]);
			if (idlist.trim()!="") idlist+=",";
			idlist+=id;
			
		})
		
		//createMultipleCheckboxes("#pageupload #users",data.rows);
		 var htm= new EJS({url: tplurl+'tpl/admin_customers.ejs'}).render(data.rows); 
		 //alert(htm);
		 $("#page_customers #divusers").empty().append(htm);
		 progressStop();
	     $.mobile.changePage("#page_customers");
	});
	
		
}
	
	function editUser(id){
		
		$(users.rows).each(function(i){
			var row=users.rows[i];
			var uid=row.id;
			if (uid==id) edituser=row;
		})
		

		
		var htm= new EJS({url: tplurl+'tpl/edit_user.ejs'}).render(edituser); 
		 //alert(htm);
		 $("#page_edituser #formdiv").empty().append(htm);
		$.mobile.changePage("#page_edituser");
		
		
		
	}
	
	function editCustomer(id){
		
		
		
		$(customers.rows).each(function(i){
			var row=customers.rows[i];
			var uid=row.id;
			if (uid==id) editcustomer=row;
		})
		

		
		var htm= new EJS({url: tplurl+'tpl/edit_customer.ejs'}).render(editcustomer); 
		 //alert(htm);
		 $("#page_editcustomer #formdiv").empty().append(htm);
		$.mobile.changePage("#page_editcustomer");
		
		
		
	}
	
		function addUser(){
		
		edituser={ doc: {}}
		

		
		var htm= new EJS({url: tplurl+'tpl/edit_user.ejs'}).render(edituser); 
		 //alert(htm);
		 $("#page_edituser #formdiv").empty().append(htm);
		 $("#page_edituser #formdiv").append("<input type=hidden id=adduser />");
		$.mobile.changePage("#page_edituser");
		
		
		
	}
	
			function addCustomer(){
		
		editcustomer={ doc: {}}
		

		
		var htm= new EJS({url: tplurl+'tpl/edit_customer.ejs'}).render(editcustomer); 
		 //alert(htm);
		 $("#page_editcustomer #formdiv").empty().append(htm);
		 $("#page_editcustomer #formdiv").append("<input type=hidden id=adduser />");
		$.mobile.changePage("#page_editcustomer");
		
		
		
	}
	
	
	
	
	function saveObjectForm(table) {
		
		if (!table) table="users";
		
		var saveObj={};
		var apage=$.mobile.activePage.attr('id');
		var l=$("#"+apage+" input:hidden#adduser").length;
		
		$("input.field").each(function(){
			
			var campo=$(this);
			var camponame=campo.attr("id");
			var val=campo.val();
			saveObj[camponame]=val;
			
			
		})
		
		console.log(JSON.stringify(saveObj));
		
		if (l==0)
		{	
		
		 $.ajax({
            url: rooturl+"/events/updateobject/byid/"+table+"/"+saveObj._id,
            type: "POST",
            data: saveObj})
         .done(function(data) {
			 //alert("record saved");
			 console.log(JSON.stringify(data));
			 progressStart(table+" updated, refreshing","Update complete");
			 if (table=="users")			 showUsersPage();
			  if (table=="customers")			 showCustomersPage();
			 
		 });
		
		} else{
			
			$.ajax({
            url: rooturl+"/events/addobject/"+table,
            type: "POST",
            data: saveObj})
         .done(function(data) {
			 //alert("record saved");
			 console.log(JSON.stringify(data));
			 progressStart(table+" added, refreshing","Update complete");
			 if (table=="users")			 showUsersPage();
			 if (table=="customers")			 showCustomersPage();
			 
		 });
			
			
		}
		
		
	}
	
	
	function deleteUser(id){
		$.ajax({
            url: rooturl+"/events/deleteobject/byid/users/"+id,
            type: "POST",
            data: {}
		 })
         .done(function(data) {
			 //alert("record saved");
			 console.log(JSON.stringify(data));
			 progressStart("User delete, refreshing","Update complete");
			 showUsersPage();
			 
		 });
		
		
	}
	
		function deleteCustomer(id){
		$.ajax({
            url: rooturl+"/events/deleteobject/byid/customers/"+id,
            type: "POST",
            data: {}
		 })
         .done(function(data) {
			 //alert("record saved");
			 console.log(JSON.stringify(data));
			 progressStart("Customer deleted, refreshing","Update complete");
			 showCustomersPage();
			 
		 });
		
		
	}
	
