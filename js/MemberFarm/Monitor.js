
var scriptAdd,
    player,
    FontTimer;
FontSize();


// 传感器数据--列表平均分配宽度
var windowWidth = document.documentElement.clientWidth;
var windowHeight= document.documentElement.clientHeight;

// 初始化视频
CreatVideo('0','http://farmeasy.cn/video/934/891/playlist.m3u8','../../images/MemberFarm/PlantDetail_temp1.jpg');

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
        cssWidthAndHeight : true,
        onSlideChangeEnd : function(){
            // 当swiper农事图片滑动的时候，重新生成对应的视频
            CreatVideo2(FarmSwiper.activeIndex ,'http://farmeasy.cn/video/934/891/playlist.m3u8','../../images/MemberFarm/PlantDetail_temp1.jpg');
        }
    });

$('.monitor_tabhd .items').each(function(index,elem){
    
    $(elem).click(function(){
        $(elem).addClass('cCur').siblings().removeClass('cCur');
        $(elem).attr('onoff','true').siblings().attr('onoff','fasle');
        $('.monitor_tabbd .tab_content').eq($(elem).index()).show().siblings().hide();
        if( $('.monitor_tabhd .items').eq(0).attr('onoff') == 'true' ){
            // swiper农事图片
            FarmSwiper.reInit();
            CreatVideo2(FarmSwiper.activeIndex,'http://farmeasy.cn/video/934/891/playlist.m3u8','../../images/MemberFarm/PlantDetail_temp1.jpg');
        }else if( $('.monitor_tabhd .items').eq(1).attr('onoff') == 'true' ){
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
        }else{
            // 视频追溯下的，重新生成对应的视频
            CreatVideo3(0 ,'http://farmeasy.cn/video/934/891/playlist.m3u8','../../images/MemberFarm/PlantDetail_temp1.jpg');

        }

        
    });
});



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

// 创建视频
function CreatVideo(videoItems,videoURL,imgURL){
    scriptAdd  = '<video id="live-video'+videoItems+'" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;" preload="auto" poster="'+imgURL+'" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
    $("#LiveVideoBlock"+videoItems).html(scriptAdd);
    player = videojs("live-video"+videoItems);
    player.play();
}
function CreatVideo2(videoItems,videoURL,imgURL){
    player.dispose();//清理
    scriptAdd  = '<video id="live-video'+videoItems+'" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;" preload="auto" poster="'+imgURL+'" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
    $("#LiveVideoBlock"+videoItems).html(scriptAdd);
    player = videojs("live-video"+videoItems);
    player.play();
}
function CreatVideo3(videoItems,videoURL,imgURL){
    player.dispose();//清理
    scriptAdd  = '<video id="track-video'+videoItems+'" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;" preload="auto" poster="'+imgURL+'" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
    $("#TraceVideoBlock"+videoItems).html(scriptAdd);
    player = videojs("track-video"+videoItems);
    player.play();
}