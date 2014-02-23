// RAH Views Controller

function ViewController(parent,specs){
	var self = parent;
/*--------------------------------------------------------------------------------------/
	1 | Render
---------------------------------------------------------------------------------------*/
	this.renderBasicViewModes = function(){
		var html = '';
		this.config.viewModes.map(function(view){
			html += self.initializeViewMode(view);
		})
		
		//return html;
		//add to dom
		self.viewsPanelContent.html(html);
		
		//add internal references
		this.config.viewModes.map(function(view){
			self.views[view.mode] = $('#'+view.mode+'View')
		})
	}
	
	this.initializeViewMode = function(view){
		//var dataset = view.dataset || 'None';
		var mode = view.mode || 'list';
		//var viewMode = self.getViewMode(mode); // view Mode object
		//var viewHasMenu = (viewMode.modes && viewMode.modes.length > 1)?'has-menu-bar':'';
		
		var html = 
		'<div id="'+mode+'View" class="app-view" >'+
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
	
	
	
	this.gotoView = function(view,callback){
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
	
	//set view deferred function
		if(callback){
			App.deferred.view = callback;
		}
		//commit hash change
		$COMMIT();
		//a hashchange will occur that will set the current view
	}
	
	this.showView = function(view){
		var view = view || self.current.view;
		if($.type(view) == 'string'){view = App.getView(App.config.defaultView);}
		
	//set app css view mode	
		var mode = view.mode || view.defaultMode || 'list';
		$(this.container)[0].className = 
		$(this.container)[0].className.replace(/[a-zA-Z]*-view/,mode+'-view');
		
		
		var dataset = view.dataset;
		self.current.dataset = dataset; 
		self.current.dsObj = App.config.datasets[dataset]; 
		//self.current.results = self.getResults(dataset);
		
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
		//if(viewMode.init){self[viewMode.init]();}
		
	
	//update map in multiview
		if(App.multiViewActive && $('body').hasClass('multi-view')){
			this.populateMap();
		}
	
	//update view header
	var titleHtml = '<div id="viewTitle">'+(view.title || view.dataset.capitalize())+'</div>';
	titleHtml += (self.Data.conference)?'<div id="viewSubTitle">'+App.Data.conference.results[0].fullname+'</div>':'';
	this.viewTitle.html(titleHtml);
	
	//fix to show menu when conference selected
	

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
	

	return this;
}