// Responsivizer

function Responsivizer(specs){
	var self = this;
	this.specs = specs || {};
	this.multiViewActive = true;

	this.initResponsivizer = function(){
		
		var ldhDiv = "<div id='ldhdiv' class='ui-block' onclick='window.location=\"ldhtest.html\";'>LDH</div>";
	
	
		$('body')[0].onresize = self.respond;	
		//$('body').append('<div id="responsivizerDebug" onclick="App.toggleMultiView();"></div>' + ldhDiv)
		self.respond();
	}

	this.respond = function(specs){
		self.width = $(window).width();
		self.height = $(window).height();
		var multiview = '';
		var viewmode = '';
	//set device type
		
		if(self.width < 400){
			$('body').addClass('phone-mode').removeClass('tablet-mode').removeClass('desktop-mode');
			viewmode = 'phone'
		}
		else if(self.width < 1024){
			$('body').removeClass('phone-mode').addClass('tablet-mode').removeClass('desktop-mode');
			viewmode = 'tablet'
		}
		else{
			$('body').removeClass('phone-mode').removeClass('tablet-mode').addClass('desktop-mode');
			viewmode = 'desktop'
		}
	//multi-view	
		if(App && App.multiViewActive){	
			if(self.width >= 720 && (App && App.mappableDataset(App.current.view.dataset))){//activate multi-view
				multiview = ' multi-view';
				$('body').addClass('multi-view');
				App && App.showMultiViewMap(specs);
			//show list if multi-view and map is active	
				if(App && App.current.view.mode == "map"){
					App.setViewMode('list');
				}
				
			}
			else{
				$('body').removeClass('multi-view');	
				App && App.hideMultiViewMap();
			}
		}
		
		var html = 
			'<div><b>'+self.width+'</b> x <b>'+self.height+'</b>h</div>'
			
			//+'<a onclick="App.toggleMultiView();">toggle MV</a>';
		if (App){
			App.responsiveMessage = viewmode+multiview+html;
			$('#responsivizerDebug,#responsivizerSettings').html(App.responsiveMessage);
		}
	}

	this.toggleMultiView = function(){
			
			App.multiViewActive = !App.multiViewActive;
		if(App.multiViewActive){
		}
		else{
			//App.multiViewActive = !App.multiViewActive;
			$('body').removeClass('multi-view');	
			App && App.hideMultiViewMap();
		}
		App.setViewMode('list');
		App.respond();
	}
	//self.init();
	return this;
}