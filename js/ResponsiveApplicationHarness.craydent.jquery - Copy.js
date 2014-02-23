// Responsive Application Harness Runtime
var console = window.console || {log:function(){}}
function PhoneGapEventsApp(specs){
		
/*--------------------------------------------------------------------------------------/
	0 | App Setup
---------------------------------------------------------------------------------------*/
	var self = this;
	var defaults={
		languageCode:'en'
	}
	this.DEVMODE = specs.devmode;
	this.config = PGEAconfig();
	this.specs = $.extend({},defaults,(specs||{}));
	
/*-------------------------
	Add View Classes
-------------------------*/		
	$.extend(this, 
		new DatasetFilterer(), 
		new AppMapView(),
		new AppListView(),
		new AppGridView(),
		new AppTextView(), 
		new AppDetailsView(), 
		new Responsivizer(), 
		new CcasHandler(),
		new UserHandler()
	);
		
	this.specs = $.extend({},defaults,this.specs);
/*-------------------------
	UI Items
-------------------------*/	
	this.container = $('#appWrapper');
	this.menuDrawer = $('#menuDrawer');
	this.filterDrawer = $('#filterDrawer');
	this.viewsPanel = $('#viewsPanel');
	this.viewsPanelHeader = $('#viewsPanelHeader');
	this.viewTitle = $('#viewsPanelTitle');
	this.viewsPanelContent = $('#viewsPanelContent');
	
	
	
	this.initParams = function(){
		this.views ={};
		this.initialLoad = true;
		this.Data = {};
		this.User = {myPlanner:{results:[],offeringIDs:[]}}
		this.current = {};
		this.current.view = this.getView($GET('view')) || this.getView('eventSelect');
		//getcurrent dataset
		if(this.current.view.dataset){
			this.current.dataset = this.current.view.dataset;
			this.current.dsObj = this.config.datasets[this.current.dataset];
		}
		
		//var view = this.getView(this.current.view);
		
		
		if($GET('con')){
			this.current.view.conference = $GET('con');
		}
	/*	this.current.view = {
			id:'conferenceSelect',
			title:'Select a Conference',
			mode:$GET('mode') || 'list',
			dataset:$GET('dataset') || 'conferences',
			conference:$GET('con')
		}*/
		this.current.menu = (this.current.view.conference)? 'conferenceMenu':'conferenceSelectMenu';
		this.current.conference = null;
		this.current.viewDom = null;
		this.current.results = null;
		
		//this.current.keyword = '';
		this.current.filters = {};
		
	}
	//this.initParams();
/*--------------------------------------------------------------------------------------/
	1 | App Init
---------------------------------------------------------------------------------------*/
	
	this.initApp = function(){
		this.initParams();
		
		var specs = {}
		specs.resturl =$GET('resturl')||'//cdh.esri.com';

	//for web mode	
		if(!this.Data.conferences){
			if (!PhoneGapMode) {
				logit("USING CDH");

				this.CDH = new ConferenceDataHandler(this,specs);
			//if a conference is already loaded or there is no conference in the URL
				//if(this.Data.conference || !this.current.view.conference){
			//scratch that, use if menu is the eventSelectMenu	
				if(this.current.menu == 'conferenceSelectMenu'){
					this.CDH.getGlobalData(self.initUI);
				}
				else{
					self.CDH.getWebAppData(this.current.view.conference,null,function(data){
						self.handleConferenceData(data);
						self.CDH.getGlobalData(self.initUI);
					})
				}	
			} else {
			
				function _LDHGlobalData() {
					self.LDH.readGlobalData(function(data) {
        				if ($.isEmptyObject(data)) {
        					console.log("LDH DOWNLOADING GLOBAL DATA");
        					self.LDH.downloadGlobalData(function(data) {

								// $.extend(self.Data, data);
								logit("confernces: " + data.conferences.results.length);
								self.initUI(data);
        					});
        				} else {
        					// console.log("read: " + JSON.stringify(data));
        					logit("READ LDH DATA");
							logit("confernces: " + data.conferences.results.length);							
							self.initUI(data);
        				}
        			});
				}

				console.log("USING LDH");
	            self.LDH = new LocalDataHandler();

				self.LDH.onDeviceReady();

            	if(this.current.menu == 'conferenceSelectMenu'){
					_LDHGlobalData();
            	} else {
            		
            		self.LDH.readConferenceData(self.current.view.conference, function(data){
						// self.handleConferenceData(data);
						// self.CDH.getGlobalData(self.initUI);

						if ($.isEmptyObject(data)) {
        					console.log("LDH DOWNLOADING CONFERENCE DATA");
        					self.LDH.downloadConference(self.current.view.conference, function(data) {

								// $.extend(self.Data, data);
								self.handleConferenceData(data);
								_LDHGlobalData();
        					});
        				} else {
        					self.LDH.readConferenceData(self.current.view.conference, function(data) {
								logit("READ LDH CONFERNCE DATA");
								self.handleConferenceData(data);
								_LDHGlobalData();								
        					});

        					
        				}
					});

            	}	            
			}			
		}
	
	//initresponsivizer
		this.initResponsivizer({debug:true});	
		
	//TODO: APp local storage mode	
	}
	
	this.initUI = function(data){
		var loadFeature;
		if($GET('feature')){
			loadFeature = $GET('feature');
		}
		$.extend(self.Data,data);
		// logit("INIT UI: " + JSON.stringify(self.Data));
		logit("conferences loaded: " + self.Data.conferences.results.length);
		self.renderUI();//create the dynamnic ui elements
		self.initHashChange();//tracking hash change for navigation
		self.gotoView(self.current.view);
		//self.initHashChange();//tracking hash change for navigation
		self.updateUI();//update ui with data (recallable function
		self.respond();
		
		if(loadFeature){
			App.showFeatureView(loadFeature);
		}
/*		document.addEventListener('backbutton', 
			function(){
				logit('went back');
			});*/
	}
	
	this.initHashChange = function(){
		//window.onhaschange = self.hashChangeHandler;
	}
	
	this.renderUI = function(){
		this.renderBasicViewModes();
	}
	this.updateUI = function(specs){
		var specs = specs || {};
		$(App.container)[0].className = 
		$(App.container)[0].className.replace(/[a-zA-Z]*-dataset/,self.current.dataset+'-dataset');
		self.menuDrawer.html(self.renderMenuDrawer(self.current.menu));
		self.filterDrawer.html(self.renderFilterDrawer(self.current.dataset));
		self.setMenuOption(App.current.view.id);
		self.showView();
		
	}
	
/*--------------------------------------------------------------------------------------/
	APPDATA | CDH or LDH
---------------------------------------------------------------------------------------*/
	this.handleConferenceData = function(data){
		$.extend(self.Data,data);
		/*                Conference Activity
                Conference Event
                Meals
                Breaks
                Site Visits
                Social Activities (let’s delete “Social Events”)
*/
		var activityIDs = ['19','13','34','36','35','14'];
		var activities = App.Data.sessionsView.results.filter(function(evt){
			return (activityIDs.indexOf(evt.eventTypeID) != -1);//in the array, is an activity
		})
			
		self.Data.activitiesView = {
			count:activities.length,
			dataset:'activitiesView',
			results:activities
			
		}
			
		App.getFloorsFromServices();
	}

/*--------------------------------------------------------------------------------------/
	MENU | MENU DRAWER
---------------------------------------------------------------------------------------*/
	this.renderMenuDrawer = function(menu,specs){
		var specs = specs || {};
		var menu = menu || 'conferenceSelectMenu';
		
		var menu = self.config.menus[menu];
		
		var html = 
		//'<div id="menuDrawerLabel">'+specs.menu+'</div>'+
	
	//render header toggles
		'<div id="menuDrawerHeader" class="app-drawer-header">'+
			App.renderSettingsBlock()+
			App.renderLoginBlock()+
		'</div>'+
		
		self[menu.renderFunction]()+
	
	//popup menus
		App.renderProfileMenu()+	
		App.renderLoginMenu()+
		App.renderSettingsMenu();
		
		return html;
	}
	

	
	this.setMenu = function(menuID){
		self.current.menu = menuID;
		self.menuDrawer.html(self.renderMenuDrawer(menuID));
		self.setMenuOption(App.current.view.id);
		//$('menu-option[data-id="'++'"]').addClass
	}
/*-------------------------
	Conference Select Menu
-------------------------*/		
	this.renderConferenceSelectMenu = function(){
		var html = '<div id="conferenceSelectList" class="menu-list">';
		var action ='onclick="App.selectConferenceAction(${conferenceID});"';
		
		var template =
			"<div class='menu-option' "+action+" data-id='conf${conferenceID}'>"+
				"<h4>${fullname}  | ${conferenceID}</h4>"+
				"<h6>${city}, ${state}, ${country}</h6>"+
			"</div>";
		
		html+= fillTemplate(template,self.Data.conferences.results);
		html+='</div>';
		return html;
	
	}
	this.selectConferenceAction = function(conid){
		App.holdMenuOpen = true; 
		App.setConference(conid);
	}
	
	this.setConference = function(conferenceID,hideMenu){
		self.setMenu('conferenceMenu');
		$SET('@con',conferenceID,'defer');
		$SET('@view','eventOverview','defer');
		$DEL('mode','defer');
		$DEL('dataset','defer');
		$COMMIT();
		
		App.setConferenceData(conferenceID);
		App.setMenuOption('conf'+conferenceID);
		App.setMenuOption('eventOverview');
	}
	
	this.setConferenceData = function(conferenceID){

		function _setLDHConference(data) {
			self.handleConferenceData(data);

			App.current.conference = App.Data.conferences.results.filter(function(con) {
				return con.conferenceID == conferenceID;				
			})[0];

			App.Data.conference = {dataset:"conference", count:1, results: [App.current.conference] };

			logit(JSON.stringify(App.current.conference));

			self.showView('eventOverview');
		}

	//if conference loaded
		if(App.current.conference && App.current.conference.conferenceID == conferenceID){
			self.getFloorsFromServices();
			self.showView('eventOverview');
		} else { 
			if (!PhoneGapMode) {
				App.CDH.getWebAppData(conferenceID,null,function(data){
					//App.getFloorsFromServices();
					App.handleConferenceData(data);
					App.current.conference = App.Data.conference.results[0];
					self.showView('eventOverview');
				});	
			} else {

				logit("loading LDH conference data: "+conferenceID);

				self.LDH.readConferenceData(conferenceID, function(data){

					if ($.isEmptyObject(data)) {
    					console.log("LDH DOWNLOADING CONFERENCE DATA");
	   					self.LDH.downloadConference(conferenceID, _setLDHConference);
    				} else {
    					_setLDHConference(data);
    				}
				});
			}
			
		// TODO: add LDH version 
		}
	}

/*-------------------------
	Conference Data Menu
-------------------------*/		
	this.renderConferenceMenu = function(){
		var menu = self.config.menus.conferenceMenu;
		var backaction = 'onclick="App.setMenu(\'conferenceSelectMenu\')"';
		var html = 
		'<div id="conferenceMenuList" class="menu-list">'+
		"<div class='menu-option' "+backaction+" >"+
				"<h5> < Select Conference</h5>"+
			"</div>";
			
		var action ='onclick="${action}(${params}); App.setMenuOption(\'${id}\');"';
		
		var template =
			"<div class='menu-option' "+action+" data-id='${id}'>"+
				"<h5>${title}</h5>"+
			"</div>";
		
		html+= fillTemplate(template,menu.menuItems);
		html+="</div>";
		return html;
	
	}
/*-------------------------
	Menu Uptions
-------------------------*/	
	this.setMenuOption = function(id){
		$('.menu-option[data-id="'+id+'"]').addClass('current').siblings('.menu-option').removeClass('current');
	}

/*--------------------------------------------------------------------------------------/
	VIEWS | Views Panel
---------------------------------------------------------------------------------------*/
	this.renderBasicViewModes = function(){
		var html = '';
		this.config.viewModes.map(function(view){
			html += self.renderBasicView(view);
		})
		
		//add to dom
		self.viewsPanelContent.html(html);
		
		//add internal references
		this.config.viewModes.map(function(view){
			self.views[view.mode] = $('#'+view.mode+'View')
		})
	}
	
	this.renderBasicView = function(view){
		var dataset = view.dataset || 'None';
		var mode = view.mode || 'list';
		var viewMode = self.getViewMode(mode); // view Mode object
		//var viewHasMenu = (viewMode.modes && viewMode.modes.length > 1)?'has-menu-bar':'';
		
		var html = 
		'<div id="'+mode+'View" class="app-view '+dataset+'-dataset " data-mode="'+mode+'" data-dataset="'+dataset+'">'+
		self.populateView(view)+	
		'</div>';
		return html;
	}
	
	this.populateView = function(view){
		var dataset = view.dataset || 'None';
		var mode = view.mode || view.defaultMode || 'list';
		var viewMode = self.getViewMode(mode); // view Mode object
		var viewLabel = mode.capitalize() +'View | data: '+dataset.capitalize();
		var rendering = view.viewTemplate ||( viewMode && viewMode.contentTemplate)|| '<h3>'+viewLabel+'</h3>';
		var menu = self.renderViewModesBar(view);
			
			return menu+fillTemplate(rendering,view);
	}
	
	this.getView = function(viewID){
		var view = (self.config.views[viewID])? $.extend({},self.config.views[viewID]) :false;
		return view;
	}
	
	this.getViewMode = function(mode){
		var viewMode = self.config.viewModes.filter(function(vm){return vm.mode == mode;})[0]||false;
		return viewMode;
	}
	
	this.renderViewModesBar = function(view){
		if(!view.modes || view.modes.length == 1){return '';}
		var curMode = self.current.view.mode || self.current.view.defaultMode;
		var cur;
		var action = function(mode){return 'onclick="App.setViewMode(\''+mode+'\')"'};
		var html = 
		'<div class="app-view-modes-bar">'+
			'<div class="app-view-modes-menu">';
			view.modes.map(function(mode){
				cur = (curMode == mode)?'current':'';
				html+='<div class="app-view-mode-option '+cur+'" '+action(mode)+'>'+mode+'</div>';
			})
		
		html+=	__clearDiv__+
			'</div>'+
		'</div>';
		
		return html;
	}
	
	
	
	this.gotoView = function(view,clearCon){
		if(!this.initialLoad){
			this.hideFeatureView();
			
		}
		else{
		this.initialLoad = false;
		}
		if($.type(view) == 'object'){
			var mode = (view.modes.indexOf(self.current.view.mode) == -1)?view.defaultMode:self.current.view.mode;
			//replace some properties for current view with passed
			this.current.view = $.extend({},this.current.view,view);
			//set properties for navigation and defer rerendering until all props loaded.
			$SET('@mode',mode,'defer');
			$SET('@dataset',this.current.view.dataset,'defer');
			$SET('@view',view.id,'defer');
		}
		else if($.type(view) == 'string'){
			var viewID = view;
			//replace some properties for current view with passed
			view = self.getView(view);
			view.mode = (view.modes.indexOf(self.current.view.mode) == -1)?view.defaultMode:self.current.view;
			this.current.view = view;
			this.current
			$DEL('mode','defer');
			$DEL('dataset','defer');
			$SET('@view',viewID,'defer');
			//this.current.view = $.extend(this.current.view,view);
		}
		
	//remove current conference
		if(clearCon){
			$DEL('con','defer');
		}
		
			
		//commit hash change
		$COMMIT();
	
		//a hashchange will occur that will set the current view
	}
	
	this.showView = function(view){
		var view = view || self.current.view;
		if($.type(view) == 'string'){view = App.getView('eventOverview');}
		
	//set app css view mode	
		var mode = view.mode || view.defaultMode || 'list';
		$(this.container)[0].className = 
		$(this.container)[0].className.replace(/[a-zA-Z]*-view/,mode+'-view');
		
		
		var dataset = view.dataset;
		self.current.dataset = dataset; 
		self.current.dsObj = App.config.datasets[dataset]; 
		self.current.results = self.getResults(dataset);
		
		var viewMode = self.getViewMode(mode);
	//unset previous view
		if(this.current.viewDom){
			this.current.viewDom.removeClass('current');
		}
	//set new view
		this.current.viewDom = this.views[mode];
		if(true){//TODO:find validator for if it's the same view already loaded
		//change view container specs
			this.current.viewDom.data({mode:mode,dataset:dataset});
			self.current.viewDom.html(self.populateView(view));
			
		}
		
		this.current.viewDom.addClass('current');
		if(viewMode.init){self[viewMode.init]();}
		
	
	//update map in multiview
		if(App.multiViewActive && $('body').hasClass('multi-view')){
			this.populateMap();
		}
	
	//update view header
	var titleHtml = '<div id="viewTitle">'+(view.title || view.dataset.capitalize())+'</div>';
	titleHtml += (self.Data.conference)?'<div id="viewSubTitle">'+App.Data.conference.results[0].fullname+'</div>':'';
	this.viewTitle.html(titleHtml);
	
	//fix to show menu when conference selected
	
	//this.closeDrawers();
	
		if(App && !App.holdMenuOpen){
			this.closeDrawers();
		}
		else if(App){
			App.holdMenuOpen = false;
		}
	}
	
	
	this.setViewMode = function(mode){
		$SET('@mode',mode);
		$(this.container)[0].className = 
		$(this.container)[0].className.replace(/[a-zA-Z]*-view/,mode+'-view');
	}
	
	
	this.renderView = function(view,specs){
		var view = view || this.current.view;
		var specs = specs || {};
		
		var html = 
		'<div>'+
			specs.menu+
		'</div>';
		return html;
	}
/*--------------------------------------------------------------------------------------/
	FEATURE | Showing and Hiding the Feature Popup
---------------------------------------------------------------------------------------*/	
	this.setFeature = function(feature,dataset){
		//TODO:add passaable feature object
		feature = feature || App.current.feature;
		dataset = dataset || App.current.dataset;
		
		App.current.feature = feature;
		featureObj = this.getDatasetFeature(feature,dataset);
		
		this.populateDetails(featureObj);
		
	}
	this.showFeatureView = function(feature,dataset){
		$SET('@feature',feature);
		this.setFeature(feature,dataset);
		$('#detailsView').show()
	}
	this.hideFeatureView = function(){
		$('#detailsView').hide();
		$DEL('feature');
		delete App.current.feature;
	}
/*--------------------------------------------------------------------------------------/
	FEATURE GETTERS
---------------------------------------------------------------------------------------*/	
	this.getDatasetFeature = function(id,dataset){
		dataset = dataset || App.current.dataset;
		var dsArr = App.getDataset(dataset);// array of records
		var dsObj = App.config.datasets[dataset]; //object of dataset specs
		var feature = dsArr.filter(function(f){return f[dsObj.idprop] == id;})[0] ||false;
	
		return feature;	
	}
	
	this.getConference = function(conid){
		//App.D
	}
/*--------------------------------------------------------------------------------------/
	SESSIONS | getters and setters and stuff...
---------------------------------------------------------------------------------------*/	
	this.getSessionAssets = function(sessionID)	{
		var assets = App.Data.sessionAssetsView.results.filter(function(asset){return asset.sessionID == sessionID;}).sortBy('sessionAssetSequenceNumber');
		return assets;
	}
	
	this.getSessionOfferings = function(sessionID){
		var offerings = App.Data.sessionsView.results.filter(function(offering){return offering.sessionID == sessionID;}).sortBy('sessionAssetSequenceNumber');
		return offerings;
	}
	

	
	
/*--------------------------------------------------------------------------------------/
	RESULTS | Getting and Filtering the Current Results
---------------------------------------------------------------------------------------*/	
	this.getDataset = function(dataset){
		dataset = dataset || App.current.dataset;
		switch(dataset){
			case 'planner':
				return self.User.myPlanner.results || [];
			break;
		case 'sessions':
			return self.Data.sessionsView.results;
		break;
		case 'exhibitors':
			return self.Data.exhibitorsView.results;
		break;
		case 'activities':
			return self.Data.activitiesView.results;
		break;
		case 'upcomingConferences':
			return App.Data.conferences.results.filter(function(con){return new Date(con.end_date) > new Date()});
		break;
		default:
			return (self.Data[dataset] && self.Data[dataset].results) ||[];
		break;
		}
	}
	
	this.getResults = function(dataset){
	//get the full dataset
		var dsArr = self.getDataset(dataset);
	
	//TODO:filter and sort results
		dsArr = App.filterDataset(dsArr)
		var label = App.current.dsObj.plural.capitalize();
		$('#appFilteredResultsCount').html(label+': '+dsArr.length);
		
		//create locations list
		if(App.mappableDataset(dataset)){			
			var locObj = {}; //object of locations
			var locName;
			dsArr.map(function(result){
				switch(dataset){
					case 'sessions':
					case 'activities':
						locName = result.room.trim(); 
					break;
					case 'exhibitors':
						locName = result.exhibitorBooth.trim(); 
					break;
					case 'planner':
						locName = (eval(result.custom.toLowerCase()))?'custom':result.location.trim(); 
					break;
				}
				locObj[locName] = locObj[locName] || 
				{
					results:[],
					name:locName,
					xPoint: result.xPoint,
					yPoint: result.yPoint,
					mapFloor: result['floor']
				} 
				locObj[locName].results.push(result);
			
			});
		//turn object into array
			var locArray = (dataset == 'attractions')?dsArr:[];//array of locations	
			var lObj, posRoom;
			for(var l in locObj){
				lObj = locObj[l];
				if(lObj.xPoint && lObj.yPoint ){//if no coords, don't show location
					lObj.index = locArray.length;
					locArray.push(lObj);
				}
				else if(l!= 'custom'){
					posRoom = this.getRoom(lObj.name);
					if(posRoom){//it is a room at the current event
						lObj.xPoint = posRoom.xPoint ;
						lObj.yPoint = posRoom.yPoint ;
						lObj.index = locArray.length;
						locArray.push(lObj);
					}
				}
			}
			
			App.Data.locations = {
				dataset:'locations',
				count:locArray.length,
				results:locArray.sortBy('name')
			}
		}
		return dsArr;
	}
	
	this.getRoom = function(locStr){
		locStr = (locStr && locStr.trim()) || '';
		return ((App.Data.rooms && App.Data.rooms.results) || []).filter(function(location){
			return location.roomName.trim() == locStr;
		})[0]||false;
	} 

	this.loc = function(str){
		return str;
	}
/*--------------------------------------------------------------------------------------/
	# | INTERACTIONS
---------------------------------------------------------------------------------------*/
/*-------------------------
	Navigation
-------------------------*/	
	this.hashChangeHandler = function(evt){
		if(window.event.newURL.indexOf('feature=') != -1){//in oldurl
			if($GET('feature')){
				this.showFeatureView($GET('feature'));
			}
			return;
		}
		else if(window.event.oldURL.indexOf('feature=') != -1){//in old url
		//close if open
			App.hideFeatureView();
			return;
		}
		
		var mode = $GET('mode');
		var dataset = $GET('dataset');
		
		var view = self.getView($GET('view')) || {}; 
	
	//remove or statement to default to closing app	
		self.current.view.mode = mode || view.defaultMode || 'list';
		self.current.view.dataset = dataset || view.dataset || 'conferences';
	
		self.current.dataset = self.current.view.dataset;
		self.current.dsObj = App.config.datasets[App.current.dataset];
		logit('view');
		self.updateUI();
		App.respond({force:true});
		
		//$GET('view')
	}
	
/*-------------------------
	Drawer Toggles
-------------------------*/	
	this.closeDrawers = function(){
		if( self.container.hasClass('show-filter-panel') || self.container.hasClass('show-menu-panel')){
			self.container
				.removeClass('show-filter-panel show-menu-panel');
      		mobileTween = new TweenMax.to($('#viewsPanel'), .1, {css:{left:0}});
		}
	}
	this.toggleMenuDrawer = function(show){

		if( !self.container.hasClass('show-menu-panel')) {
			mobileTween = new TweenMax.to($('#viewsPanel'), .1, {css:{left:280}});
			mobileTween.play();
			
			self.container
				.removeClass('show-filter-panel')
				.addClass('show-menu-panel');
				
		} 
		else {
			reverseTween = new TweenMax.to($('#viewsPanel'), .1, {css:{left:0}});
			reverseTween.play();
			
			self.container
				.removeClass('show-filter-panel')
				.removeClass('show-menu-panel');
				
		}

	}
	
	this.toggleFilterDrawer = function(show){
		
    if( !self.container.hasClass('show-filter-panel')) {
      mobileTween = new TweenMax.to($('#viewsPanel'), .1, {css:{left:-280}});
      mobileTween.play();
      
      self.container
			.removeClass('show-menu-panel')
			.addClass('show-filter-panel');
	$('#filterDrawer').removeClass('filter-selected');
			
    } else {
      reverseTween = new TweenMax.to($('#viewsPanel'), .1, {css:{left:0},onComplete:App.updateUI});
      reverseTween.play();
      
      self.container
			.removeClass('show-menu-panel')
			.removeClass('show-filter-panel');
		
		//App.populateMap();
      
    }
    
	}
	
	
	this.initApp();
	return this;

}

