// Events App - PhoneGap Config

var RAHconfig = function(){
	return {
/*--------------------------------------------------------------------------------------/
	Data Functions | Should take a callback
---------------------------------------------------------------------------------------*/
	dataFunctions:{
		global:function(callback){
		
		},
		specific:function(callback){
		}
	},
/*--------------------------------------------------------------------------------------/
	Header Buttons | Buttons on the views panel header
---------------------------------------------------------------------------------------*/
	headerButtons:[
		{
			name:'leftMenu',
			action:'App.toggleMenuDrawer(\'left\')',
			side:'left'
		},
		{
			name:'rightMenu',
			action:'App.toggleMenuDrawer(\'right\')',
			side:'right'
		}
	],	
/*--------------------------------------------------------------------------------------/
	MENUS | The three + tiered menu 
---------------------------------------------------------------------------------------*/
	menus:{
		'conferenceSelectMenu':{
			renderFunction:'renderConferenceSelectMenu'
		},
		'conferenceMenu':{
			renderFunction:'renderConferenceMenu',
			menuItems:[
				{id:'eventOverview',action:'App.gotoView',title:'Event Overview',params:"'eventOverview'"},
				{id:'planner',action:'App.gotoView',title:'My Planner',params:"'planner'"},
				{id:'eventSessions',action:'App.gotoView',title:'Sessions',params:"'eventSessions'"},
				{id:'eventActivities',action:'App.gotoView',title:'Activities',params:"'eventActivities'"},
				{id:'eventMaps',action:'App.gotoView',title:'Maps',params:"'eventMaps'"},
				{id:'eventExhibitors',action:'App.gotoView',title:'Sponsors & Exhibitors',params:"'eventExhibitors'"},
				{id:'scheduleTechSupport',action:'App.gotoView',title:'Schedule Tech Support',params:"'scheduleTechSupport'"},
				
			]
		},
		'filtersMenu':{
			renderFunction:'renderFiltersMenu'
		},
		'loginMenu':{
			renderFunction:'renderloginMenu'
		}
	},
/*--------------------------------------------------------------------------------------/
	POPUP MENUS | One visible per drawer
---------------------------------------------------------------------------------------*/
	popupMenus:{
		'developer':{
			title:'Developer Menu',
			renderFunction:function(){
				
			}
			//can also use renderTemplate
		},
		'coreyH':{
			title:'Corey Hadden',
			parentMenu:'developer',
			renderFunction:function(){
				return 'Corey Hadden\'s menu';
			}
			//can also use renderTemplate
		}
	},
/*--------------------------------------------------------------------------------------/
	VIEWS | ALL the in-app screens
---------------------------------------------------------------------------------------*/
	initialView:'helloWorld',
	views:{
		'helloWorld':{
			dataset:'upcomingConferences',
			defaultMode:'list',
			modes:['list'],
			title:'hello World',
			id:'helloWorld'
		},
		'swipeable':{
			dataset:'upcomingConferences',
			defaultMode:'swipe',
			modes:['swipe'],
			title:'Swipe Panels',
			id:'swipeable'
		},

//modes: list,grid,map	

		'eventSelect':{
			dataset:'upcomingConferences',
			defaultMode:'list',
			modes:['list'],
			title:'Select an Event',
			id:'eventSelect'
		},
		
	//conferenceMenu	
		'eventOverview':{
			dataset:'conference',
			defaultMode:'text',
			modes:['text'],
			title:'Conference Overview',
			id:'eventOverview'
		},
		'planner':{
			dataset:'planner',
			defaultMode:'list',
			modes:['list','grid','map'],
			title:'Planner',
			id:'planner'
		},
		'eventSessions':{
			dataset:'sessions',
			defaultMode:'list',
			modes:['list','grid','map'],
			title:'Sessions',
			id:'eventSessions'
		},
		'eventActivities':{
			dataset:'activities',
			defaultMode:'list',
			modes:['list','grid','map'],
			title:'Activities',
			id:'eventActivities'
		},
		'eventMaps':{
			dataset:'maps',
			defaultMode:'list',
			modes:['list'],
			title:'Maps',
			id:'eventMaps'
		},
		'eventExhibitors':{
			dataset:'exhibitors',
			defaultMode:'list',
			modes:['list','grid','map'],
			title:'Sponsors & Exhibitors',
			id:'eventExhibitors'
		},
		'scheduleTechSupport':{
			dataset:'tech support form',
			defaultMode:'form',
			modes:['form'],
			title:'Schedule Tech Support',
			id:'scheduleTechSupport'
		},
//singles
		'sessionDetails':{
			dataset:'session',
			defaultMode:'details',
			modes:['details'],
			title:'Session Details',
			id:'sessionDetails'
		}
		
	},
	viewModes:[
		{mode:'swipe',
			contentTemplate:
			'<div id="appSwipeViewContent" class="app-view-content">'+
				
			'</div>', 
		init:function(view){
			logit('Initializing Swipeable');
		}},
		{mode:'map',
			contentTemplate:
			'<div id="appMapViewContent" class="app-view-content">'+
				'<div id="appMap">'+
					'<div id="mapLocateButton"></div>'+
					'<div id="mapFloorSelector" class=""></div>'+
					'<div id="mapFeaturesPanel" class="ui-block minimized">'+
						
						'<div id="mapFeaturesLegend">'+
							'<div class="map-view-legend-item">Session</div>'+
							'<div class="map-view-legend-item">Exhibitor</div>'+
						'</div>'+
						
						'<div id="mapFeaturesNavigation">'+
							'<div class="featureArrow" id="left-arrow" onclick=" App.navigateFeaturesPanel(\'previous\'); " > < </div>'+
							'<div class="featureArrow" id="right-arrow" onclick=" App.navigateFeaturesPanel(\'next\'); " > > </div>'+
							'<div id="mapFeatureIndicators"></div>'+
						'</div>'+
						
						'<div id="mapFeaturesSelector"></div>'+
						
					'</div>'+
				'</div>'+
			'</div>', 
		init:'initMap'},
		{
			mode:'list', 
			contentTemplate:
				'<div id="appListViewContent" class="app-view-content"> \
					<div id="appList">	\
					</div>	\
					<div id="appListHeader" class="app-list-divider" onclick="App.toggleDividerContent(this);" data-index="0">	\
					</div>	\
				</div>',
			init:'populateList'
		},
		{	mode:'grid',
			contentTemplate:
				'<div id="appGridViewContent" class="app-view-content"> \
					<div id="appGrid">	\
					</div>	\
				</div>',
			init:'populateGrid'},

		{mode:'form'},
		{mode:'text',
		contentTemplate:
			'<div id="appTextViewContent" class="app-view-content"> \
				<div id="appTextHead">	\
					Mode - ${mode} | \
					Data - ${dataset}\
				</div>	\
				<div id="appTextBody">	\
				</div>	\
			</div>',
		init:'populateText'
		},
		{mode:'settings'},
		{
			mode:'details',
			contentTemplate:
				'<div id="appDetailsViewContent" class="app-view-content"> \
					<div id="appDetailsWrapper">\
						<div id="appDetailsHead">	\
							Mode - ${mode} | \
							Data - ${dataset}\
						</div>	\
						<div id="appDetailsBody">	\
						</div>	\
						<div id="appDetailsClose" onclick="App.hideFeatureView();">close</div>\
					</div>\
				</div>',
			init:'populateDetails'
		}
	],
/*--------------------------------------------------------------------------------------/
	VIEWS | ALL the in-app screens
---------------------------------------------------------------------------------------*/
	datasets:{
		'conference':{
			plural:'conference',
			val:function(){return App.Data.conference && App.Data.conference.results[0];},
			sorter:0,
			textHeadTemplate:
				'<div class="app-text-head-title text-shadowed">${fullname}</div>'+
				'<div class="app-text-head-location">${state}, ${country}</div>'+
				'<div class="app-text-head-date">${start_date} - ${end_date}</div>',
				
			textBodyTemplate:
				'<div class="app-text-body-title">${overview_title}</div>'+
				'<div class="app-text-body-content">${overview}</div>'
		
		},
		'conferences':{
			plural:'conferences',
			val:function(){return App.Data.conferences && App.Data.conferences.results;},
			sorter:0,
			listTemplate:appListTemplates['conferences'],
			noDivider:true/*,
			textHeadTemplate:
				'<div class="app-text-head-title">${fullname}</div>'+
				'<div class="app-text-head-location">${state}, ${country}</div>'+
				'<div class="app-text-head-date">${start_date} - ${end_date}</div>',
				
			textBodyTemplate:
				'<div class="app-text-body-title">${overview_title}</div>'+
				'<div class="app-text-body-content">${overview}</div>'*/
		
		},
		'upcomingConferences':{
			plural:'conferences',
		//	val:function(){return App.Data.conferences.results.filter(function(con){return new Date(con.end_date) > new Date()})},
			sorter:5,
			listTemplate:appListTemplates['conferences'],
			noDivider:true/*,
			textHeadTemplate:
				'<div class="app-text-head-title">${fullname}</div>'+
				'<div class="app-text-head-location">${state}, ${country}</div>'+
				'<div class="app-text-head-date">${start_date} - ${end_date}</div>',
				
			textBodyTemplate:
				'<div class="app-text-body-title">${overview_title}</div>'+
				'<div class="app-text-body-content">${overview}</div>'*/
		
		},
		'sessions':{
			idprop:'offeringID',
			titleprop:'sessionTitle',
			locprop:'room',
			val:function(){return App.Data.sessionsView && App.Data.sessionsView.results;},
			plural:'sessions',
			singular:'session',
			sorter:0,
			listTemplate:appListTemplates['sessions'],
			detailsHeadTemplate:_appTemplates.detailsHead,	
			detailsBodyTemplate:_appTemplates.detailsBody,
			haystack:'${sessionTitle} ${offeringID} ${sessionID} ${sessionDescription} ${presenters} ${room}'//${paperTitle}
		},
		'activities':{
			idprop:'offeringID',
			titleprop:'sessionTitle',
			locprop:'room',
			val:function(){return App.Data.activitiesView && App.Data.activitiesView.results;},
			plural:'Activities',
			singular:'Activity',
			sorter:0,
			listTemplate:appListTemplates['sessions'],
			detailsHeadTemplate:_appTemplates.detailsHead,	
			detailsBodyTemplate:_appTemplates.detailsBody,
			haystack:'${sessionTitle} ${offeringID} ${sessionID} ${sessionDescription} ${presenters} ${room}'
		},
		'exhibitors':{
			idprop:'exhibitorID',
			titleprop:'exhibitorName',
			locprop:'exhibitorBooth',
			val:function(){return App.Data.exhibitorsView && App.Data.exhibitorsView.results;},
			plural:'exhibitors',
			singular:'exhibitor',
			sorter:4,
			haystack:'${exhibitorName} ${exhibitorID} ${exhibitorBooth} ${exhibitorDescription}',
			listTemplate:
			'<div class="app-list-item" data-id="${exhibitorID}" onclick="App.showFeatureView(\'${exhibitorID}\')" >'+
				'<div class="app-list-item-logo-holder" ><img class="app-list-item-logo" src="${sponsorLogo}" /></div>'+
				'<div class="app-list-item-title">${exhibitorName}</div>'+
				//'<div class="app-list-item-url">${exhibitorURL}</div>'+
				'<div class="app-list-item-location">booth ${exhibitorBooth}</div>'+
				__clearDiv__+
			'</div>',			
			detailsHeadTemplate:
				'<div class="app-details-head-title text-shadowed">${exhibitorName}</div>'+
				'<div class="app-details-head-content">${sponsorTypeName}</div>'+
				'<div class="app-details-head-booth" onclick="App.gotoMapFeature(\'${exhibitorID}\')">Booth ${exhibitorBooth}</div>',
				
			detailsBodyTemplate:
				'<div class="app-details-body-content">${exhibitorDescription}</div>'+
				'<div class="app-details-body-url">${exhibitorURL}</div>'
		},
		'attractions':{
			plural:'attractions',
			singular:'attraction',		
			sorter:3
		},
		'planner':{
			idprop:'id',
			titleprop:'sessionTitle',
			locprop:'location',
			val:function(){return App.User && App.User.myPlanner;},
			plural:'event',
			singular:'events',
			sorter:0,
			listTemplate:appListTemplates['planner'],
			detailsHeadTemplate:'<div class="app-details-head-title">${title}</div>'+
				//'${RUN[_renderSessionOfferings;${sessionID};]}'+
				//'<div class="app-details-head-debug">offering: ${offeringID} of ${offeringCount}</div>'+
				'<div class="app-details-head-content">${location}</div>',	
			detailsBodyTemplate:
				//'<div class="app-details-body-title">${sessionDescription}</div>'+
				'<div class="app-details-body-content">${description}</div>',
			haystack:'${haystack} ${location}'//${paperTitle}
		},
		maps:{
			set:['']
		}
		
	},
/*--------------------------------------------------------------------------------------/
	SORTERS | How to sort view data
---------------------------------------------------------------------------------------*/
	sorters:[
		{
			display:'Day',
			primary:'startDay',
			sorters:['startMonth','startDay','startHour','startMinute','endHour'],
			divider:'${RUN[formatDate;${startMonth};${startDay};${startYear}]}'
		},
		{
			display:'Event Type',
			//primary:'eventTypeID',
			primary:'eventTypeID',
			sorters:['eventTypeDescription','startMonth','startDay','startHour','startMinute'],
			divider:'${eventTypeDescription}'
		},
		{
			display:'Room',
			//primary:'eventTypeID',
			primary:'room',
			sorters:['room','startMonth','startDay','startHour','startMinute'],
			divider:'${room}'
		},
		{
			display:'Attraction Type',
			primary:'eventTypeDescription',
			sorters:['eventTypeDescription','startMonth','startDay','startHour','startMinute'],
			divider:'${eventTypeDescription}'
		},
		{
			display:'Exhibitor Type',
			primary:'sponsorTypeID',
			sorters:['sponsorTypeID'],
			divider:'${sponsorTypeName}s'
		},
		{
			display:'Conference Date',
			primary:'year',
			sorters:['year'],
			divider:'Upcoming Conferences'
		},
		{
			display:'Planner Day',
			primary:'startdatetime',
			sorters:['startdatetime'],
			divider:'${RUN[formatDateString;${startdatetime}]}'
		}
	],
/*--------------------------------------------------------------------------------------/
	VIEWS | ALL the in-app screens
---------------------------------------------------------------------------------------*/
	filters:[
		//add 'session','activity','exhibitor','planner' to datasets to show narrowers.
		{
			display:'Tracks',
			property:'supers',
			//values:__UCsupers,
			datasets:[]
		},
		{
			display:'Topics',
			//property:'topics',
			property:'tracks',
			multiselect:true,				
			values:function(){return App.getTopics();},
			datasets:['sessions'],
			propIsArray:true
		},
		{
			display:'Days',
			property:'dateID',
			values:function(){return App.getDays();},
			datasets:['planner','sessions','activities']
		},
		{
			display:'Skill Levels',
			property:'levelID',
			values:function(){
					return App.Data.levels.results;
			},
			datasets:['sessions']
		},
		{
			display:'Session Formats',
			property:'eventTypeDescription',
			values:function(){return App.getEventTypes();},
			datasets:['sessions','activities']
		},
		
		{
			display:'Attraction Types',
			property:'attractionType',
			values:[
				{display:"Airport",value:'airport'},
				{display:"Entertainment",value:'entertainment'},
				{display:"Hotel",value:'hotel'},
				{display:"Restaurant",value:'restaurant'}
			],
			datasets:['attractions']
		},
		{
			display:'Sponsor Types',
			property:'sponsorTypeID',
			values:function(){return App.getSponsorTypes();},
			datasets:['exhibitors']
		},
		{
			display:'Conference',
			property:'conferenceID',
			//values:__concurrentConferences,
			datasets:[]
		}
	]
	}//end func return



}

