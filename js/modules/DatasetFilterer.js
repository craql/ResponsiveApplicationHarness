// Filtering module

function DatasetFilterer(){
	var self = this;
/*--------------------------------------------------------------------------------------/
	RENDERING the drawer
---------------------------------------------------------------------------------------*/
	this.renderFilterDrawer = function(specs){
		var specs = $.extend({
			menu:'filtersMenu'
		},specs);
		
		//this.renderConferenceMenu = function(){
		
		var html = App.renderFiltersMenu();
		return html;
	}
	
	this.renderFiltersMenu = function(){
		var html="<div id='appFilterMenu'>";
		//results info
		var label = (App.current.dsObj && App.current.dsObj.plural.capitalize()) ||'';
		var count = (App.current.results || []).length;
			html+=
			'<div id="appFiltersInfo" class="app-menu-info">'+
				'<div id="appFilteredResultsCount">'+label+': '+count+'</div>'+
				'<div id="appFiltersInstructions">Adjust filters to refine results</div>'+
			'</div>';
			
			var act = 'onkeyup';
			//render keyword search
			html+=
			'<div id="appKeywordFilter">'+
				'<input type="text" id="keywordInput" value="'+(App.current.filters.keyword ||'')+'" '+
					'placeholder="keyword filter" '+act+'="App.keywordInputHandler(this)"/>'+	
			'</div>';
		
		//render filterables
		html+='<div id="appFilterables">';
		var ftemplate = 
		'<div data-id="${property}" class="app-filterable" onClick="App.selectFilterOption(\'${property}\')">${display} '+
			'<div class="filter-option-count">${count}</div>'+
		'</div>';
		var curFilterable;
			App.config.filters.map(function(filterable){
				if(filterable.datasets.indexOf(App.current.dataset) != -1){
					curFilterable = {count:(App.current.filters[filterable.property]||[]).length};
					html+= fillTemplate(ftemplate,$.extend(curFilterable,filterable));
				}
			})
		html+='</div>';
		
		//menu buttons
		html +='<div id="appFiltersButtons">'+
			'<div class="app-menudrawer-button" id="viewResultsButton" onclick="App.updateUI()">VIEW RESULTS</div>'+
			'<div class="app-menudrawer-button" id="clearFiltersButton" onclick="App.clearFiltersButton();">clear filters</div>'+
		'</div>';	
		
		html+='</div>';
		
		//filterable Options
		html +='<div id="appFilterableOptions"></div>';	

		return html;
	}	
	

	this.renderFilterableOptions = function(filterable){
		var clickEvent = ' onclick="App.filterOptionClickHandler(this);" ';
	
	//add filter label	
		var html = fillTemplate('<div data-id="${property}" id="appFilterableOptionsLabel" onClick="App.deselectFilterOption(\'${property}\');"> < ${display} '+
		'<div class="filter-option-count">0</div>'+
		'</div>',
		filterable);
		
		var allon = !(filterable.property in App.current.filters)?'active':'';
	//add select all
		html +='<div data-id="all" data-value="" data-filterable="'+filterable.property+'" class="app-filterable-option '+allon+' select-all" '+clickEvent+'> Select All </div>';
		
	//add scrollable div
	html+='<div class="app-filterable-options">';
	
		var optionTemplate = '<div data-id="${id}" data-value="${value}" data-filterable="'+filterable.property+'" class="app-filterable-option ${active}" onclick="App.filterOptionClickHandler(this);"> ${name}</div>';
		
		var values = filterable.values();
		values.map(function(value){
			
			value.name=  value.levelName || value.display || value.value;
			value.id = value.id || value.levelID;
			value.value = String(value.value || value.id);
			value.active = (App.current.filters[filterable.property] && App.current.filters[filterable.property].indexOf(value.value) != -1)?' active ':'';
			html+= fillTemplate(optionTemplate,value);
			//html+= '<div data-id="'+value.id+'" data-value="'+value.value+'" data-filterable="'+filterable.property+'" class="app-filterable-option" > '+()+'</div>'
		})
		
	html+='</div>';
		return html;
	}
/*--------------------------------------------------------------------------------------/
	INTERACTIONS | 
---------------------------------------------------------------------------------------*/
	this.selectFilterOption = function(property){
		var filterObj = App.getFilter(property);
		
		//add class to menu
		$('#filterDrawer').toggleClass('filter-selected');
		
		//update ui
		$('#appFilterableOptions').html(App.renderFilterableOptions(filterObj));
		//select current
		//$('#filterDrawer').find('.app-filterable-option[data-id="'+property+'"]').addClass('current');
	}
	this.deselectFilterOption = function(property){
		var filterObj = App.getFilter(property);
		
		//add class to menu
		$('#filterDrawer').toggleClass('filter-selected');
		
		//select current
		//$('#filterDrawer').find('.app-filterable-option[data-id="'+property+'"]').addClass('current');
	}
	
	this.clearFiltersButton = function(){
		App.current.filters = {};
		App.runFilters();
		App.current.results = this.filterDataset();
		//var results = this.filterDataset();
		$('#filterDrawer').html(this.renderFiltersMenu());
/*		var label = App.current.dsObj.plural.capitalize();
		$('#appFilteredResultsCount').html(label+': '+results.length);*/
	}
	
	
	
	this.keywordInputHandler = function(dom){
		App.setFilter('keyword',dom.value,true);
		//this.getDataset()
	}
	
/*-------------------------
	Filter Option Touches
-------------------------*/	
	
	this.addToFilterable = function(filter,value){
		App.current.filters[filter] = App.current.filters[filter] || [];
		App.current.filters[filter].push(value);
		App.runFilters();
		$('.app-filterable-option.select-all').removeClass('active');
		//$('.app-filterable[data-id="'+filter+'"], #appFilterableOptionsLabel').find('.filter-option-count').html(App.current.filters[filter].length);
	}
	
	this.removeFromFilterable = function(filter,value){
		App.current.filters[filter] = App.current.filters[filter] || [];
		App.current.filters[filter].remove(value);
	//remove object	
		if(App.current.filters[filter] && !App.current.filters[filter].length){
			delete App.current.filters[filter];
			$('.app-filterable-option.select-all').addClass('active');
		}
		App.runFilters();
		//$('.app-filterable[data-id="'+filter+'"], #appFilterableOptionsLabel').find('.filter-option-count').html(App.current.filters[filter].length);
	}
	
	this.clearFilter = function(filter){
		delete App.current.filters[filter];
	//remove object	
		App.runFilters();
	}
	
	this.setFilter = function(filter,value,overwrite){
		if(value != null){
			if(overwrite){
			App.current.filters[filter] = value;
			}
		}
		App.runFilters();
	}

	this.runFilters = function(){
		var results = this.filterDataset();
		var label = App.current.dsObj.plural.capitalize();
		$('#appFilteredResultsCount').html(label+': '+results.length);
	}
	
	this.filterOptionClickHandler = function(dom){
		logit($(dom).data('id'));
	//	var data2 = $(dom).data();
		var data = $(dom)[0].dataset;
		if(data.value){
			if(!$(dom).hasClass('active')){//not active
				App.addToFilterable(data.filterable,data.value);
			}
			else{
				App.removeFromFilterable(data.filterable,data.value);
			}
		
			$(dom).toggleClass('active');
		}
		else{
			App.clearFilter(data.filterable);
			$(dom).next('.app-filterable-options').find('.app-filterable-option.active').removeClass('active');
		}
		
		$('.app-filterable[data-id="'+data.filterable+'"], #appFilterableOptionsLabel').find('.filter-option-count').html((App.current.filters[data.filterable]||[]).length);
	}
/*-------------------------
	Filtering
-------------------------*/	
	this.filterDataset = function(dataset){
		dataset = dataset || App.getDataset(App.current.dataset);
		var dsObj = App.current.dsObj;
		var needles;
		if(App.current.filters.keyword){
			needles = App.getNeedles(App.current.filters.keyword);
		}
		var results = dataset.filter(function(result){
			//build haystack
			result.haystack = result.haystack || fillTemplate(dsObj.haystack,result);
			
			//keyword filter
			if(App.current.filters.keyword){
				for(var n = 0; n < needles.length; n++){
					if(result.haystack.indexOf(needles[n].trim()) == -1){
						return false;
					}
				}
			}
			
			//filterables
			var fArray,
			fobj;
			for(var f in App.current.filters){
				if (f != 'keyword' && App.current.filters[f].length){
					//logit(f);
					fArray = App.current.filters[f];
					fobj  =App.getFilter(f);
					if(fobj.propIsArray){
						if(!$(result[f].split(',')).filter(fArray).length){
							return false;
						}
					}
					else if(fArray.indexOf(result[f]) == -1){
						return false;//results value not in the filtered values array
					}
					
				}
			}
			
			//made it through all the filters		
			return true;
		})
		
		return results;
		
	}
	this.getNeedles = function(query){
		var needles = [];
		needles = query.replace(/,/gi,'').split(' ');
		return needles;
	}
	this.getFilter = function(prop){
		return App.config.filters.filter(function(filterable){
			return filterable.property == prop;	
		})[0]||false;
	}
/*--------------------------------------------------------------------------------------/
	GETTERS | get options based on conference data
---------------------------------------------------------------------------------------*/
	this.getSponsorTypes=function(){
		var extypes = {},
		exarray = [];
		App.Data.exhibitorsView.results.map(function(d){
			
			extypes[d.sponsorTypeName] = extypes[d.sponsorTypeName] || 
				{
					value:d.sponsorTypeName,
					id:d.sponsorTypeID,
					sequence:d.sequence
				}
		})
		for(var e in extypes){
			exarray.push(extypes[e]);
		}
		exarray.sortBy('sequence');// = earray.sort(complexSort('value'));
		return exarray;
	}
	
	this.getEventTypes=function(){
		var etypes = {},
		earray = [];
		
		var ds = App.getDataset(App.current.dataset);
		ds.map(function(d){
				etypes[d.eventTypeDescription] = etypes[d.eventTypeDescription] || {value:d.eventTypeDescription,id:d.eventTypeID}

		})
		for(var e in etypes){
			earray.push(etypes[e]);
		}
		earray.sortBy('value');// = earray.sort(complexSort('value'));
		return earray;
	}
/*	this.getTracks=function(data){
		var ttypes = {},
		tarray = [];
		data.map(function(d){
			if(d.eventTypeID != 19){
				etypes[d.eventTypeDescription] = etypes[d.eventTypeDescription] || {value:d.eventTypeDescription,id:d.eventTypeID}
			}
		})
		for(var e in etypes){
			earray.push(etypes[e]);
		}
		earray.sortBy('value');// = earray.sort(complexSort('value'));
		return earray;
	}*/
	this.getDays=function(){
		var days = {},
		darray = [],
		DT;
		var ds = App.getDataset(App.current.dataset);
		
			ds.map(function(d,i){
				DT = new Date(d.startMonth+'/'+d.startDay+'/'+d.startYear);	
				days[d.startDay] = days[d.startDay] || 
				{	
					DT:DT,
					value:d.dateID,
					//display:$c.format(DT,'l, F jS'),
					display:formatDate(d.startMonth,d.startDay,d.startYear),
					
					id:d.dateID+''//$c.format(DT,'Ymd')
				}
			})
			for(var d in days){
				//days[d].index = darray.length;
				darray.push(days[d]);
			}
		

		darray.sortBy('id');
		darray.map(function(d,i){d.index = i;})
		return darray;
	}
	
	this.getTopics=function(data){
		var ttypes = {},
		tarray = [];
		var ds = App.getDataset(App.current.dataset);
		ds.map(function(d){
				(d.tracks.replace(/ /gi,'').split(',') || []).map(function(track){
					if(track){
						ttypes[track] =ttypes[track] || {
							value:track,
							id:track,
							display:self.getTopic(track).trackName}
					}
				})
				
				//ttypes[t.eventTypeDescription] = ttypes[t.eventTypeDescription] || {value:t.eventTypeDescription,id:t.eventTypeID}
		})
		for(var t in ttypes){
			tarray.push(ttypes[t]);
		}
		tarray.sortBy('display');// = earray.sort(complexSort('value'));
		return tarray;
	}
	this.getTopic = function(id){
		return App.Data.tracks.results.filter(function(track){return track.trackID == id;})[0]||false;
	}
return this;	
}