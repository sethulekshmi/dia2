var selRw;
$(document).ready(function(){
	loadLogo(pgNm);
	
	$("#cclPg").click(function(){
		window.location.href = "index.html";
	})

	$(document).on('click', '.userHldr', function(){	
		$('.founddiamonds').remove();
		$('#loaderMessages').html('0 assets')
		$('#loader').show();
		$('#fade').show();		
		loadUpdateAssets()
	});

})

function showEditTbl(el)
{
	$('#chooseOptTbl').fadeIn(1000);
	$('#fade').fadeIn(1000);
	$('#assetID').val($(el).parent().parent().find('.diamondID').html());
	if($(el).siblings('.diamondclarity').html() != '&lt;<i>clarity</i>&gt;')
	{
		$('#clarity').prop('readonly', true);
		$('#clarity').css('cursor', 'not-allowed');
	}
	else
	{
		$('#clarity').prop('readonly', false);
		$('#clarity').css('cursor', 'text');
	}
	var clarity = $(el).siblings('.diamondclarity').html()
	if(clarity == '&lt;<i>clarity</i>&gt;')
	{
		clarity = 0;
	}
	var diamondat = $(el).siblings('.diamonddiamondat').html()
	if(diamondat == '&lt;<i>diamondat</i>&gt;')
	{
		diamondat = 'undefined'
	}
	var cut = $(el).siblings('.diamondcut').html()
	if(cut == '&lt;<i>cut</i>&gt;')
	{
		cut = 'undefined'
	}
	var colour = $(el).siblings('.diamondColour').html()
	if(colour == '&lt;<i>colour</i>&gt;')
	{
		colour = 'undefined'
	}
	var reg = $(el).siblings('.diamondDate').html()
	if(date == '&lt;<i>date</i>&gt;')
	{
		date = 'undefined'
	}
var symmetry = $(el).siblings('.diamondSymmetry').html()
	if(symmetry == '&lt;<i>symmetry</i>&gt;')
	{
		symmetry= 'undefined'
	}
var polish = $(el).siblings('.diamondPolish').html()
	if(polish == '&lt;<i>polish</i>&gt;')
	{
		polish = 'undefined'
	}
var timestamp = $(el).siblings('.diamondTimestamp').html()
	if(timestamp == '&lt;<i>timestamp</i>&gt;')
	{
		timestamp = 'undefined'
	}
var JewelleryType = $(el).siblings('.diamondJewelleryType ').html()
	if(JewelleryType  == '&lt;<i>JewelleryType </i>&gt;')
	{
		JewelleryType  = 'undefined'
	}




	$('#clarity').val(clarity);
	$('#diamondat').val(diamondat);
	$('#cut').val(cut);
	$('#colour').val(colour);
	$('#date').val(date);
$('#timestamp').val(timestamp);
$('#symmetry').val(symmetry);
$('#polish').val(polish);
$('#JewelleryType').val(JewelleryType);


	
	$('#hidclarity').val(clarity);
	$('#hiddiamondat').val(diamondat);
	$('#hidcut').val(cut);
	$('#hidColour').val(colour);
$('#hidsymmetry').val(symmetry);
$('#hidpolish').val(polish);
$('#hidJewelleryType').val(JewelleryType);
$('#hidtimestamp').val(timestamp);
	$('#hiddate').val(date.toUpperCase());
}

function closeEditTbl()
{
	$('#chooseOptTbl').hide();
	$('#errorRw').hide();
	$('#fade').hide();
}

function validate(el)
{
	
	/*
	Validation on if details have been filled in for updating a diamond. This is not validation on what the person is allowed to update,
	that is done within the contract on the blockchain.
	*/
	
	$('#errorRw').html('<ul></ul>');
	var failed = false;
	if(isNaN(parseInt($('#clarity').val().trim())))
	{
		$('#errorRw').find('ul').append('<li>clarity must be a number</li>')
		failed = true;
	}
	if($('#clarity').val().trim().length != 15 && $('#clarity').val().trim() != 0)
	{
		
		$('#errorRw').find('ul').append('<li>clarity must be 15 characters (Currently ' + $('#clarity').val().trim().length + ' characters)</li>')
		failed = true;
	}
	if($('#clarity').val().trim() == 0 && $('#hidclarity').val().trim() != 0)
	{
		$('#errorRw').find('ul').append('<li>clarity cannot be reset to 0</li>')
		failed = true;
	}
	if($('#diamondat').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>diamondat cannot be blank</li>')
		failed = true;
	}
	if($('#diamondat').val().trim().toLowerCase() == 'undefined' && $('#hiddiamondat').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>diamondat cannot be reset to undefined</li>')
		failed = true;
	}
	if($('#cut').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>cut cannot be blank</li>')
		failed = true;
	}
	if($('#cut').val().trim().toLowerCase() == 'undefined' && $('#hidcut').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>cut cannot be reset to undefined</li>')
		failed = true;
	}
	if($('#colour').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>Colour cannot be blank</li>')
		failed = true;
	}
	if($('#colour').val().trim().toLowerCase() == 'undefined' && $('#hidColour').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>Colour cannot be reset to undefined</li>')
		failed = true;
	}
	if($('#reg').val().trim() == '')
	{
		$('#errorRw').find('ul').append('<li>Registration cannot be blank</li>')
		failed = true;
	}
	if($('#reg').val().trim().toLowerCase() == 'undefined' && $('#hidReg').val().trim().toLowerCase() != 'undefined')
	{
		$('#errorRw').find('ul').append('<li>Registration cannot be reset to undefined</li>')
		failed = true;
	}
	if(!failed)
	{
		$('#errorRw').hide();
		updateAsset($('#clarity').val().trim(), $('#diamondat').val().trim(), $('#cut').val().trim(), $('#colour').val().trim(), $('#reg').val().trim().toUpperCase(), $('#assetID').val(), el)
	}
	else
	{
		$('#errorRw').show();
	}
}
