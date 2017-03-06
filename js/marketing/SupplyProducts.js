
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

//(2)点击产品追溯按钮，则删除当前产品追溯
function DeleteProductTrace(obj){
	$(obj).parents('.t_item').remove();
}

//(3-1)点击选择作物种类
function SelectCropnameFn(){
	$('.crop_species_box').show();
}
//(3-2)点击种类一级，二级弹出
function SelectLevel1(){
	$('.crop_species_box').hide();
	$('.crop_sort_box').show();
}
//(3-3)点击二级作物之后，关闭二级，并把值传给select_cropname=作物名称
function SelectLevel2(obj){
	var _val = $(obj).find('.num_name').html();
	$('.select_cropname').html(_val);
	$('.crop_sort_box').hide();
}

//(5)时间控件
var _dqdate = new Date();
var _dqyear= _dqdate.getFullYear();
var _dqmonth= _dqdate.getMonth() + 1;
if(_dqmonth<10){
	_dqmonth = '0'+_dqmonth;
}
var _dqday= _dqdate.getDate();
if(_dqday<10){
	_dqday = '0'+_dqday;
}
var _dqdaytime = _dqyear+'-'+_dqmonth+'-'+_dqday;//日

$("#iStarTime").datetimepicker({
    format: "yyyy-mm-dd",  /* 控制显示格式，默认为空，显示小时分钟 */
    autoclose: true,
    weekStart: 1,
   //startDate: "2014-08-14",
    language:  'zh-CN',
    startView: 3,
    minView: 2,
    maxView: 4,     
    pickerPosition: "bottom-left"
});
$("#iStarTime input").val(_dqdaytime);
$("#iEndTime").datetimepicker({
    format: "yyyy-mm-dd",  /* 控制显示格式，默认为空，显示小时分钟 */
    autoclose: true,
    weekStart: 1,
   //startDate: "2014-08-14",
    language:  'zh-CN',
    startView: 3,
    minView: 2,
    maxView: 4,     
    pickerPosition: "bottom-left"
});
$("#iEndTime input").val(_dqdaytime);

//(4-1)删除图片事件
function DeleteUploadImg (obj){
	$(obj).parents('.sitem').remove();
}
function DeleteUploadImgzs(obj){
	$(obj).parents('.sitem').remove();
}
/*//(4-2)#################################（上传图片--oss直传）
var oss_url = "http://img4.farmeasy.cn";
var bucket_type = "6";
var domain_url = "";
//产品图片上传
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

//产品图片
var uploaded_product_url = "";
function callback() {
	if(uploaded_product_url!=""){
		//图片路径
		alert(uploaded_product_url);
		//addAsset(uploaded_file_url,file_name);
		var _items = '<li class="sitem"><img class="pic_phone" src="'+uploaded_product_url+'" /><img class="pic_close" src="../../images/marketing/btn_close28.png" onclick="DeleteUploadImg(this)" /></li>';
		$('#uploadProduct_list').append(_items);
	}
};
//追溯图片
var uploaded_trace_url = "";
function callbackTrace() {
	if(uploaded_trace_url!=""){
		//图片路径
		alert(uploaded_trace_url);
		//addAsset(uploaded_file_url,file_name);
		var _items = '<li class="sitem"><img class="pic_phone" src="'+uploaded_trace_url+'" /><img class="pic_close" src="../../images/marketing/btn_close28.png" onclick="DeleteUploadImgzs(this)" /></li>';
		$('#uploadTrace_list').append(_items);
	}
};*/





