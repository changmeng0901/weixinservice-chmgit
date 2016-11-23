// JavaScript Document
/* date:2016-05-25 name:畜牧履历 */

$(function(){
	
	// 文本框获取焦点和失去焦点状态变化
    $('input[type=text],textarea').focus(function(){
        var txt_val = this.defaultValue;
        if( $(this).val() == txt_val ){
            $(this).val('');
        }
        $(this).css('color','#333')
    });
    $('input[type=text],textarea').blur(function(){
        var txt_val = this.defaultValue;
        if( $(this).val() == '' ){
            $(this).val( this.defaultValue );
            $(this).css('color','#aaa')
        }else{
            $(this).css('color','#333')
        }
    });
	
	
});


//-----------------------------在预加载之外的，封装的函数开始

	//开关按钮
	function OnoffFn( obj ){		
		 $( obj ).hasClass('onoff') ? $(obj).removeClass('onoff')	: $(obj).addClass('onoff')	
	}
	
	//开启模态框
	function OpenModal( modalBlock ){
		$( modalBlock ).show();
		$('.bg_mark').show();	
	}
	//关闭模态框
	function CloseModal( modalBlock ){
		$( modalBlock ).hide();
		$('.bg_mark').hide();	
	}
	



//-----------------------------在预加载之外的，封装的函数结束