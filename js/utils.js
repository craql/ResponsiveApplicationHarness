// RAH Utils
var __clearDiv__ ='<div class="clear"></div>';
function UTCcheck(){
	var s = new Date();
	return (s.getUTCSeconds() + (s.getUTCMilliseconds()/1000));
}

function formatTime(sHour,sMin,eHour,eMin,day,month,year){
	var sFormat = ((__MWAref.current.sortBy.primary != 'startDay') || (__MWAref.view == "map"))?'D g:ia':'g:ia';
	//var date =(__MWAref.current.sortBy.primary == 'startDay')?'':(new Date(month+'/'+day+'/'+year)).format('D')+' ';
	var start =$c.format(new Date(month+'/'+day+'/'+year+' '+sHour+':'+sMin),sFormat);
	var end =$c.format(new Date(month+'/'+day+'/'+year+' '+eHour+':'+eMin),"g:ia");
	return start+' - '+end;
	

}
function formatDate(month,day,year){
	return $c.format((new Date(month+'/'+day+'/'+year)),'l, F jS');
}

function showOfferingsCount(count){
	var html = (((count > 1) && 'offered '+count+' times')||'');
	return html;
}
function formatSponsorURL(URL){
//	var r = URL.replace('www.','').replace('http://','').replace('.com/','.com').replace('.edu/','.edu');
	var r = (URL+' ')
		.replace('www.','')
		.replace('http://','')
		.replace('https://','')
		.replace('/ ','')
		.replace(/com[/a-zA-z0-9 \_ \- \? \. \=]*/,'com');
	return r;
}

function renderSponsorLogo(url){
	var html = ((url && "<img src='"+url+"' />")||"");
	return html;
}
function formatSessionAuthor(author,org,bio){
		var html = 
			"<div class='session-asset-author'>"+
			((author && author +", ")||'')+
			((org && org)||'')+
			((bio && '<div class="session-asset-bio">'+bio+'</div>')||'')+
			"</div>";
		
		//return "";
		if(author){
			return html;
		}
		else{
			return "";
		}
	}