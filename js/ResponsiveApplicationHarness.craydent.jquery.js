// Responsive Application Harness Runtime
var console = window.console || {log:function(){}}
var App;
function ResponsiveApplicationHarness(specs){
		
/*--------------------------------------------------------------------------------------/
	0 | App Setup
---------------------------------------------------------------------------------------*/
	var self = this;
	App = this;
	
	var defaults={
		languageCode:'en'
	}
	this.DEVMODE = specs.devmode;
	this.config = RAHconfig();
	this.specs = $.extend({},defaults,(specs||{}));

/*-------------------------
	Add Modules
-------------------------*/		
	$.extend(this, 
		new DrawerController(self,{}), 
		new ViewController(self,{})
	);
		
	
/*-------------------------
	Init Paramse
-------------------------*/		
	this.GO = function(){
		this.initParams();
		this.renderAppFramework();
		this.renderContentFramework();
		this.initUI();
		
	}
	
	this.initParams = function(){
		this.views ={};
		this.initialLoad = true;
		this.Data = {};
		this.User = {myPlanner:{results:[],offeringIDs:[]}}
		this.current = {};
		this.current.view = this.getView($GET('view')) || this.getView(this.config.initialView);
		//getcurrent dataset
		if(this.current.view.dataset){
			this.current.dataset = this.current.view.dataset;
			this.current.dsObj = this.config.datasets[this.current.dataset];
		}
		
		this.current.viewDom = null;
		this.current.results = null;
		this.current.filters = {};
		
	}
	
	this.initUI = function(data){
		var loadFeature;
		if($GET('feature')){
			loadFeature = $GET('feature');
		}
		$.extend(self.Data,data);
		self.gotoView(self.current.view);
		self.updateUI();//update ui with data (recallable function
		//self.respond();
		
		if(loadFeature){
			//App.showFeatureView(loadFeature);
		}
	}
	

	this.updateUI = function(specs){
		var specs = specs || {};
		$(App.container)[0].className = 
		$(App.container)[0].className.replace(/[a-zA-Z]*-dataset/,self.current.dataset+'-dataset');
	//	self.menuDrawer.html(self.renderMenuDrawer(self.current.menu));
		
	//dob't show filter on nonSearchable	
/*		if(App.current.view.nonSearchable){
			$(App.container).addClass('non-searchable');
		}
		else{
			$(App.container).removeClass('non-searchable');
			self.filterDrawer.html(self.renderFilterDrawer(self.current.dataset));
		}*/
		
		
		//self.setMenuOption(App.current.view.id);
		self.showView();

	}
	
/*--------------------------------------------------------------------------------------/
	1 | Render
---------------------------------------------------------------------------------------*/
	this.renderAppFramework = function(){
		var html = 
		'<div id="appWrapper" class="init-view init-dataset">'
			
			+'<div id="appDrawers" ></div>'
			+'<div id="viewsPanel" >'
				+'<div id="viewsPanelHeader" class="ui-unselectable">'
					+this.renderHeaderButtons()
					+'<div id="viewsPanelTitle"></div>'
				+'</div>'
				+'<div id="viewsPanelContent"></div>'	
			+'</div>'
		+'</div>';
	
	$('body').attr('onhashchange','App.hashChangeHandler').html(html);
	
		self.container = $('#appWrapper');
		self.viewsPanel = $('#viewsPanel');
		self.viewsPanelHeader = $('#viewsPanelHeader');
		self.viewTitle = $('#viewsPanelTitle');
		self.viewsPanelContent = $('#viewsPanelContent');
		self.appDrawers = $('#appDrawers');
	}
	
	this.renderHeaderButtons = function(){
		var html="";
		var action;
		self.config.headerButtons.map(function(button){
			action = button.action || 'alert(\''+button.name+'\')';
			html+=
			'<div id="'+button.name+'HeaderButton" title="'+button.name+'" '
				+'class="header-panel-button '+(button.side||'left')+'-side" '
				+'onclick="'+action+'" >'
			
			+'</div>';
		})
		html += __clearDiv__;
		return html;
	}
	
	
	
	
	this.renderContentFramework = function(){
		var html = '';
		
	//render drawers
		var drawers = ['left','right'];
		var dl = drawers.length;
		for(var d=0;d<dl;d++ ){
			html+= this.renderAppDrawer(drawers[d]);
		}
		
		self.appDrawers.html(html);
		

	//render views
		this.renderBasicViewModes();
	//set internal variables
			//add internal references
/*		this.config.viewModes.map(function(view){
			self.views[view.mode] = $('#'+view.mode+'View');
		})*/
	
	
	
	//add event listeners
	}
	
	this.renderAppDrawer= function(sideID){
		var html=
		'<div id="'+sideID+'Drawer" class="app-drawer">'+
		'</div>';
		
		return html;
	}
/*--------------------------------------------------------------------------------------/
	I | INTERACTIONS
---------------------------------------------------------------------------------------*/
/*-------------------------
	Navigation
-------------------------*/	
	this.hashChangeHandler = function(evt){
		if(window.event.newURL.indexOf('feature=') != -1){//in oldurl
			if($GET('feature')){
			//	this.showFeatureView($GET('feature'));
			}
			return;
		}
		else if(window.event.oldURL.indexOf('feature=') != -1){//in old url
		//close if open
			//App.hideFeatureView();
			return;
		}
		
		var mode = $GET('mode');
		var dataset = $GET('dataset');
		
		var view = self.getView($GET('view')) || {}; 
		
	//remove or statement to default to closing app	
		self.current.view.mode = mode || view.defaultMode || 'list';
		self.current.view.dataset = dataset || view.dataset || 'conferences';
	
		self.current.dataset = self.current.view.dataset;
		self.current.dsObj = self.config.datasets[self.current.dataset];
		
		logit(self.current.view);
		
		self.updateUI();
		//App.respond({force:true});
		
	}
	

/*<div id="appWrapper" class="init-view init-dataset">
	<div id="menuDrawer" class="app-drawer"></div>
    <div id="filterDrawer" class="app-drawer"></div>
    <div id="viewsPanel" >
    	<div id="viewsPanelHeader">
            <div id="menuButton" class="headerDrawerToggle" onclick="App.toggleMenuDrawer();"> &nbsp; </div>
            <div id="filterButton" class="headerDrawerToggle" onclick="App.toggleFilterDrawer();"> filter </div>
            <div id="viewsPanelTitle"></div>
        </div>
        <div id="viewsPanelContent" onclick="App.closeDrawers()"></div>
    </div>
</div>*/

	this.GO();
	return this;

}


