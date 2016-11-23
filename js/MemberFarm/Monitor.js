
var FontTimer;
FontSize();


// 传感器数据--列表平均分配宽度
var windowWidth = document.documentElement.clientWidth;
var windowHeight= document.documentElement.clientHeight;


// tab切换
// 初始化
$('.monitor_tabhd .items').eq(0).addClass('cCur').siblings().removeClass('cCur');
$('.monitor_tabhd .items').eq(0).attr('onoff','true').siblings().attr('onoff','fasle');
$('.monitor_tabbd .tab_content').eq(0).show().siblings().hide();
// swiper农事图片
        var swiperTabLen = $('.monitor_tabhd .items').length;
         var FarmSwiper;
        $('#swiper_live .swiper-wrapper').css({
            'width' : windowWidth * swiperTabLen
        })
        $('#swiper_live .swiper-slide').css({
            'width' : windowWidth
        })
        FarmSwiper = new Swiper('#swiper_live',{
                loop : false,
                pagination : '.pagination',
                cssWidthAndHeight : true
            });

$('.monitor_tabhd .items').each(function(index,elem){
    
    $(elem).click(function(){
        $(elem).addClass('cCur').siblings().removeClass('cCur');
        $(elem).attr('onoff','true').siblings().attr('onoff','fasle');
        $('.monitor_tabbd .tab_content').eq($(elem).index()).show().siblings().hide();
        if( $('.monitor_tabhd .items').eq(0).attr('onoff') == 'true' ){
            // swiper农事图片
            FarmSwiper.reInit();
        }
        if( $('.monitor_tabhd .items').eq(1).attr('onoff') == 'true' ){
            // swiper环境实况-拍摄的图片
            var swiperTakeLen = $('#swiper_takePhotos .swiper-slide').length;
            var TakeSwiper;
            $('#swiper_takePhotos .swiper-wrapper').css({
                'width' : windowWidth * swiperTakeLen
            })
            $('#swiper_takePhotos .swiper-slide').css({
                'width' : windowWidth
            })
            TakeSwiper = new Swiper('#swiper_takePhotos',{
                    loop : false,
                    cssWidthAndHeight : true,
                    onSlideChangeEnd: function(swiper){
                        $('#takeNum').html( TakeSwiper.activeIndex+1 );
                        $('#takeTotal').html( swiperTakeLen );
                        $( "#slider-range-max" ).slider( "value", TakeSwiper.activeIndex );
                    }
                });
            $('#takeNum').html( TakeSwiper.activeIndex+1 );
            $('#takeTotal').html( swiperTakeLen );

            $( "#slider-range-max" ).slider({  //滑块控制控件
                    range: "max",
                    min: 0,
                    max: swiperTakeLen-1,
                    step: 1,
                    slide: function( event, ui ) {
                        TakeSwiper.setWrapperTranslate(-windowWidth*ui.value,0,0);
                        $('#swiper_takePhotos .swiper-slide').eq(ui.value).addClass('swiper-slide-visible swiper-slide-active')
                        .siblings().removeClass('swiper-slide-visible swiper-slide-active');
                        $('#takeNum').html( ui.value+1 );
                        $('#takeTotal').html( swiperTakeLen );
                        $( "#amount" ).val( ui.value );
                    }
            });
        }
    });
});


// swiper环境实况-拍摄的图片
/*var swiperTakeLen = $('#swiper_takePhotos .swiper-slide').length;
$('#swiper_takePhotos .swiper-wrapper').css({
    'width' : windowWidth * swiperTakeLen
})
$('#swiper_takePhotos .swiper-slide').css({
    'width' : windowWidth
})
var TakeSwiper = new Swiper('#swiper_takePhotos',{
        loop : false,
        pagination : '.take_page',
        cssWidthAndHeight : true
      });*/
// swiper农事图片
/*var swiperTabLen = $('.monitor_tabhd .items').length;
$('#swiper_live .swiper-wrapper').css({
    'width' : windowWidth * swiperTabLen
})
$('#swiper_live .swiper-slide').css({
    'width' : windowWidth
})
var FarmSwiper = new Swiper('#swiper_live',{
        loop : false,
        pagination : '.pagination',
        cssWidthAndHeight : true
      });*/





// ---------------------------------------------------------------------------
// 浏览器变化时执行
$(window).resize(function(){
	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );
});


// ---------------------------------------------------------------------------
// 计算不同分辨率下的文字大小
function FontSize(){
	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth>414?414:document.documentElement.clientWidth)/12)+'px';
}

