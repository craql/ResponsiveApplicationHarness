// RAH Drawers

function DrawerController(parent,specs){
	var self = parent;

/*--------------------------------------------------------------------------------------/
	1 | Render
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


/*--------------------------------------------------------------------------------------/
	2 | Interactions
---------------------------------------------------------------------------------------*/
	this.closeDrawers = function(){
		if( self.container.hasClass('show-left-drawer') || self.container.hasClass('show-right-drawer')){
			self.container
				.removeClass('show-left-drawer show-right-drawer');
      		mobileTween = new TweenMax.to(self.viewsPanel, .1, {css:{left:0}});
		}
	}
	
	this.toggleMenuDrawer = function(drawer,callback){
		var css = {left:280};
		var opposite = 'right';
		if(drawer == 'right'){
			css = {left:-280}
			opposite = 'left';
		}
		if( !self.container.hasClass('show-'+drawer+'-drawer')) {
			var openTween = new TweenMax.to($('#viewsPanel'), .1,
			{
				css:css,
				overwrite:'all',
				onStart:function(){
					//close popup menu
					$('.menu-drawer-popup.active').removeClass('active');
				},
				onComplete:function(){
					self.container
						.removeClass('show-'+opposite+'-drawer')
						.addClass('show-'+drawer+'-drawer');
					callback && callback();
					
				}
			});
			openTween.play();
				
		} 
	
	//closing the drawer	
		else {
			var closeTween = new TweenMax.to($('#viewsPanel'), .1, 
			{
				css:{left:0},
				overwrite:'all',
				onComplete:function(){
					self.container
						.removeClass('show-left-drawer')
						.removeClass('show-right-drawer');
					
					//close popup menu
					$('.menu-drawer-popup.active').removeClass('active');
					callback && callback();
				}
				
			});
			closeTween.play();
				
		}
	
	}
	return this;
}