/* JavaScript for: RAH
created by Chadden: 1.2014
last updated:
*/
var includes = "",
web_dir = "",
product="ResponsiveApplicationHarness";
switch(location.hostname){
/*	case 'webapps-cdn-stg.esri.com':
		web_dir = "http://webapps-cdn-stg.esri.com/tools/"+product+"/";
	break;
	case 'webapps-cdn.esri.com':
		web_dir = "http://webapps-cdn.esri.com/tools/"+product+"/";
	break;
	*/
	case 'localhost':
	case 'localhost':
	case 'localhost:81':
	default:
		web_dir = '/';
		web_dir = 'http://'+location.hostname+':'+location.port+"/"+product+"/";
	break;
}

var
scripts_dir = web_dir+"js/",
scripts = [];
if (typeof jQuery == 'undefined') {  
   scripts.push("libs/jquery-1.10.2.min.js");
}
scripts.push(
	"libs/craydent-1.7.18.js",
	"libs/greensock/TweenMax.min.js",
	"libs/greensock/jquery.gsap.min.js",
	//"jquery.touchSwipe.min.js",
	"RAHconfig.js",
	"ResponsiveApplicationHarness.craydent.jquery.js",

	
//modules
	"modules/DatasetFilterer.js",	
	"modules/Responsivizer.craydent.jquery.js"
	
);

var
styles_dir = web_dir+"css/",
styles =[
	//"jquery.mobile.structure-1.3.2.min.css",
	"ui-basics.css",
	"styles.css",
	"views.css",
	"responsivizer.css"
],
script,style,sc,st,
sc_len = scripts.length,st_len = styles.length;

//scripts
for(sc = 0; sc < sc_len; sc++){
	script = scripts[sc];
	includes+='<script type="text/javascript" src="'+scripts_dir+script+'"></script>';
}
//styles
for(st = 0; st < st_len; st++){
	style = styles[st];
	includes+='<link href="'+styles_dir+style+'" rel="stylesheet" type="text/css">';
}

includes+='';
document.write(includes);
