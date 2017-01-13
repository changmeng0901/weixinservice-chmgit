<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" /> 
	<meta name="format-detection" content="telephone=no" />
	<title>绿色履历列表</title>
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/addedServices/commons.css">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/css/addedServices/resumeList.css">
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/jquery.lazyload.js"></script>
</head>
<body class="resumelist_body">
	<div class="search_header">
		<div class="search_block">
			<div class="public_search">
				<span class="octicon_search"></span>
				<input class="ipt_control" type="text" placeholder="请输入查询内容">
			</div>
			<div class="sort_btn" onclick="upORdown()">浏览量</div>
		</div>
	</div>
	<div class="resume_main">
		<!--履历列表1~5的板式 -->
		<ul class="resume_list first_list" style="display: none;">
		</ul>
		<!--履历列表6个以上的板式 -->
		<ul class="resume_list more_list" style="display: none;">
		</ul>
		<!--未购买提示 -->
		<div class="no_resume_list no_resume_list1" style="display: none;">
			<div class="nodata_center">
				<img src="<%=request.getContextPath() %>/images/addedServices/resumelist_nodata.png"/>
				<p> 您还未购买绿色履历，<br />
				请拨打客服电话<a class="txt_phone" href="javascript:;">400-8199-586</a>联系我们吧~</p>
			</div>
		</div>
		<!--未创建提示 -->
		<div class="no_resume_list no_resume_list2" style="display: none;">
			<div class="nodata_center">
				<img src="<%=request.getContextPath() %>/images/addedServices/resumelist_nodata.png"/>
				<p> 抱歉您还未创建绿色履历，<br />
				请登录义田帮手<a class="txt_link" href="http://www.farmeasy.cn">www.farmeasy.cn</a>制作吧！<br />
				如需帮助请联系您的服务顾问<br />
				或致电客服专线<a class="txt_phone" href="javascript:;">400-8199-586</a></p>
			</div>
		</div>
		<!--未创建提示 -->
	</div>
	
	
<input type="text" style="display: none;" id="resume_service_type" value="<%=request.getSession().getAttribute("resueme_service_type") %>"/>
<script type="text/javascript">
$(function(){
	var resume_service_type=$('#resume_service_type').val();
	if(resume_service_type=="null"){
		resume_service_type=1;
	}
	if(resume_service_type==1){
		myJsonData();
	}
	
	if(resume_service_type==2){
		$('.no_resume_list1').css('display','');
	}
	
	document.onkeydown=function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e.keyCode==13){
			myJsonData();
		}
	}; 
	
})

//加载数据
function myJsonData(){
	var search=$("[type='text']").val();
	var browseSort="";
	if($('.sort_btn').attr('class').indexOf('arrow_up')==-1){
		browseSort="down";
	}else{
		browseSort="up";
	}
	$.ajax({
		url : "../AddedServices/data",
		data : {'method':'resume','enterpriseInfoId':'85','search':search,'browseSort':browseSort},
		type : 'post',
		dataType : 'json',
		success : function(data){
			showData(data.result);
		},
		error : function() {
		}
	});
}

function showData(dataList){
	$('.first_list li').remove();
	$('.more_list li').remove();
	var data_length=dataList.length;
	if(data_length==0){
		$('.no_resume_list2').css('display','');
	}else{
		var result = eval(dataList);
		var class_name="";
		if(data_length<6){
			class_name="first_list";
			$('.first_list').css('display','');
		}else{
			class_name="more_list";
			$('.more_list').css('display','');
		}
		
		$(result).each(function(index, val){
			var str="";
			if(val.skin_url==""){
				str+="<li class='re_item'>";
			}else{
				str+="<li class='re_item' onclick=\"openresume('"+val.use_batch+"','"+val.skin_url+"')\">";
			}
			str+="<div class='re_info'>";
			str+="<div class='re_pic'>";
			if(class_name=="first_list"){
				if(val.img_url==""){
					str+="<img data-original='<%=request.getContextPath() %>/images/addedServices/resume_big.jpg'/>";
				}else{
					str+="<img data-original='"+val.img_url+"@604w_272h_1e_1c.src'/>";
				}
			}else{
				if(val.img_url==""){
					str+="<img data-original='<%=request.getContextPath() %>/images/addedServices/resume_small.jpg'/>";
				}else{
					str+="<img data-original='"+val.img_url+"@184w_142h_1e_1c.src'/>";
				}
			}
			str+="</div>";
			str+="<p class='re_name'>"+val.plant_name+"</p>";
			str+="<div class='re_foot'>";
			str+="<p><i class='i_use'></i>"+val.count_num+"次使用</p>";
			str+="<p><i class='i_opt'></i>"+val.ada_count_num+"次点赞</p>";
			str+="<p><i class='i_view'></i>"+val.cr_count_num+"次浏览</p>";
			str+="</div>";
			str+="</div>";
			str+="</li>";
			$("."+class_name).append(str);
			
		});
		$("img").lazyload({
			effect: "fadeIn"
		});
		$('body').scrollTop(1);
		$('body').scrollTop(0);
	}
}

function openresume(id,name){
	//window.location.href="http://cs1.nongchangyun.cn/"+name+".seam?useBatch="+id;
	//window.location.href="http://app.farmeasy.cn/"+name+".seam?useBatch="+id;
	window.location.href="http://localhost:8080/"+name+".seam?useBatch="+id;
}

function upORdown(){
	if($('.sort_btn').attr('class').indexOf('arrow_up')==-1){
		$('.sort_btn').attr('class','sort_btn arrow_up');
	}else{
		$('.sort_btn').attr('class','sort_btn');
	}
	myJsonData();
}

var ResizeSize = function (){
		var _html = document.documentElement;
		var _width = _html.getBoundingClientRect().width;
		//var _width = document.body.clientWidth;
		if(_width>=640){
			_width=640;
		}
		var _scale = _width/16 +'px';
		_html.style.fontSize = _scale;
	}
ResizeSize();
window.onresize = function (){
	ResizeSize();
}
</script>

</body>
</html>