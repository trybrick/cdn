//////////////////////////// Table Sort/Reorder ////////////////////////////

//var itemids = ['table1', 'div1', 'div2'];
//	var BRAND = 'Brand:';
//	var PRICE = 'Price:';

function displaySelectedSort(){
	var value = $F('GenericProductTopLvlSelect');
	
	if(typeof(value) == undefined){
		return;
	}
	
	value = value.capitalize();

	var brand = $('GenericProductSelectContainer');
	var price = $('GenericProductPriceContainer');
	var relevance = $('GenericProductRelevanceContainer');
	
	if(value.blank()){
		if(brand != null){
			brand.style.display = 'none';
		}
		
		if(price != null){
			price.style.display = 'none';
		}
		
		if(relevance != null){
			relevance.style.display = 'none';
		}
	}
	
	switch(value){
		case 'Brand':
			if(brand != null){
				brand.selectedIndex = 0;
				brand.style.display = 'block';
			}
			if(price != null){
				price.style.display = 'none';
			}
			if(relevance != null){
				relevance.style.display = 'none';
			}			
			break;
		case 'Price':
			if(brand != null){
				brand.style.display = 'none';
			}
			if(price != null){
				price.selectedIndex = 0;
				price.style.display = 'block';
			}
			if(relevance != null){
				relevance.style.display = 'none';
			}			
			
			break;
		case 'Relevance':
			if(relevance != null){
				relevance.selectedIndex = 0;
				relevance.style.display = 'block';
			}
			if(brand != null){
				brand.style.display = 'none';
			}
			if(price != null){
				price.style.display = 'none';
			}		
			break;
		case 'Default':
			if(brand != null){
				brand.style.display = 'none';
			}
			if(price != null){
				price.style.display = 'none';
			}		
			break;
		default:
			break;
	}
	
}

function sortItemsByClassName(cname)
{
	var items = document.getElementsByClassName('sort');

    // Record the event.
    // SiteCatalyst_SortCouponByDepartment(cname);
	
	sortItems(cname, items);
}

function sortItems(cname, items){
	var data = cname.split(' ');
	
	for(var a=0; a < items.length; a++){
	
		try{
			var item = items[a];
			
			if(typeof(item) == undefined){
				continue;
			}
			
			var name = item.tagName.capitalize();
			
			if(name == 'Table'){
				sortTable(item.id, data[0], data[1]);
			}
			else if(name == 'Div'){
				sortDiv(item.id, data[0], data[1]);
			}
			else{ 
			}
		}
		catch(e){
			if(typeof console !== 'undefined') {
				console.log(e);
			}
			continue;
		}
	}
}

function sortProducts(sourceSelect){

	var items = document.getElementsByClassName('sort');
	var cname = $(sourceSelect).value;
	
	if(cname.blank()){
		return;
	}
	
	sortItems(cname, items);
	
}

function sortTable(tableid, xclassname, ascending){
	var tableElement = $(tableid);
	
	var allrows = $(tableid).rows;

	var pricerows = [];

	for(var i = 0; i < allrows.length; i++){
		row = allrows[i];
		
		addItemToSortToArray(pricerows, xclassname, row, i);
	}
	
	sortTableRows(tableid, allrows, pricerows, ascending);
}

function addItemToSortToArray(destination, xclassname, item, position){
	var array = [];
	var cname = item.className;
	var data = xclassname.split(':');
	
	var type = data[0].strip();
	
	var hash = new Hash();
	var classNames = item.className.split(' ');
	
	for(var i=0; i < classNames.length; i++){
	
		if(classNames[i].include(':')){
			var values = classNames[i].split(':');
			hash.set(values[0].strip(), values[1].strip());		
		}
	}
	
	if(!cname.blank()){
		switch(type){
			case 'Brand':
				value = data[1].strip();
				
				if(cname.include(value)){
					array = [1, position];
				}
				else{
					array = [0, position];
				}
				break;
				
			case 'Price':
				value = hash.get('Price');
				
				if(value != undefined && !value.blank())
				{
					array = [value, position]
				}
				else{
					//set a high value to sort to one end of the list
					array = [999.99, position];
				}
				break;
			case 'Relevance':
				value = hash.get('Relevance');
				array = [value, position];
				break;
			default:
				break;
		}
		
		if(typeof(array[0]) != undefined){
			destination.push(array);
		}
	}
}

