

//计算列表高度
var CalculateHeight = function(){
		var _h = $('.category_content').outerHeight()-$('.category_search').outerHeight();
		$('.category_list').height( _h );
	}
	CalculateHeight();
	
var GoBack = function(){
		history.go(-1);
	}
//一级点击事件
$('.level_once .o_item').each(function(index,elem){
	$(elem).click(function(){
		alert(index);
		$(elem).addClass('oCur').siblings().removeClass('oCur');
		$('.category_list .level_second').eq(index).show().siblings('.level_second').hide();
	});
});
//二级点击事件
$('.second_list .lei_name').each(function(index,elem){
	$(elem).click(function(){ 
		if( $(this).next('.lei_list').attr('onoff')=='true' ){
			//如果是true，说明是展开的，那么点击后收缩
			$(this).next('.lei_list').slideUp();
			$(this).next('.lei_list').attr('onoff','false');
		}else{
			//如果是false，说明是收缩的，那么点击后展开
			$(this).next('.lei_list').slideDown();
			$(this).next('.lei_list').attr('onoff','true');
		}
	});
});
//三级点击事件
$('.second_list .lei_crop').click(function(){
	if(  $(this).hasClass('cCur')  ){
		//如果是选中状态，则移除CLASS
		$(this).removeClass('cCur');
	}else{
		//如果是选中状态，则添加CLASS
		$(this).addClass('cCur');
		$(this).parents('.level_second').siblings('.level_second').find('.lei_crop').removeClass('cCur');
	}
});
	
//resize
$(window).resize(function(){
	CalculateHeight();
});

