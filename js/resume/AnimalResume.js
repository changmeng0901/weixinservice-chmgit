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
	

	
	//会员加入和我要购买事件函数
	function addModal(oModal,oBtn,oCloseBtn){
		$(oBtn).click(function(){
			$(oModal).show();
			$('body').css('overflow','hidden');
		});
		$(oCloseBtn).click(function(){
			$(oModal).hide();
			$('body').css('overflow','auto');	
		});	
	}
	addModal('#modal_member','#member_abtn','.close_btn');//会员加入
	addModal('#modal_wantbuy','#wantbuy_abtn','.close_btn');//我要购买
	addModal('#modal_sharepack','#sharepack_aBtn','.know_btn');//分享红包
	
	
	//农场主档案板块--环境图片
	var EnLen = $('.farm_envior .f_pic').length;
	$('.farm_envior font').html( EnLen );
	$('.farm_envior .f_pic').each(function(f_index, elem) {
        $(elem).click(function(){
			$('#swiper_envior').show();
			$('body').css('overflow','hidden');
			$('.swiper-container').css('height','100%');  // 最外层的swiper
			var EnSwiper = new Swiper('#swiper_envior', {
				pagination: false,  //分页器去掉
				spaceBetween: 30,
				centeredSlides: true, //默认false第一块居左，设置为true后居中
				autoplay: false,
				autoplayDisableOnInteraction: false,
				//mode : 'vertical',
				mousewheelControl: true,
				onFirstInit: function( EnSwiper ){ //Swiper2.x的回调函数，首次初始化后执行,初始化是onFirstInit,
					swiperAnimateCache( EnSwiper ); //隐藏动画元素 
					swiperAnimate( EnSwiper ); //初始化完成开始动画
					$('#swiper_envior .n_cur').html( $(elem).index());
					$('#swiper_envior .n_total').html( EnLen );
				}, 
				onSlideChangeEnd: function(swiper){ 
					swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
					$('#swiper_envior .n_cur').html( EnSwiper.activeIndex+1);
					$('#swiper_envior .n_total').html( EnLen );
				},
				initialSlide : f_index   //设定初始化时slide的索引
			});
		});
    });
	$('#swiper_envior .slide_img').click(function(){
		//点击图片让其关闭slider，但点击文字不关闭slider
		$('#swiper_envior').hide();
		$('body').css('overflow','auto');
	});
	
	
	//农场主档案板块--饲料
	var FeedTitle = [
		"牛的有机饲料1",
		"牛的有机饲料2",
		"牛的有机饲料3",
		"牛的有机饲料4"
	];
	var FeedIntro = [
		"料科技进步和养牛生产实践证明",
		"挖掘饲料的营养潜力、科学合理利用饲料、不断提高饲料利用效率、不断提高饲料利用效率、不断提高饲料利用效率、不断提高饲料利用效率不断提高饲料利用效率、不断提高饲料利用效率",
		"不仅可以降低养牛生产的饲料成本",
		"而且也可以降低养牛生产的营养成本"
	];
	var FeedLen = $('#graphics_bd1 li').length;
	$('#graphics_bd1 li').each(function(g_index, elem) {
        $(elem).click(function(){
			$('#swiper_feed').show();
			$('body').css('overflow','hidden');
			$('.swiper-container').css('height','100%');  // 最外层的swiper
			var FeedSwiper = new Swiper('#swiper_feed', {
				pagination: false,  //分页器去掉
				spaceBetween: 30,
				centeredSlides: true, //默认false第一块居左，设置为true后居中
				autoplay: false,
				autoplayDisableOnInteraction: false,
				//mode : 'vertical',
				mousewheelControl: true,
				onFirstInit: function( FeedSwiper ){ //Swiper2.x的回调函数，首次初始化后执行,初始化是onFirstInit,
					swiperAnimateCache( FeedSwiper ); //隐藏动画元素 
					swiperAnimate( FeedSwiper ); //初始化完成开始动画
					$('#swiper_feed .encior_title').html( FeedTitle[$(elem).index()] );
					$('#swiper_feed .text_introduce span').html( FeedIntro[$(elem).index()] );
					$('#swiper_feed .n_cur').html( $(elem).index()+1);
					$('#swiper_feed .n_total').html( FeedLen );
				}, 
				onSlideChangeEnd: function(swiper){ 
					swiperAnimate( FeedSwiper ); //每个slide切换结束时也运行当前slide动画
					$('#swiper_feed .encior_title').html( FeedTitle[FeedSwiper.activeIndex] );
					$('#swiper_feed .text_introduce span').html( FeedIntro[FeedSwiper.activeIndex] );
					$('#swiper_feed .n_cur').html( FeedSwiper.activeIndex+1);
					$('#swiper_feed .n_total').html( FeedLen );
				},
				initialSlide : g_index   //设定初始化时slide的索引
			});
		});
    });
	$('#swiper_feed .slide_img').click(function(){
		//点击图片让其关闭slider，但点击文字不关闭slider
		$('#swiper_feed').hide();
		$('body').css('overflow','auto');
	});
	
	
	
});


//-----------------------------在预加载之外的，封装的函数开始

	//click_showbtn+id点击时，#modal_block+id显示【弹窗在底部居中】
	function BottomModalShow(id){
		$('#modal_b_block'+id).show();
		$('body').css('overflow','hidden');	//禁掉网页滑动
	}
	
	//click_hidebtn+id点击时，#modal_block+id隐藏
	function BottomModalHide(id){
		$('#modal_b_block'+id).hide();
		$('body').css('overflow','auto'); //开启网页滑动	
	}
	
	//评分
	function ratingFn(indexParam){
		 $("#scoreId").val(indexParam);
		 for ( var i = 1; i < 6; i++) {
			if(parseInt(i)<=parseInt(indexParam)){
				$(".star" + i).attr("src","../images/resume/star1_01.jpg");
			}else{
				$(".star" + i).attr("src","../images/resume/star1_03.jpg");
			}
		}
	}



//-----------------------------在预加载之外的，封装的函数结束