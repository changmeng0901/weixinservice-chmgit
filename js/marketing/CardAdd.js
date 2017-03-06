
//(1)获取焦点和失去焦点
$('input[type=text],textarea').focus(function(){
	var txt_val = $(this).val();
	if(txt_val==this.defaultValue){
		$(this).val('');
	}
});
$('input[type=text],textarea').blur(function(){
	var txt_val = $(this).val();
	if(txt_val==''){
		$(this).val(this.defaultValue);
	}
});

//(2-1)点击实时预览按钮，弹出小屏实时预览板块
$('#fixed_preview').click(function(){
	$('.mark_w50').show();
	$('#live_preview').addClass('small_preview').show();
});
//(2-2)
$('.view_screen').click(function(){
	if($(this).attr('onoff')=='small'){
		//点击全屏显示按钮，实时预览板块样式变成大屏的
		$('.mark_w50').addClass('mark_b50');
		$(this).attr('onoff','screen');
		$(this).removeClass('view_small');
		$('#live_preview').removeClass('small_preview');
	}else{
		//点击小屏显示按钮，实时预览板块样式变成小屏的
		$('.mark_w50').removeClass('mark_b50');
		$(this).attr('onoff','small');
		$(this).addClass('view_small');
		$('#live_preview').addClass('small_preview');
	}
});
//(2-3)点击关闭实时预览，实时预览关闭的同时变为默认小屏状态
$('#live_preview .close_view').click(function(){
	$('.mark_w50').hide();
	$('#live_preview').hide();
	$('.mark_w50').removeClass('mark_b50');
	$('.view_screen').attr('onoff','small');
	$('.view_screen').addClass('view_small');
	$('#live_preview').addClass('small_preview');
});

//(3)点击供应产品里的按钮，则删除当前产品
$('.supply_product_list .btn_delete').bind('click',function(event){
	$(this).parents('.t_item').remove();
	event.stopPropagation();
})
$('.supply_product_list .t_item').bind('click',function(event){
	window.location.href = 'SupplyProducts.html';
	event.stopPropagation();
})

//(5)生成我的数字名片
function CreateMyCardFn(){
	window.location.href = 'CardAddlist.html';
}


//(4-1)删除图片事件
var DeleteUploadImg = function(obj)
	{
		$(obj).parents('.sitem').remove();
	}
//(4-2)#################################（上传图片--oss直传）
var oss_url = "http://img4.farmeasy.cn";
var bucket_type = "6";
var domain_url = "";
//基地相册图片上传
var filters1 = {
   		mime_types : [ //允许上传图片和zip,rar文件以及视频文件
                  { 
                  	title : "Image files", 
                  	extensions : "jpg,jpeg,gif,png,bmp" 
                  },
                  ],
                  max_file_size : "5mb", //最大只能上传5mb的文件
                  prevent_duplicates : false //不允许选取重复文件
              };
function apply(obj){
	var entId='2';//#{sessionTake.getEnterpriseInfoId()}    【获取到的企业ID】
	set_upload_param(uploader1, '', false,obj,entId);
};

//基地相册
var uploaded_base_url = "";
function callback() {
	if(uploaded_base_url!=""){
		//图片路径
		alert(uploaded_base_url);
		//addAsset(uploaded_file_url,file_name);
		var _items = '<li class="sitem"><img class="pic_phone" src="'+uploaded_base_url+'" /><img class="pic_close" src="../../images/marketing/btn_close28.png" onclick="DeleteUploadImg(this)" /></li>';
		$('#uploadbase_list').append(_items);
	}
};
//基地荣誉
var uploaded_honor_url = "";
function callbackHonor() {
	if(uploaded_honor_url!=""){
		//图片路径
		alert(uploaded_honor_url);
		//addAsset(uploaded_file_url,file_name);
		var _items = '<li class="sitem"><img class="pic_phone" src="'+uploaded_honor_url+'" /><img class="pic_close" src="../../images/marketing/btn_close28.png" onclick="DeleteUploadImg(this)" /></li>';
		$('#uploadhonor_list').append(_items);
	}
};