var __defaultDatasetViewModes__ = ['list','grid','map'];

var _appTemplates = {
	detailsHead:
				'<div class="app-details-head-title text-shadowed">${sessionTitle}</div>'+
				'${RUN[_renderSessionOfferings;${sessionID};]}',
				//'<div class="app-details-head-debug">offering: ${offeringID} of ${offeringCount}</div>'+
				//'<div class="app-details-head-debug">session: ${sessionID}</div>',
	detailsBody:
				//'<div class="app-details-body-title">${sessionDescription}</div>'+
				'<div class="app-details-body-content">${sessionDescription}</div>'+
				'${RUN[_renderSessionAssets;${sessionID};]}'
}
var appListTemplates = {
	'sessions':
		'<div class="app-list-item ${RUN[_inPlanner;${offeringID}]}" data-id="${offeringID}" onclick="App.showFeatureView(\'${offeringID}\')">'+
			'<div class="app-list-item-title">${sessionTitle}</div>'+
			
			'<div class="app-list-item-time">${RUN[formatTimeStrings;${startDate};${endDate};]} ${RUN[_renderOfferingCount;${offeringCount}]}</div>'+
			'<div class="app-list-item-location">room: ${room}</div>'+
			//'<div class="app-list-item-eventType">${eventTypeDescription}</div>'+
		'</div>',
	'conferences':
		'<div class="app-list-item" data-id="${conferenceID}" onclick="App.setConference(\'${conferenceID}\')">'+
			'<div class="app-list-item-title">${fullname}</div>'+
			'<div class="app-list-item-location">${country}</div>'+
			'<div class="app-list-item-time">${start_date} - ${end_date}</div>'+
		'</div>',
	'planner':
		'<div class="app-list-item inPlanner" data-id="${id}"  data-oid="${offeringID} " onclick="App.showFeatureView(\'${id}\')">'+
			'<div class="app-list-item-title">${title}</div>'+
			'<div class="app-list-item-time">${RUN[formatTimeStrings;${startdatetime};${enddatetime};]}</div>'+
			'<div class="app-list-item-location">location: ${location}</div>'+
			//'<div class="app-list-item-eventType">${description}</div>'+
		'</div>',
}