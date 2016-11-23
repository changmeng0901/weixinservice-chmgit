
var FontTimer,
    makeParameterMethod,
    makeParameterField,
    makeParameterVerify,
    pageUrl;
FontSize();

// 进度条计算
var progress_block = $('.progress_block').width();
$('.progress_percent').css('width',progress_block);

// ajax加载数据
var iframeSearch = location.search.split('&');
var getEnterpriseInfoId = iframeSearch[0].split("=")[1];
var getRealPlantId = iframeSearch[1].split('=')[1];
var getTestUrl = iframeSearch[2].split("=")[1];
var getPhone = iframeSearch[3].split("=")[1];
makeParameterMethod = function(string){
    var Method = '&method=' + string;
    return Method;
}
makeParameterField = function(PhoneNumber,Number, EnterpriseInfoId,ID, RealPlantId,plantId){
    return encodeURI('&field={"'+PhoneNumber+'":"'+Number+'","'+EnterpriseInfoId+'":"'+ID+'","'+RealPlantId+'":"'+plantId+'"}');
}
makeParameterVerify = function(string){
    var Verify = '&verify=' + string;
    return Verify;
}
ParameterMethod = makeParameterMethod('phone.view.plant');
ParameterField = makeParameterField('phone','3693047153','enterpriseInfoId','2','realPlantId',getRealPlantId);
ParameterVerify = makeParameterVerify('asdf');
pageUrl = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethod + ParameterField + ParameterVerify;
console.log(pageUrl)
$.ajax({
    type: "GET",
    timeout: 1000,
    url: pageUrl,
    dataType: "jsonp",
    jsonp: 'callback',
    success: function(response) {
        
        InitCropInfoData(response.data_result);

    },
    error: function(e) {
        try {
            console.log('请求失败了吧！！')
        } catch (e) {}
    }
});


// 传感器数据--列表平均分配宽度
var windowWidth = document.documentElement.clientWidth;
var windowHeight= document.documentElement.clientHeight;
var swiperWidth = windowWidth/4;
var swiperLen = $('.swiper_sensor .swiper_slide').length;
$('.swiper_sensor .swiper_slide').css({
    'width' : swiperWidth
}); 
$('.swiper_sensor').css({
    'width' : swiperWidth*swiperLen
});
// 传感器数据--点击事件及切换图表内容
$('.swiper_sensor .swiper_slide').each(function(index,elem){
    $(elem).click(function(){
        $(elem).addClass('slide_active').siblings().removeClass('slide_active');
    });
});
$('#dayweekmonth span').click(function(){
    $(this).addClass('sCur').siblings().removeClass('sCur');
});
$('#sensor_chart').css('height',$('#sensor_chart').width()*0.6);
SensorChart();// 传感器数据--图表




// swiper农事图片
var farmpicLen = $('#farm_piclist0 img').length;
$('#swiper_farmpic').height( windowHeight );
$('#farm_piclist0 img').each(function(g_index,elem){
    $(elem).click(function(){
        $('body').addClass('overflowH');
        $('#swiper_farmpic').show();
        var FarmSwiper = new Swiper('#swiper_farmpic',{
            loop : false,
            initialSlide : g_index,
            onFirstInit: function( FarmSwiper ){ //Swiper2.x的回调函数，首次初始化后执行,初始化是onFirstInit
                $('#page_bclok .n_cur').html( g_index+1 ); 
                $('#page_bclok .n_total').html( farmpicLen );    
            }, 
            onSlideChangeEnd: function(swiper){ 
                $('#page_bclok .n_cur').html( FarmSwiper.activeIndex+1 ); 
                $('#page_bclok .n_total').html( farmpicLen );  
            }
          });
        
    });
});
$('#swiper_farmpic').click(function(){
    $('body').removeClass('overflowH');
    $('#swiper_farmpic').hide();
});






// ---------------------------------------------------------------------------
// 浏览器变化时执行
$(window).resize(function(){

	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );

    // 进度条计算
    var progress_block = $('.progress_block').width();
    $('.progress_percent').css('width',progress_block);

    $('#sensor_chart').css('height',$('#sensor_chart').width()*0.6);
    SensorChart();// 传感器数据--图表

});


// ---------------------------------------------------------------------------
// 计算不同分辨率下的文字大小
function FontSize(){
	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth>414?414:document.documentElement.clientWidth)/12)+'px';
}

