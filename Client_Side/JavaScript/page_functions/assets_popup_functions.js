$(document).ready(function(){

	$('#addToAssets').click(function(){
	
		setCookie();
		$("#assetsTbl").html('<tr><td style="text-align:center;"><img src="Images/'+pgNm+'/loading.gif" height="50" width="50" alt="loading" text="please wait..." /><br /><i>Found: <span class="numFound">0 assets</span></i></td></tr>');
		$('#chooseOptTbl').fadeIn(1000);
		$('#fade').fadeIn(1000);
		loadAssets();
	})
	$('#cclOpt').click(function(){
		$('#chooseOptTbl').hide();
		$('#fade').hide();
	})
	$('#clsOpt').click(function(){
		$('#chooseOptTbl').hide();
		$('#fade').hide();
	})
	
	$("#doneOpt").on('click', function(){
		$('.assetRw').each(function(){
			if($(this).find('.isChk').val() == "true")
			{
				var exists = false;
				var rw = $(this);
				$('.selassetRw').each(function(){
					if($(this).find('.assetID').val() == $(rw).find('.assetID').val())
					{
						exists = true;
					}
				})
				if(!exists)
				{
					$(this).find('.isChk').val('false')
					$(this).find('.chkBx').css('background-image','url("")')
					var nwRw = $(this).html().replace('<span class="chkSpc"></span><span style="background-image: url(&quot;&quot;);" class="chkBx"></span><input class="isChk" value="false" type="hidden">', '<span onclick="removeRowFromSelectedAssets(this)" style="float:right; margin-right:10px; cursor:pointer;"><img src="Icons/'+pgNm+'/minus.svg" width="15" /></span>')
					$("#selAssetsTbl").append('<tr class="selassetRw">' + nwRw + '</tr>');
				}
			}
		})
		$('#chooseOptTbl').hide();
		$('#fade').hide();
		changeBarSize();
	});
})

function removeRowFromSelectedAssets(el)
{
	$(el).parent().parent().remove();
	$('#selAssetsTbl').parent().css('margin-top','0px');
	$('#selAssetsTbl').parent().parent().siblings('.scrlHldr').children('.scrlBr').css('top', "0px")
	changeBarSize();
}