function compareMultiArrayDesc(a, b){
	var a1 = a[0];
	var a2 = b[0];
	
	var n1 =  null;
	var n2 = null;
	
	try{
		n1 = new Number(a1);
		n2 = new Number(a2);
	}
	catch(e){
	}
	
	try{
		if(n1.toString() == 'NaN' || n2.toString() == 'NaN'){
			if(a1 < a2){
				return 1;
			} else if(a1 > a2){
				return -1;
			} else{
				return 0;
			}	
		}else{
			if(n1 < n2){
				return 1;
			} else if(n1 > n2){
				return -1;
			} else{
				return 0;
			}	
		}
	}
	catch(e){
	}
}

function compareMultiArrayAsc(a, b){
	var a1 = a[0];
	var a2 = b[0];
	
	var n1 =  null;
	var n2 = null;
	
	try{
		n1 = new Number(a1);
		n2 = new Number(a2);
	}
	catch(e){
	}
	
	try{
		if(n1.toString() == 'NaN' || n2.toString() == 'NaN'){
			if(a1 > a2){
				return 1;
			} else if(a1 < a2){
				return -1;
			} else{
				return 0;
			}	
		}else{
			if(n1 > n2){
				return 1;
			} else if(n1 < n2){
				return -1;
			} else{
				return 0;
			}	
		}
	}
	catch(e){	
	}
}

function formatGridRows(row, mod){
	if(row == undefined){
		return;
	}
	
	var classname = row.className;
	var finalclassname = '';
	
	if(mod == 0){
		finalclassname = classname.replace('GridAlternatingItem', 'GridItem');
	}
	else{
		finalclassname = classname.replace('GridItem', 'GridAlternatingItem');
	}
	
	row.className = finalclassname;
}

function doSort(basearray, sortarray, ascending){
	var sorted = [];
	
	if(ascending == 1){
		sortarray.sort(compareMultiArrayAsc);
	} else{
		sortarray.sort(compareMultiArrayDesc);
	}
	
	for(var i=0; i< sortarray.length; i++){
		var a1 = sortarray[i];
		var index = a1[1];
		
		var item = basearray[index];
		sorted.push(item);
	}
	
	return sorted;
}

function sortTableRows(tableid, allrows, rowArray, ascending){

	var sortedrows = doSort(allrows, rowArray, ascending);
	
	try{
		var table = $(tableid);
		
		var newTbody = document.createElement('tbody');
		var oldTbody = table.tBodies[0];
		
		var headerSelect = '#' + tableid + ' tbody tr.HeaderRow';
		var headerRows = $$(headerSelect);

		if (headerRows != null && headerRows.length > 0) {

		    for (var i = 0; i < headerRows.length; i++) {
		        newTbody.appendChild(headerRows[i].cloneNode(true));
		    }
		}
		else {
		    var headerrow = table.tBodies[0].rows[0];
		    newTbody.appendChild(headerrow.cloneNode(true));
		}
		
		for(var i = 0; i < sortedrows.length; i++){
			var row = sortedrows[i];
			var mod = i % 2;
			
			formatGridRows(row, mod);
			newTbody.appendChild(row.cloneNode(true));
		}
			
		table.replaceChild(newTbody, oldTbody);
	}
	catch(e){
		if(typeof console !== 'undefined') {
			console.log(e);
		}
	}
}

function sortDiv(divid, xclassname, ascending){
	var parentitem = $(divid);
	
	if(typeof(parentitem) == 'undefined' || parentitem == null){
		return;
	}
	
	var items = parentitem.childElements();
	
	if(typeof(items) == undefined){
		return;
	}
	
	var arraytosort = [];
	
	for(var i = 0; i < items.length; i++){
		var item = items[i];
		addItemToSortToArray(arraytosort, xclassname, item, i);
	}
	
	var sorted = doSort(items, arraytosort, ascending);
	
	for(var i=0; i < sorted.length; i++){
		var item = sorted[i];
		parentitem.removeChild(item);
	}
	
	for(var i=0; i < sorted.length; i++){
		var item = sorted[i];		
		parentitem.insert(item);
	}
}
