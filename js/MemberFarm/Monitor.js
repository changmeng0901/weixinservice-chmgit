
var scriptAdd,
    player,
    FontTimer,
    makeParameterMethod,
    makeParameterField,
    makeParameterVerify,
    pageUrl;
FontSize();


// 传感器数据--列表平均分配宽度
var windowWidth = document.documentElement.clientWidth;
var windowHeight= document.documentElement.clientHeight;

// ajax 
var iframeSearch = location.search.split('&');
var getVideoId = iframeSearch[0].split('=')[1];
var getVerify = iframeSearch[1].split('=')[1];
var getTestUrl = iframeSearch[2].split("=")[1];
makeParameterMethod = function(string){
    var Method = '&method=' + string;
    return Method;
}
makeParameterField = function(videoId,ID){
    return encodeURI('&field={"'+videoId+'":"'+ID+'"}');
}
makeParameterField2 = function(realPlantId,ID ,videoDuration,Duration){
    return encodeURI('&field={"'+realPlantId+'":"'+ID+'","'+videoDuration+'":"'+Duration+'"}');
}
makeParameterVerify = function(string){
    var Verify = '&verify=' + string;
    return Verify;
}
ParameterMethod = makeParameterMethod('phone.view.monitoring');
ParameterVerify = makeParameterVerify(getVerify);
if( iframeSearch[0].split('=')[0] == '?videoId'){
    // videoId 说明是从列表页的监控点进来的
    ParameterField = makeParameterField('videoId',getVideoId);
}else{
    // realPlantId 说明是从种植详情的监控按钮点进来的
    ParameterField = makeParameterField('realPlantId',getVideoId)
}
pageUrl = getTestUrl+'/rest/1.0/phoneView?v=1.0&format=json'+ParameterMethod+ParameterField+ParameterVerify;
console.log(pageUrl)
// 本地 = http://192.168.21.187/weixinservice/MemberFarm/Monitor.html?videoId=916&verify=asdf&domain=http://192.168.21.188:8080
// pageUrl = http://192.168.21.188:8080/rest/1.0/phoneView?v=1.0&format=json&method=phone.view.monitoring&field={"videoId":"916"}&verify=asdf
$.ajax({
    type: "GET",
    timeout: 1000,
    url: pageUrl,
    dataType: "jsonp",
    jsonp: 'callback',
    success: function(response) {
        // 初始化视频数据
        InitVideoData(response.data_result);

    },
    error: function(e) {
        try {
            console.log('监控初始化数据,请求失败了吧！！')
        } catch (e) {}
    }
});



// tab切换
// 初始化
$('.monitor_tabhd .items').eq(0).addClass('cCur').siblings().removeClass('cCur');
$('.monitor_tabhd .items').eq(0).attr('onoff','true').siblings().attr('onoff','fasle');
$('.monitor_tabbd .tab_content').eq(0).show().siblings().hide();


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

