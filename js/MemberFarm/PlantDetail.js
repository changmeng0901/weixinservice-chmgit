
var FontTimer;
FontSize();


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

    $('#sensor_chart').css('height',$('#sensor_chart').width()*0.6);
    SensorChart();// 传感器数据--图表

});


// ---------------------------------------------------------------------------
// 计算不同分辨率下的文字大小
function FontSize(){
	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth>414?414:document.documentElement.clientWidth)/12)+'px';
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