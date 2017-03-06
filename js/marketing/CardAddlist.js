
// (1)浏览量按升序还是降序
function ViewsSortFn(obj,aClass){
	//默认UP是升序
	if( $(obj).attr('onoff')=='up' ){
		 $(obj).attr('onoff','down');
		 $(obj).addClass(aClass);
	}else{
		 $(obj).attr('onoff','up');
		 $(obj).removeClass(aClass);
	}
}

//(2)删除VIP卡片功能
function DeleteVIPFn(obj){
	$(obj).parents('.c_item').remove();
}

//(3)获取焦点和失去焦点
$('input[type=text]').focus(function(){
	var txt_val = $(this).val();
	if(txt_val==this.defaultValue){
		$(this).val('');
	}
});
$('input[type=text]').blur(function(){
	var txt_val = $(this).val();
	if(txt_val==''){
		$(this).val(this.defaultValue);
	}
});

//（4）添加名片 
$('#link_addcrop').click(function(){
	window.location.href = 'CardAdd.html';
});