// 初始化视频数据
function InitVideoData(_data){
    // 如果无视频时状态，如下：
    if( _data.hasDevice == false){
            $('.monitor_tabhd .items').each(function(index,elem){
                $(elem).click(function(){
                    $(elem).addClass('cCur').siblings().removeClass('cCur');
                    $(elem).attr('onoff','true').siblings().attr('onoff','fasle');
                    $('.monitor_tabbd .tab_content').eq($(elem).index()).show().siblings().hide();
                })
            })
            // 无数据
            var $tab_content0 = $('.tab_content').eq(0),
                $tab_content1 = $('.tab_content').eq(1);
                $tab_content2 = $('.tab_content').eq(2);
            var nodata = 
            '<div class="no_information" style="background:none;">'+
                '<img src="../images/MemberFarm/Monitor_nodata.png" class="no_icon">'+
                '<p class="no_tip">暂无数据</p>'+
            '</div>';
            $tab_content0.append( nodata );
            $('.live_textcont').hide();
            $('#swiper_live').hide();
            $tab_content1.append( nodata );
            $('.envir_video_cont').hide();
            $('.take_textcont').hide();
            $tab_content2.append( nodata );
            $('.trace_video_cont').hide();
            $('.trace_textcont').hide();
    }else{
            // 地块名
            var tunnelName = tunnelName2 = tunnelName3=_data.tunnelName;
            !tunnelName=='undefined'||!tunnelName==''? tunnelName=_data.tunnelName : tunnelName='--';
            $('#tunnelName').html(tunnelName);
            $('#tunnelName2').html(tunnelName2);
            $('#tunnelName3').html(tunnelName3);
            // 作物
            var plantName = _data.plantName;
            var plantName2 =  _data.plantName2;
            !plantName=='undefined'||!plantName==''? plantName=_data.plantName.substring(0,_data.plantName.length-1) : plantName='--';
            !plantName2=='undefined'||!plantName2==''? plantName2=_data.plantName.substring(0,_data.plantName.length-1) : plantName2='--';
            $('#plantName').html('种植作物：'+plantName);
            $('#plantName2').html('种植作物：'+plantName2);
            // 拍摄时间
            if( _data.images != 'undefined' || _data.images != []){
                $('#take_time').html(_data.images[0].time);
            }
            // 图片数量
            $('#TakePlayTime').html(_data.imgNum);
            // 播放次数
            if( _data.videos != 'undefined' || _data.videos != []){
                $('#video_play_times').html(_data.videos[0].video_play_times);
            }
            // 视频时长
            if( _data.videos != 'undefined' || _data.videos != []){
                $('#video_duration').html(_data.videos[0].video_duration+1);
            }

            // 把拼好的实况直播slide，添加到盒子里
            var devicesList = '';
            var $swiper_live = $('#swiper_live .swiper-wrapper');
            for(var i=0;i<_data.devices.length;i++){
                var _index = i;
                devicesList += 
                '<div class="swiper-slide">'+
                    '<div class="live_video_cont">'+  
                        '<div id="LiveVideoBlock'+_index+'" style="height:100%;"></div>'+
                    '</div>'+
                '</div>';
            }
            $swiper_live.append( devicesList );

            // 把拼好的环境实况slide，添加到盒子里
            var takePhotosList = '';
            var $swiper_takePhotos = $('#swiper_takePhotos .swiper-wrapper');
            var imgIndexUrl = '';
            for(var k=0;k<_data.images.length;k++){
                var _index = k;
                takePhotosList += 
                '<div class="swiper-slide">'+
                    '<img src="'+_data.images[_index].url+'" />'+  
                '</div>';
            }
            $swiper_takePhotos.append( takePhotosList );

            // 计算宽度及数据个数
            // swiper农事图片
            var FarmSwiper;
            var swiperTabLen = _data.devices.length;
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
                        CreatVideo2(FarmSwiper.activeIndex ,_data.devices[activeIndex].webcam_url,'../../images/MemberFarm/PlantDetail_temp1.jpg');
                    }
                });
            // ---------------------
            $('.monitor_tabhd .items').each(function(index,elem){
            
                $(elem).click(function(){
                    $(elem).addClass('cCur').siblings().removeClass('cCur');
                    $(elem).attr('onoff','true').siblings().attr('onoff','fasle');
                    $('.monitor_tabbd .tab_content').eq($(elem).index()).show().siblings().hide();
                    if( $('.monitor_tabhd .items').eq(0).attr('onoff') == 'true' ){
                        // 1）实况直播
                        // swiper农事图片
                        FarmSwiper.reInit();
                        CreatVideo2(FarmSwiper.activeIndex,_data.devices[FarmSwiper.activeIndex],'../../images/MemberFarm/PlantDetail_temp1.jpg');
                    }else if( $('.monitor_tabhd .items').eq(1).attr('onoff') == 'true' ){
                        // 2）环境实况
                        // swiper环境实况-拍摄的图片
                        var swiperTakeLen = _data.images.length;
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
                                    $('#slider-range-max').slider( 'value', TakeSwiper.activeIndex );
                                    $('#take_time').html(_data.images[TakeSwiper.activeIndex].time);
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
                                    $('#amount').val( ui.value );
                                    $('#take_time').html(_data.images[ui.value].time);
                                }
                        });
                    }else{
                        // 3）视频追溯
                        // 视频追溯下的，重新生成对应的视频
                        // CreatVideo3(0 ,'http://farmeasy.cn/video/934/891/playlist.m3u8','../../images/MemberFarm/PlantDetail_temp1.jpg');
                        CreatVideo3(0 ,_data.videos[0].video_url,'../../images/MemberFarm/PlantDetail_temp1.jpg',_data.videos[0].video_duration);

                    }

                    
                });
                // 如果是从列表页点击进来的监控，则没有视频追溯，则不让点击
                if( iframeSearch[0].split('=')[0] == '?videoId'){
                    $('.monitor_tabhd .items').eq(2).unbind();
                }
            });
            // ---------------------
            // 初始化视频
            // CreatVideo('0','http://farmeasy.cn/video/934/891/playlist.m3u8','../../images/MemberFarm/PlantDetail_temp1.jpg');
            CreatVideo('0',_data.devices[0].webcam_url,'../../images/MemberFarm/PlantDetail_temp1.jpg');
    }
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
function CreatVideo3(videoItems,videoURL,imgURL,videoDuration){
    player.dispose();//清理
    scriptAdd  = '<video id="track-video'+videoItems+'" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;" preload="auto" poster="'+imgURL+'" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
    $("#TraceVideoBlock"+videoItems).html(scriptAdd);
    player = videojs("track-video"+videoItems);
    player.play();
    if( iframeSearch[0].split('=')[0] == '?realPlantId'){
    // 如果是从种植详情点进来的，才会有种植ID，否则不会请求
        ParameterMethod = makeParameterMethod('phone.view.play.num');
        ParameterField = makeParameterField2('realPlantId',getVideoId,'getVideoId',videoDuration)
        ParameterVerify = makeParameterVerify(getVerify);
        pageUrl = getTestUrl+'/rest/1.0/phoneView?v=1.0&format=json'+ParameterMethod+ParameterField2+ParameterVerify;;
        $.ajax({
            type: "GET",
            timeout: 1000,
            url: pageUrl,
            dataType: "jsonp",
            jsonp: 'callback'
        });
    }
}