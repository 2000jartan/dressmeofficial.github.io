// UTILITY FUNCTIONS 

function IsNumeric(n) {
    return !isNaN(n);
}

function CommaFormatted(amount) {
    
	var delimiter = ","; 
	var i = parseFloat(amount);
	
	if(isNaN(i)) { return ''; }
	
	i = Math.abs(i);
	
	var minus = '';
	if (i < 0) { minus = '-'; }
	
	var n = new String(i);
	var a = [];
	
	while(n.length > 3)
	{
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	
	if (n.length > 0) { a.unshift(n); }
	
	n = a.join(delimiter);
	
	amount = "Rs." + minus + n;
	
	return amount;
	
}

// ORDER FORM UTILITY FUNCTIONS
function applyName(klass, product_id, numPallets, rowTotal) {
    var toAdd = jQuery("td." + klass).text();    
    var actualClass = jQuery("td." + klass).attr("rel");
    jQuery("input." + actualClass).attr("value", product_id+'-'+numPallets);    
}

function removeName(klass) {    
    var actualClass = jQuery("td." + klass).attr("rel");    
    jQuery("input." + actualClass).attr("value", "");    
}

function calProductTotal()
{
	var sub_total = 0; var discounts = []; var selectedProducts = 0;
	var discount_rows = jQuery("#discount_rows").val();
	var bal_amount = 0;
	
	var discounted_price_show = jQuery('input[name="discounted_price_show"]').val();
	
	jQuery("#order-table  .row-total-input").each(function(){
		var row_total = jQuery(this).val();
		var discount = jQuery(this).parent().parent().find("td.discount-per-pallet").text();
		if(row_total != '') {
			selectedProducts++;	
			sub_total = parseFloat(sub_total) + parseFloat(row_total);
			discount = discount.trim();
			/*if(discount > 0 && discounted_price_show == 0) {
				var discount_value = (row_total * discount) / 100;
				discount_value = Math.round(discount_value);
				bal_amount = parseFloat(row_total) - parseFloat(discount_value);
			}
			else {*/
				discount_value = row_total;
				bal_amount = row_total;
			//}				
			for(var d = 1; d <= discount_rows; d++) {
				var dis_id = "#discount"+d;
				var dis_value = jQuery(dis_id).val();
				if(dis_value == discount)
					discounts.push({discount : discount, row_total : row_total, discount_value : discount_value, bal_amount : bal_amount});
			}
		}
		
	});
	jQuery("#selected-product").val(selectedProducts);
	// discount total
	for(var d = 1; d <= discount_rows; d++) {
		var dis_id = "#discount"+d;
		var dis_value = jQuery(dis_id).val();
		var row_total = 0; var discount_total = 0; var balance_total = 0;
		for(var s = 0; s < discounts.length; s++) {
			if(discounts[s].discount == dis_value) {
				row_total = parseFloat(row_total) + parseFloat(discounts[s].row_total);
				discount_total = parseFloat(discount_total) + parseFloat(discounts[s].discount_value);
				balance_total = parseFloat(balance_total) + parseFloat(discounts[s].bal_amount);
			}
		}
		if(jQuery("#"+dis_value+"-discount_sub_total").length)
			jQuery("#"+dis_value+"-discount_sub_total").val(CommaFormatted(row_total));
		if(jQuery("#"+dis_value+"-discount_sub_total_top").length)	
			jQuery("#"+dis_value+"-discount_sub_total_top").val(CommaFormatted(row_total));
		if(jQuery("#"+dis_value+"-discount").length)	
			jQuery("#"+dis_value+"-discount").val(CommaFormatted(discount_total));
		if(jQuery("#"+dis_value+"-discount_top").length)	
		jQuery("#"+dis_value+"-discount_top").val(CommaFormatted(discount_total));
		if(jQuery("#"+dis_value+"-discount_payable_amounnt").length)
			jQuery("#"+dis_value+"-discount_payable_amounnt").val(CommaFormatted(balance_total));
		if(jQuery("#"+dis_value+"-discount_payable_amounnt_top").length)
			jQuery("#"+dis_value+"-discount_payable_amounnt_top").val(CommaFormatted(balance_total));
	}
	
	//overall total
	var pay_total = 0;
	for(var d = 1; d <= discount_rows; d++) {
		var dis_id = "#discount"+d;
		var discount = jQuery(dis_id).val();
		if(discount > 0) {			
			var discount_total = jQuery("#"+discount+"-discount_payable_amounnt").val();
			discount_total = discount_total.replace("Rs.","");	
			discount_total = discount_total.replace(/\,/g, '');
			if(pay_total > 0)
				pay_total = parseFloat(pay_total) + parseFloat(discount_total);
			else
				pay_total = parseFloat(discount_total);
		}	
		else {
			var discount_total = jQuery("#"+discount+"-discount").val();
			discount_total = discount_total.replace("Rs.","");	
			discount_total = discount_total.replace(/\,/g, '');
			if(pay_total > 0)
				pay_total = parseFloat(pay_total) + parseFloat(discount_total);
			else
				pay_total = parseFloat(discount_total);
		}
	}
	
	/*jQuery("#payable").val(CommaFormatted(pay_total));
	jQuery("#payable-amount").val(CommaFormatted(pay_total));*/
	
	//pay_total = calc(pay_total);
	pay_total = pay_total.toFixed(2);
	
	jQuery("#payable").val(pay_total);
	jQuery("#payable-amount").val(pay_total);
	var orderTotal = parseFloat(pay_total);	
	jQuery("#fc-price").attr("value", orderTotal);
	
}

function calc(pay_total) {
    var num = pay_total;
    var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
}

/*function set_order_table_top(){
	var div = jQuery('#topfix').position();
	var div_height = jQuery('#topfix').height();
	var div_pos = parseInt(div.top) + parseInt(div_height);
	
	jQuery(window).scroll(function(){
		var win_top = jQuery(window).scrollTop();	
		if(win_top > div_pos)
		  jQuery('#topfix').addClass('shipping_table_fixed');
		else
		  jQuery('#topfix').removeClass('shipping_table_fixed');
	});
}

jQuery(window).resize(function(){
	set_order_table_top();
});*/

// DOM READY
jQuery(function() {

    var inc = 1;
	
	//set_order_table_top();
	
	/*jQuery('.search').bind("change", function(){
		var search_val = jQuery(this).val();
		if(search_val != '') { console.log(search_val);
			jQuery("div.order_cover_div:contains('"+search_val+":first')").css({'border':'solid 2px pink'});
		}
	});*/
				
	jQuery(".mobile-nav").click(function(){
		jQuery(".collapse").toggle();
	});
	jQuery("#lightboxOverlay").click(function(){
		jQuery('.lb-container > iframe').remove();
	});
	/*jQuery(".product_image > img").click(function(){
        
		var src = jQuery(this).attr('src');
		var pos = jQuery(this).position();	
		var top = parseInt(pos.top) - 50;
		jQuery('#image_show').show();
		jQuery('#image_show').css("top", top);
		jQuery('#image_show > img').attr('src', src);
	});*/
	
jQuery("#image_show, #image_show > a").click(function(){
		jQuery('#image_show > img').attr('src', '');
		jQuery('#image_show').hide();
	});
	
	jQuery(".product_video > a > img").click(function(){
		jQuery('.lb-container > iframe').remove();
		var video_id = jQuery(this).attr('rel');
		if(video_id != '') {
			var pos = jQuery(this).position();	
			var top = parseInt(pos.top) - 50;
			//.lb-container
			//jQuery('#video_show').show();
			//jQuery('#video_show').css("top", top);
			//jQuery('#video_show > iframe').attr('src', 'https://www.youtube.com/embed/'+video_id);
			a=document.createElement("iframe");
			jQuery('.lb-container')[0].appendChild(a);
			jQuery('.lb-container > iframe').attr('src', 'https://www.youtube.com/embed/'+video_id);
			setTimeout(function(){
				jQuery('.lb-container > iframe').attr('style', jQuery('.lb-container > img')[0].getAttribute("style").replace("display:none;","")+"opacity:1;");
				jQuery('.lb-container > iframe').attr('allow',"autoplay; encrypted-media");
				jQuery('.lb-container > iframe').attr('allowfullscreen',"");
				jQuery('.lb-container > img')[0].setAttribute("style","display:none;");
				
			},1250);
			jQuery("#lightboxOverlay")[0].setAttribute("onclick","jQuery('.lb-container > iframe').remove();");
			jQuery("#lightbox")[0].setAttribute("onclick","jQuery('.lb-container > iframe').remove();");
		}
	});
	jQuery("#video_show, #video_show > a").click(function(){
		jQuery('#video_show > iframe').attr('src', '');
		jQuery('#video_show').hide();
	});

    jQuery(".product-title").each(function() {
        jQuery(this).addClass("prod-" + inc).attr("rel", "prod-" + inc);
		jQuery("#foxycart-order-form").append("<input type='hidden' name='prodname[]' value='' class='prod-" + inc + "' id='prod-" + inc + "' />" );
        inc++;    
         document.getElementById("totalsid").value = inc;
    });
    
    // Reset form on page load, optional
    jQuery("#order-table input[type=text]:not('#product-subtotal')").val("");
    jQuery("#product-subtotal").val("Rs.0");
	jQuery("#product-subtotal-top").val("Rs.0");
	var discount_rows = jQuery("#discount_rows").val();
	for(var d = 1; d <= discount_rows; d++) {
		var dis_id = "#discount"+d;
		var dis_value = jQuery(dis_id).val();
		jQuery("#"+dis_value+"-discount_sub_total").val("Rs.0");
		jQuery("#"+dis_value+"-discount_sub_total_top").val("Rs.0");
		jQuery("#"+dis_value+"-discount").val("Rs.0");
		jQuery("#"+dis_value+"-discount_top").val("Rs.0");
		if(jQuery("#"+dis_value+"-discount_payable_amounnt").length)
			jQuery("#"+dis_value+"-discount_payable_amounnt").val("Rs.0");
		if(jQuery("#"+dis_value+"-discount_payable_amounnt_top").length)
			jQuery("#"+dis_value+"-discount_payable_amounnt_top").val("Rs.0");	
	}
    jQuery("#payable-amount").val("Rs.0");
	jQuery("#payable").val("Rs.0");
	
	var action = 0;
    var quantity = "";
    // "The Math" is performed pretty much whenever anything happens in the quanity inputs - focus blur change keyup
    jQuery('.num-pallets-input').bind("focus blur change keyup", function(){
    
        // Caching the selector for efficiency 
        var $el = jQuery(this);
    
        // Grab the new quantity the user entered
		var numPallets = $el.val();
		if(numPallets != '')
		$el.val(parseInt(numPallets));
        if($el.val() == "NaN"){
            $el.val(0);
        }
        // Find the pricing
		
		var discounted_price_show = jQuery('input[name="discounted_price_show"]').val();
		var multiplier = "";
		if(discounted_price_show == 1) {
        	multiplier = $el.parent().parent().find("td.discounted_price").text();
		}
		else {
        	multiplier = $el.parent().parent().find("td.price-per-pallet").text();
		}
        multiplier = multiplier.trim();
		multiplier = multiplier.replace("Rs.","");
		multiplier = multiplier.replace(",","");
		if(parseInt(numPallets) <0){
			numPallets=0;
			$el.val(0);
		}
		if(parseInt(numPallets) > 100){
            status_handler("Quantity must be less than or equal to 100");
            timeout=setTimeout(status_handler_stop,5000,"Quantity must be less than or equal to 100");
			numPallets=0;
			$el.val(0);
		}
        // If the quantity is empty, reset everything back to empty
        if ( (numPallets == '') || (numPallets <= 0) ) {
			
            $el.removeClass("warning").parent().parent().find("td.row-total input").val("");
                
            var titleClass = $el.parent().parent().find("td.product-title").attr("rel");
            
            removeName(titleClass);
        
        // If the quantity is valid, calculate the row total
        } else if ( (IsNumeric(numPallets)) && (numPallets != '') && (numPallets > 0) ) {
			quantity = numPallets;
			action = 1;
			
			/*var multiple_of = $el.parent().parent().find(".multiple_of").val();			
			if(parseInt(multiple_of) != 0) {
				action = 1;
				numPallets = numPallets * multiple_of;
				if( (parseInt(numPallets) % parseInt(multiple_of)) == 0 ) {
					action = 1; 
				}
				else {
					action = 0;
				}
			}
			if(parseInt(multiple_of) == 0) {
				action = 1;
			}*/
			
			if(action == 1) {	
				var titleClass = $el.parent().parent().find("td.product-title").attr("rel");
				var product_id = $el.parent().parent().find("td.product-title").attr("id");
				var numbers = /^\d+$/;
				if(product_id.match(numbers)) {
					//var post_url = "admin/changes.php?order_product_id="+product_id;
					//jQuery.ajax({url: post_url, success: function(product_stock){
					//	if(numPallets <= product_stock || true) {
							var rowTotal = numPallets * multiplier;
							rowTotal = rowTotal.toFixed(2);
							$el.removeClass("warning").parent().parent().find("td.row-total input").val(rowTotal);
							applyName(titleClass, product_id, numPallets, rowTotal);
				//		}
				//		else
				//			alert('The quantity value should be within '+product_stock);
				//	}});
				}
				
				
			}
        
        // If the quantity is invalid, let the user know with UI change                                    
        } else {
        
            $el.addClass("warning").parent().parent().find("td.row-total input").val("");
            
            var titleClass = $el.parent().parent().find("td.product-title").attr("rel");
            
            removeName(titleClass);
                                          
        }
		
		//if(action == 1)
			calProductTotal();
    
    });

});

function valid_order() {	
	var name = document.getElementById('name').value;
	if(name == "") {
		alert('Enter the customer name');
		document.getElementById('name').focus();
		return false;
	}		
	var address = document.getElementById('address').value;
	if(address == "") {
		alert('Enter the customer address');
		document.getElementById('address').focus();
		return false;
	}
	var mobile = document.getElementById('mobile').value;
	if(mobile == "") {
		alert('Enter the customer mobile');
		document.getElementById('mobile').focus();
		return false;
	}
	var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	if (!mobile.match(phoneNum)) 
	{
		alert('Invalid phone number');
		document.getElementById('mobile').focus();
		return false;
	}
	var mail = document.getElementById('mail').value;
	if(mail == "") {
		alert('Enter the customer email');
		document.getElementById('mail').focus();
		return false;
	}
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (reg.test(mail) == false) 
	{
		alert('Invalid Email Address');
		document.getElementById('mail').focus();
		return false;
	}
	
	var total = document.getElementById('payable').value;
	var minimum_amount = document.getElementById('minimum_amount').value;
	total = total.replace("Rs.","");
	total = total.replace(",","");
	
	if(minimum_amount != 0) {
		if(parseInt(total) <= parseInt(minimum_amount)) {
			alert('Minimum Order Value Must Be Rs.'+minimum_amount);
			return false;
		}
	}
	return true;
}

//status 
timeout=0;
function status_handler(s){
    init_status();
    if(document.getElementById("status_pop").childNodes[1].classList.contains("load-complete"))
        document.getElementById("status_pop").childNodes[1].classList.remove("load-complete")
    if(document.getElementById("status_pop").childNodes[1].childNodes[0].style.display == "block")
        document.getElementById("status_pop").childNodes[1].childNodes[0].style.display="none";
    document.getElementById("status_pop").childNodes[0].innerHTML=""+s;
    document.getElementById("status_pop").classList.add("status_appear");
}
function status_tick(){
    document.getElementById("status_pop").childNodes[1].classList.toggle('load-complete')
    document.getElementById("status_pop").childNodes[1].childNodes[0].classList.toggle('d-block');
    //$('.').toggleClass('load-complete');
  //$('.checkmark').toggle();
}
function status_handler_stop(s){
    document.getElementById("status_pop").childNodes[0].innerHTML=""+s;
    document.getElementById("status_pop").classList.remove("status_appear");
}
function init_status(){
    clearTimeout(timeout);
    if(document.getElementById("status_pop") !=null){
        return;
        //document.getElementById("status_pop").remove();
    }
    div=document.createElement("div");
    div.id="status_pop";
    div.setAttribute("style","z-index: 99999;");
    div.classList.add("status_pop");
    h6=document.createElement("h6");
    h6.innerHTML="Working...";
    h6.style="margin-right: 2.5rem;"
    circle=document.createElement("div");
    circle.classList.add("circle-loader");
    check=document.createElement("div");
    check.classList.add("checkmark");
    check.classList.add("draw");
    circle.append(check);
    div.append(h6);div.append(circle);document.documentElement.append(div);
}

function show_product_image_video(obj) {
	var title = jQuery(obj).parent().find('.product_name').html();
	title = jQuery.trim(title)
	
	var image_src = "";
	if(jQuery(obj).find('img').length > 0) {
		image_src = jQuery(obj).find('img').attr('src');
	}
	if(image_src != "") {
		jQuery('.product_image_video_table').find('.product_image_video').html('<img src="'+image_src+'" style="max-width: 100%; max-height: 100%;">');
		jQuery('.product_image_video_table').find('.product_image').html('<img src="'+image_src+'" style="max-width: 100%; max-height: 100%;">');
		jQuery('.product_image_video_table').find('.product_image').attr("onclick", "Javascript:change_product_image(this);");
		jQuery('.product_image_video_table').find('.product_image').css({"cursor" : "pointer"});
	}
	
	var youtube_id = "";
	if(jQuery(obj).find('input[name="youtube_id"]').length > 0) {
		youtube_id = jQuery(obj).find('input[name="youtube_id"]').val();
	}
	if(youtube_id != "") {
		jQuery('.product_image_video_table').find('.product_video').html('<img src="http://img.youtube.com/vi/'+youtube_id+'/0.jpg" style="max-width: 100%; max-height: 100%;">');		
		jQuery('.product_image_video_table').find('.product_video').attr("onclick", "Javascript:change_product_video('"+youtube_id+"')");
		jQuery('.product_image_video_table').find('.product_video').css({"cursor" : "pointer"});
	}
	else {
		jQuery('.product_image_video_table').find('.product_video').html('');	
	}
	
	jQuery('#myModal .modal-title').html('');
	jQuery('#myModal .modal-title').html(title);
	
	jQuery('.product_image_video_button').trigger("click");
}
function change_product_image(obj) {
	var image = jQuery(obj).html();
	jQuery('.product_image_video_table').find('.product_image_video').html(image);
}
function change_product_video(youtube_id) {
	jQuery('.product_image_video_table').find('.product_image_video').html('<iframe src="https://www.youtube.com/embed/'+youtube_id+'" style="width: 100%; height: 100%;">');
}