// 初始化作物信息
function InitCropInfoData(_data){

    // 作物信息
    $('#plantImg').attr('src',_data.plantImg);
    $('#plantName').html(_data.plantName);
    $('#breedName').html(_data.breedName);
    $('#plantTime').html(_data.plantBeginTime+'-'+_data.plantEndTime);
    // 生命周期及天数
    // $('#life_cycle').html('<span class="text_cycle">'+_data.periodName+'</span><span class="text_day">（第'+_data.alreayPlantDays+'天）</span>');
    // $('#present_cycle').html('目前处于<span class="text_cyle" id="text_cyle">'+_data.periodName+'</span><span class="color_bloack">，还有'+_data.remain+'天采收结束</span>');
    $('#periodName').html(_data.periodName);
    $('#alreayPlantDays').html('（第'+_data.alreayPlantDays+'天）');
    $('#text_cyle').html(_data.periodName);
    $('#remain').html(_data.remain);
    $('#progress_bar').css('width',_data.grownProp+'%');

    // 种植信息
    var farmingsList = '';
    var farmings = _data.farmings;
    var $farm_information = $('#farm_information');
    if(farmings.length>0){
        // 有数据
        for( var i=0;i<farmings.length;i++){
            farmingsList += 
            '<dl class="dl_dl" agriculturalId="'+farmings[i].agriculturalId+'">'+
                '<dt class="dl_dt">'+
                    '<p class="text_time">'+farmings[i].operatingTime.split(' ')[1].split(':')[0]+':'+farmings[i].operatingTime.split(' ')[1].split(':')[1]+'</p>'+
                    '<p class="text_date">'+farmings[i].operatingTime.split(' ')[0].split('-')[1]+'/'+farmings[i].operatingTime.split(' ')[0].split('-')[2]+'</p>'+
                    '<i class="cPoint"></i>'+
                '</dt>'+
                '<dd class="dl_dd">'+
                    '<p class="text_con white_nowrap">'+farmings[i].name+'</p>'+
                    '<p class="text_dec">'+farmings[i].description+'</p>'+
                    '<div class="farm_piclist clear" id="farm_piclist'+i+'">'+farmings[i].images.split(',').join('')+'</div>'+
                '</dd>'+
            '</dl>';
        }
        $farm_information.append( farmingsList );
    }else{
        // 无数据
        farmingsList = 
        '<div class="no_information">'+
            '<img src="../images/MemberFarm/PlantDetail_icon4.png" class="no_icon">'+
            '<p class="no_tip">暂无农事信息</p>'+
        '</div>';
        $farm_information.append( farmingsList );
    }

    // 采收信息
    var harvestsList = '';
    var harvests = _data.harvests;
    var $harvests_information = $('#harvests_information');
    alert(harvests.length)
    if(harvests.length>0){
        // 有数据
        for( var i=0;i<harvests.length;i++ ){
            harvestsList += 
            '<li>'+
                '<div class="crop_pic">'+
                    '<img src="../images/MemberFarm/PlantDetail_harvest.png" >'+
                '</div>'+
                '<div class="harvest_det">'+
                    '<p class="text_name">'+harvests[i].name+'</p>'+
                    '<p class="text_date">'+harvests[i].time.split(' ')[0].split('-')[1]+'/'+harvests[i].time.split(' ')[0].split('-')[2]+' '+harvests[i].time.split(' ')[1].split(':')[0]+':'+harvests[i].time.split(' ')[1].split(':')[1]+'</p>'+
                '</div>'+
                '<p class="harvest_weight"><em class="num>'+harvests[i].weight+'</em>kg</p>'+
            '</li>';
        }
        $harvests_information.append( harvestsList );
        $('#harvest_noinfor').hide();
    }else{
        // 无数据
        $('#harvest_noinfor').show();
    }

}

// 传感器数据--图表
function SensorChart(){
    $('#sensor_chart').highcharts({
        credits: {
            enabled:false  // 去掉版权信息
        },
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            x: 9000,
            y: 45
        },
        xAxis: {
            categories: ['1月', '3月', '7月', '9月'],
            labels:{
                style: {                         // 标签全局样式
                    color: "#414141",
                    fontSize: '12px',
                    fontWeight: 'normal',
                    fontFamily: ''        
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            labels:{
                style: {                         // 标签全局样式
                    color: "#6fac24",
                    fontSize: '12px',
                    fontWeight: 'normal'       
                }
            }
        },
        plotOptions: {//点上边的数值
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '',
            data: [7.0, 14.5, 25.2, 18.3],
            color : "#6fac24"
        }]
    });
}