var __clearDiv__ ='<div class="clear"></div>';


function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value+ "; path=/";
}




function UTCcheck(){
	var s = new Date();
	return (s.getUTCSeconds() + (s.getUTCMilliseconds()/1000));
}


function formatTime(sHour,sMin,eHour,eMin,day,month,year){
	var sFormat = ((App.current.feature) || (App.current.view == "list"))?'g:ia':'D g:ia';
	//var date =(__MWAref.current.sortBy.primary == 'startDay')?'':(new Date(month+'/'+day+'/'+year)).format('D')+' ';
	var start =$c.format(new Date(month+'/'+day+'/'+year+' '+sHour+':'+sMin),sFormat);
	var end =$c.format(new Date(month+'/'+day+'/'+year+' '+eHour+':'+eMin),"g:ia");
	return start+' - '+end;
}
function formatTimeStrings(startDT,endDT, stFormat){
	var sFormat = stFormat || ( ((App.current.feature) || (App.current.view.mode == "list"))?'g:ia':'D g:ia' );
	var start =$c.format($c.toDateTime(startDT),sFormat);
	var end =$c.format($c.toDateTime(endDT),"g:ia");
	return start+' - '+end;
}

function formatDateString(dateStr,format){
	var f;
	//return $c.format((new Date(month+'/'+day+'/'+year)),'l, F jS');
	if(App.specs.languageCode == 'en'){
		f = format || 'l, F jS';
		return $c.format($c.toDateTime(dateStr),f);
	}
	/*else{
		var d = new Date(month+'/'+day+'/'+year);
		var dloc = App.loc($c.format(d,'l'));
		var mloc = App.loc($c.format(d,'F'));
		
	return dloc +', '+mloc +' '+ $c.format(d,'j');
	}*/
}
function formatDate(month,day,year){
	//return $c.format((new Date(month+'/'+day+'/'+year)),'l, F jS');
	if(App.specs.languageCode == 'en'){
		return $c.format((new Date(month+'/'+day+'/'+year)),'l, F jS');
	}
	/*else{
		var d = new Date(month+'/'+day+'/'+year);
		var dloc = App.loc($c.format(d,'l'));
		var mloc = App.loc($c.format(d,'F'));
		
	return dloc +', '+mloc +' '+ $c.format(d,'j');
	}*/
}