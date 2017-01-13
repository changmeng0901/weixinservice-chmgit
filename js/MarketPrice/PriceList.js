

// 文本域获取焦点和失去焦点状态
/*$("input[type=text]").focus(function(){
    var txt_value = $(this).val();
    if(txt_value==this.defaultValue){
        $(this).val("");
    };
});*/
/* $("input[type=text]").blur(function(){
    var txt_value = $(this).val();
    if(txt_value==""){
        $(this).val(this.defaultValue);
    };
    $('#i_clear').hide();
});*/
$('#search_result').keyup(function(){ 
	$('#i_clear').show();
});
$('body').on("click","#i_clear",function(){
	alert(1)
    $("#search_result").val("");
});

//点击跳转到地点选择页面
var GotoSiteSelect = function(){
		window.location.href = 'SiteSelect.html';
	}

//点击跳转到品类选择页面
var GotoCategorySelect = function(){
		window.location.href = 'CategorySelect.html';
	}
//点击跳转到时间选择页面
var GotoDateSelect = function(){
		window.location.href = 'DateSelect.html';
	}

//关注与取消关注
var attention = function(obj){
		if($(obj).hasClass('aCur')){
			$(obj).removeClass('aCur');
			$('.tip_attention').html('已取消');
			$('.tip_attention').show();
			setTimeout(function(){
				$('.tip_attention').fadeOut();
			},500)
		}else{
			$(obj).addClass('aCur');
			$('.tip_attention').html('已关注');
			$('.tip_attention').show();
			setTimeout(function(){
				$('.tip_attention').fadeOut();
			},500)
		}
	}

window.nextFlag=true;
//翻页控制器
$(window).scroll(function(){
	var scrollPos = $(window).scrollTop(); //滚动条距离顶部距离
	var documentHeight = $(document).height();//页面文档高度
	var browserHeight = $(window).height(); //浏览器高度
/*		console.log("滚动条距离顶部距离:" + scrollPos);
	console.log("页面文档高度" + documentHeight);
	console.log("浏览器高度" + browserHeight);*/
	if(documentHeight - scrollPos <= browserHeight*2 && window.nextFlag){
		window.sessionStorage.pageIndex ++;
		
	}
});
