
var FontTimer;
FontSize();

// 文本域获取焦点和失去焦点状态
$("input[type=text]").not(".ipt_link").focus(function(){
    var txt_value = $(this).val();
    if(txt_value==this.defaultValue){
        $(this).val("");
    };
});
 $("input[type=text]").not(".ipt_link").blur(function(){
    var txt_value = $(this).val();
    if(txt_value==""){
        $(this).val(this.defaultValue);
    };
});

// 选项卡切换
$('.croplist_tabhd .items').each(function(index,elem){
    $('.croplist_tabhd .items').eq(0).addClass('cCur').siblings().removeClass('cCur');
     $('.croplist_tabbd .crop_content').eq(0).show().siblings().hide();
    $(elem).click(function(){
        $(elem).addClass('cCur').siblings().removeClass('cCur');
        $('.croplist_tabbd .crop_content').eq($(this).index()).show().siblings().hide();
    });
});

$(window).resize(function(){
	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );
});




// 计算不同分辨率下的文字大小
function FontSize(){
	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth>414?414:document.documentElement.clientWidth)/12)+'px';
}