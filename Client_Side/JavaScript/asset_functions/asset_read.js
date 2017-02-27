function loadAssets()
{
	/*
	Retrieves all assetIDs from the blockchain and formats the data to display on a web page. Need the address of the account 
	executing this request, at the moment this is hard coded in the html for each page. 
	*/
	var found = 0;
	var posLast = 0;
	var objects = [];
	var error = false;
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "/blockchain/assets/assets", true)
	xhr.overrideMimeType("text/plain");
	xhr.onprogress = function () {
		var data = xhr.responseText;
		var array = data.split("&&");
		console.log("asset data",data);
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].trim() != "")
			{
				var obj = JSON.parse(array[i]);
				var found = false;
				
				for(var j = 0; j < objects.length; j++)
				{
					if(objects[j].assetID == obj.assetID)
					{
						found = true;
						break;
					}
				}
				if(!found)
				{
					if(pgNm == "Miner")
					{
						if(obj.status == 0)
						{
							obj.clarity = '&lt;<i>clarity</i>&gt;';
							obj.diamondat = '&lt;<i>diamondat</i>&gt;';
							obj.cut = '&lt;<i>cut</i>&gt;';
							obj.colour = '&lt;<i>colour</i>&gt;';
							obj.date = '&lt;<i>date</i>&gt;';	
							obj.symmetry = '&lt;<i>symmetry</i>&gt;';
							obj.polish = '&lt;<i>polish</i>&gt;';
							obj.timestamp = '&lt;<i>timestamp</i>&gt;';		
							obj.jewellerytype = '&lt;<i>jewellerytype</i>&gt;';
							objects.push(obj);
						}
					}
					else
					{
						if(typeof obj.message == 'undefined' && obj.clarity > 0 && obj.diamondat.toLowerCase() != 'undefined' && obj.diamondat.trim() != '' && obj.cut.toLowerCase() != 'undefined' && obj.cut.trim() != '' && obj.Date.toLowerCase() != 'undefined' && obj.Date.trim() != '' && obj.colour.toLowerCase() != 'undefined' && obj.colour.trim() != '' && !obj.scrapped)
						{
							objects.push(obj)
						}
					}
					if(obj.hasOwnProperty("error"))
					{
						error = true
						$("#assetsTbl").append("Unable to load assets.");
					}
				}
			}
		}
		var plu = 'assets';
		if(objects.length == 1)
		{
			plu = 'asset';
		}
		$('.numFound').html(objects.length + ' ' + plu);
	}
	xhr.onreadystatechange = function (){
		if(xhr.readyState === 4)
		{
			if(!error)
			{
				$("#assetsTbl").empty();
				for(var i = 0; i < objects.length; i++)
				{
					var data = objects[i];
					$("#assetsTbl").append("<tr class='assetRw'><td class='clarity'>"+data.clarity+"</td><td class='assetDets' ><span class='diamondInfo'>" + data.diamondat + "</span><span class='diamondInfo'>" + data.cut + ", </span><span class='diamondInfo'>" + data.colour + ", </span><span class='diamondInfo'>" + data.date + "</span></td><td class='chkHldr'><span class='chkSpc' ></span><span class='chkBx' ></span><input class='isChk' type='hidden' value='false' /><input class='assetID' type='hidden' value='"+data.assetID+"' /></td></tr>");
				}
				changeBarSize();
			}
		}
	}
	xhr.send();
}

function loadUpdateAssets()
{
	/*
	Retrieves all assetIDs from the blockchain and formats the data to display on a web page. Need the address of the account 
	executing this request, at the moment this is hard coded in the html for each page. 
	*/
	var found = 0;
	var posLast = 0;
	var objects = [];
	var xhr = new XMLHttpRequest()
	xhr.open("GET", "/blockchain/assets/assets", true)
	xhr.overrideMimeType("text/plain");
	xhr.onprogress = function () {
		var data = xhr.responseText;
		var array = data.split("&&");
		
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].trim() != "")
			{
				var obj = JSON.parse(array[i]);
				var found = false;
				for(var j = 0; j < objects.length; j++)
				{
					if(objects[j].assetID == obj.assetID)
					{
						found = true;
						break;
					}
				}
				
				console.log("UPDATE ASSET READ:", obj)
				
				if(!found && typeof obj.message == 'undefined')
				{
					objects.push(obj)		
				}
			}
		}
		var plu = 'assets';
		if(objects.length == 1)
		{
			plu = 'asset';
		}
		$('#loaderMessages').html(objects.length + ' ' + plu);
	}
	xhr.onreadystatechange = function (){
		if(xhr.readyState === 4)
		{
			var d = objects;
			$('#loader').hide();
			$('#fade').hide();
			for(var i = 0; i < d.length; i++)
			{
				var data = d[i];
				if(data.clarity == 0) data.clarity = '&lt;<i>clarity</i>&gt;';
				if(data.diamondat.toLowerCase() == 'undefined' || data.diamondat.trim() == '') data.diamondat = '&lt;<i>diamondat</i>&gt;';
				if(data.cut.toLowerCase() == 'undefined' || data.cut.trim() == '') data.cut = '&lt;<i>cut</i>&gt;';
				if(data.date.toLowerCase() == 'undefined' || data.date.trim() == '') data.date = '&lt;<i>date</i>&gt;';
				if(data.colour.toLowerCase() == 'undefined' || data.colour.trim() == '') data.colour = '&lt;<i>colour</i>&gt;';
				$('<tr class="founddiamonds" ><td class="smlBrk"></td><td class="editRw" ><span class="diamondID">'+data.assetID+'</span></td><td class="editRw" colspan="2" >[<span class="diamondclarity">'+data.clarity+'</span>] <span class="diamonddiamondat">'+data.diamondat+'</span> <span class="diamondcut">'+data.cut+'</span>, <span class="diamondColour">'+data.colour+'</span>, <span class="diamondDate">'+data.date+'</span><span class="diamondtimestamp">'+data.Timestamp+'</span><span class="diamondSymmetry">'+data.Symmetry+'</span><span class="diamondPolish">'+data.Polish+'</span><span class="diamondjewellerytype">'+data.jewellerytype+'</span><img src="Icons/distributor/edit.svg" onclick="showEditTbl(this)" class="rtBtn" width="20" height="20" /></td><td class="smlBrk" ></td></tr>').insertAfter('#insAft');
			}
		}
	}
	xhr.send();	
}
