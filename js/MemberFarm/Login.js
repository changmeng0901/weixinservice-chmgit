$(function(){

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

    // 验证手机号码
    var re= /^(13[0-9]|15[012356789]|17[01236789]|18[0-9]|14[57])[0-9]{8}$/;
    function checkPhone(phone){
        if( phone == '' || phone == '请输入手机号' ){

        }
    }

    function checkPhone(phone){
        if(""==phone || "请输入手机号"==phone){
            jQuery(".i_tip").eq(0).html("请输入手机号");
            jQuery(".i_danger").eq(0).css("display","block");
            jQuery(".i_tip").eq(0).css("display","block");
            unameStr = "1";
        }else if(!re.test(phone) || phone.length != 11){
            jQuery(".i_tip").eq(0).html("您输入的手机号格式不正确");
            jQuery(".i_danger").eq(0).css("display","block");
            jQuery(".i_tip").eq(0).css("display","block");
            unameStr = "1";
        }else{
            checkUnameMe(phone);
        }       
    }

$(window).resize(function(){
	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );
});

});


// 计算不同分辨率下的文字大小
function FontSize(){
	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth>414?414:document.documentElement.clientWidth)/12)+'px';
}