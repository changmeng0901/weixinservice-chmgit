
var FontTimer;
FontSize();


//可视区域宽高
var windowWidth = document.documentElement.clientWidth;
var windowHeight= document.documentElement.clientHeight;

// swiper
var FarmSwiper
FarmSwiper = new Swiper('#swiper_sensor',{
    pagination: '.pagination',
    loop:false
  }) 
$('#swiper_sensor .data_items').each(function(_index,elem){
    $(elem).click(function(){
        $('#swiper_sensor .data_items').removeClass('dCur');
        $(this).addClass('dCur');
    });
});


// 传感器和指数切换效果
$('.fixed_foot .fitems').each(function(_index,elem){
    $('.fixed_foot .fitems').eq(0).addClass('fCur').siblings().removeClass('fCur');
    $('#sensor_main').show();
    $('.fixed_foot .fitems').eq(0).click(function(){
        $('.fixed_foot .fitems').eq(0).addClass('fCur').siblings().removeClass('fCur');
        $('#sensor_main').show();
        $('#exponent_mian').hide();
        SensorChart();// 传感器数据--图表
    });
    $('.fixed_foot .fitems').eq(1).click(function(){
        $('.fixed_foot .fitems').eq(1).addClass('fCur').siblings().removeClass('fCur');
        $('#sensor_main').hide();
        $('#exponent_mian').show();
    });
});

// 三个分析切换效果
$('.exponent_head .items').each(function(_index,elem){
    $('.exponent_head .items').eq(0).addClass('eCur').siblings().removeClass('eCur');
    $('.exponent_body .tab_content').eq( 0 ).show().siblings().hide();
    $(elem).click(function(){
        $(elem).addClass('eCur').siblings().removeClass('eCur');
        $('.exponent_body .tab_content').eq( _index ).show().siblings().hide();
    });
    // 第三个点击时，去加载健康指数分析
    $('.exponent_head .items').eq(2).click(function(){
        ExponentChart();// 健康指数分析
    });
});

$('#dayweekmonth span').click(function(){
    $(this).addClass('sCur').siblings().removeClass('sCur');
});
$('#sensor_chart').css('height',$('#sensor_chart').width()*0.6);
SensorChart();// 传感器数据--图表
         
// 饼图  成熟度分析
var maturityChart = angular.module('app', ['easypiechart']);
maturityChart.controller('chartCtrl', ['$scope', function ($scope) {          
    $scope.Percent2 = 100;
}]);     


// ---------------------------------------------------------------------------
// 浏览器变化时执行
$(window).resize(function(){
    //可视区域宽高
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight= document.documentElement.clientHeight;

	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );

    $('#sensor_chart').css('height',$('#sensor_chart').width()*0.4);
    SensorChart();// 传感器数据--图表
    ExponentChart();// 健康指数分析

    // 重新计算
    $('#swiper_sensor .swiper-wrapper').css({
    'width' : windowWidth * swiperTabLen
    })
    $('#swiper_sensor .swiper-slide').css({
        'width' : windowWidth
    }) 

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


// 健康指数分析
function ExponentChart(){
    $('#exponent_chart').highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150000,
            y: 100,
            floating: true
        },
        xAxis: {
            categories: [
                '10月20',
                '10月25',
                '10月30',
                '11月11'
            ],
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'rgba(68, 170, 213, .2)'
            }]
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: '@@'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'John',
            data: [5, 4, 10, 12]
        }]
    });
}