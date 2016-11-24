
var FontTimer,
    makeParameterMethod,
    makeParameterField,
    makeParameterFieldType,
    makeParameterVerify,
    pageUrl,
    pageUrlType,
    ParameterMethod,
    ParameterMethodType,
    ParameterField,
    ParameterFieldType,
    ParameterVerify,
    ParameterVerifyType;
FontSize();

// ajax 
var iframeSearch = location.search.split('&');
// Method
makeParameterMethod = function(string){
    var Method = '&method=' + string;
    return Method;
}
// Field 
makeParameterField = function( PhoneNumber,Number, EnterpriseInfoId,ID, realPlantId,ID2){
    return encodeURI('&field={"'+PhoneNumber+'":"'+Number+'","'+EnterpriseInfoId+'":"'+ID+'","'+realPlantId+'":"'+ID2+'"}');
}
// FieldType 带传感器类型和时间类型
makeParameterFieldType = function(PhoneNumber,Number, EnterpriseInfoId,ID, DeviceId,D_ID, DataType,Type1, TimeType,Type2){
    return encodeURI('&field={"'+PhoneNumber+'":"'+Number+'","'+EnterpriseInfoId+'":"'+ID+'","'+DeviceId+'":"'+D_ID+'","'+DataType+'":"'+Type1+'","'+TimeType+'":"'+Type2+'"}');
}
// Verify
makeParameterVerify = function(string){
    var Verify = '&verify=' + string;
    return Verify;
}



// 指数数据交互
/*
1.判断是从物联网设备下传感器点击进去的时候，指数是拿不到realPlantId的---拿不到就不让指数点击
2.从种植详情页，指数按钮点击进去时是可以拿到realPlantId的  ---拿到了，指数可以点击
*/
if( iframeSearch[1].split('=')[0] == 'deviceId'){
    // 如果是点击传感器进来的，则：[不让指数点击]
    var indexData,
        indexTime;
    $('.fixed_foot .fitems').eq(0).addClass('fCur').siblings().removeClass('fCur');
    $('#sensor_main').show();
    $('#exponent_mian').hide();
    var getEnterpriseInfoId = iframeSearch[0].split("=")[1];
    var getDeviceId = iframeSearch[1].split('=')[1];
    var getDataType = iframeSearch[2].split('=')[1];
    var getTimeType = iframeSearch[3].split('=')[1];
    var getVerify = iframeSearch[4].split('=')[1];
    var getTestUrl = iframeSearch[5].split("=")[1];
    var getPhone = iframeSearch[6].split("=")[1];
    // URL 从列表点击进来时传感器拿到的是====deviceId
    indexData = getDataType;
    indexTime = getTimeType;
    ParameterMethodType = makeParameterMethod('phone.view.plant.device.data');
    ParameterFieldType = makeParameterFieldType('phone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'deviceId',getDeviceId,'dataType',indexData,'timeType',indexTime);        
    ParameterVerifyType = makeParameterVerify(getVerify);
    pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethodType + ParameterFieldType + ParameterVerifyType;
    // 本地 = http://192.168.21.187/weixinservice/MemberFarm/Exponent.html?enterpriseInfoId=2&deviceid=1045&dataType=1&timeType=3&verify=asdf&domain=http://192.168.21.188:8080&phone=13693047153
    // 拼完 = http://192.168.21.188:8080/rest/1.0/phoneView?v=1.0&format=json&method=phone.view.plant.device.data&field={"phone":"13693047153","enterpriseInfoId":"2","deviceid":"1045","dataType":"1","timeType":"3"}&verify=asdf
    
    // 传感器数据接口
    $('#swiper_sensor .data_items').eq(indexData-1).addClass('dCur');
    $('#dayweekmonth span').eq(indexTime-1).addClass('sCur').siblings().removeClass('sCur');
    var hasChartData, //是否有折线图数据
        ChartData,  //折线图数据集合
        ChartTime;  //折线图数据时间
    $.ajax({
        type: "GET",
        timeout: 1000,
        url: pageUrlType,
        dataType: "jsonp",
        jsonp: 'callback',
        success: function(response) {
            // 传感器7个数据
            InitDeviceData(response.data_result);
            // 是否有折线图数据
            hasChartData = response.data_result.hasChartData;
            ChartData = response.data_result.ChartData;
            ChartTime = response.data_result.ChartTime;
            if(hasChartData == true){
                $('#sensor_chart').show();
                $('#sensor_nochart').hide();
                SensorChart(ChartData,ChartTime);
            }else{
                $('#sensor_chart').hide();
                $('#sensor_nochart').show();
            }
        },
        error: function(e) {
            try {
                console.log('列表传感器点击进来的传感器数据,请求失败了吧！！')
            } catch (e) {}
        }
    });

    // swiper
    $('#swiper_sensor .data_items').each(function(_index,elem){
        $(elem).click(function(){
            $('#swiper_sensor .data_items').removeClass('dCur');
            $(this).addClass('dCur');
            $('#dayweekmonth span').eq(getTimeType-1).addClass('sCur').siblings().removeClass('sCur');
            // URL
            indexData = $('#swiper_sensor .dCur').attr('datatype');
            indexTime = $('#dayweekmonth .sCur').attr('timeType');
            ParameterMethodType = makeParameterMethod('phone.view.plant.device.data');
            ParameterFieldType = makeParameterFieldType('phone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'deviceId',getDeviceId,'dataType',indexData,'timeType',indexTime);        
            ParameterVerifyType = makeParameterVerify(getVerify);
            pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethodType + ParameterFieldType + ParameterVerifyType;
            // AJAX
            $.ajax({
                type: "GET",
                timeout: 1000,
                url: pageUrlType,
                dataType: "jsonp",
                jsonp: 'callback',
                success: function(response) {

                    // 是否有折线图数据
                    hasChartData = response.data_result.hasChartData;
                    ChartData = response.data_result.ChartData;
                    ChartTime = response.data_result.ChartTime;
                    if(hasChartData == true){
                        $('#sensor_chart').show();
                        $('#sensor_nochart').hide();
                        SensorChart(ChartData,ChartTime);
                    }else{
                        $('#sensor_chart').hide();
                        $('#sensor_nochart').show();
                    }

                },
                error: function(e) {
                    try {
                        console.log('列表传感器点击进来的传感器数据,请求失败了吧！！')
                    } catch (e) {}
                }
            });
        });
    });
    // 天周月
    $('#dayweekmonth span').click(function(){
        $(this).addClass('sCur').siblings().removeClass('sCur');
        indexData = $('#swiper_sensor .dCur').attr('datatype');
        indexTime = $('#dayweekmonth .sCur').attr('timeType');
        // URL
        ParameterMethodType = makeParameterMethod('phone.view.plant.device.data');
        ParameterFieldType = makeParameterFieldType('phone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'deviceId',getDeviceId,'dataType',indexData,'timeType',indexTime);        
        ParameterVerifyType = makeParameterVerify(getVerify);
        pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethodType + ParameterFieldType + ParameterVerifyType;
        // AJAX
        $.ajax({
            type: "GET",
            timeout: 1000,
            url: pageUrlType,
            dataType: "jsonp",
            jsonp: 'callback',
            success: function(response) {

                // 是否有折线图数据
                hasChartData = response.data_result.hasChartData;
                ChartData = response.data_result.ChartData;
                ChartTime = response.data_result.ChartTime;
                // 有折线图数据时，日周月数据变换如下
                
                if(hasChartData == true){
                    $('#sensor_chart').show();
                    $('#sensor_nochart').hide();
                    SensorChart(ChartData,ChartTime);
                }else{
                    $('#sensor_chart').hide();
                    $('#sensor_nochart').show();
                }

            },
            error: function(e) {
                try {
                    console.log('列表传感器点击进来的传感器数据,,请求失败了吧！！')
                } catch (e) {}
            }
        });
    });
        
   

}else{
    // 如果是点击指数进来的，则：[指数和传感器都可以点击切换]
    $('.fixed_foot .fitems').eq(1).addClass('fCur').siblings().removeClass('fCur');
    $('#sensor_main').hide();
    $('#exponent_mian').show();
    var getEnterpriseInfoId = iframeSearch[0].split("=")[1];
    var getRealPlantId = iframeSearch[1].split('=')[1];
    var getVerify = iframeSearch[2].split('=')[1];
    var getTestUrl = iframeSearch[3].split("=")[1];
    var getPhone = iframeSearch[4].split("=")[1];
    // 1）指数接口数据接口
    var indexData,
        indexTime;
    indexData = 1;
    indexTime = 3;
    ParameterMethod = makeParameterMethod('phone.view.exponent');
    ParameterField = makeParameterField('pnone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'realPlantId',getRealPlantId);
    ParameterVerify = makeParameterVerify(getVerify);
    pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethod + ParameterField + ParameterVerify;
    // 本地 = http://192.168.21.187/weixinservice/MemberFarm/Exponent.html?enterpriseInfoId=2&realPlantId=33174&verify=asdf&domain=http://192.168.21.188:8080&phone=13693047153
    // 接口 = http://192.168.21.188:8080/rest/1.0/phoneView?v=1.0&format=json&method=phone.view.exponent&field={"phone":"13693047153","enterpriseInfoId":"2","enterpriseInfoId":"2","realPlantId":"33174"}&verify=asdf&
    console.log(pageUrlType)
    $.ajax({
        type: "GET",
        timeout: 1000,
        url: pageUrlType,
        dataType: "jsonp",
        jsonp: 'callback',
        success: function(response) {
            // 传感器7个数据
            console.log(response.data_result)
            InitExponentData(response.data_result);
            // 饼图  成熟度分析
            $('.maturity_chart').attr('data-percent',matureExpVal);
            var chart = window.chart = new EasyPieChart(document.querySelector('.maturity_chart'), {
                    easing: 'easeOutElastic',
                    delay: 3000,
                    scaleColor: '#f9f9f9',  
                    lineWidth: 25,
                    trackColor: '#f9f9f9',  
                    barColor : '#55bf3b',
                    onStep: function(from, to, percent) {
                        this.el.children[0].innerHTML = Math.round(percent);
                    }
                });
            // 健康指数分析图表
            ExponentChart(response.data_result.health.categories,response.data_result.health.series)
            
        },
        error: function(e) {
            try {
                console.log('种植详情点进来的传感器和指数数据,请求失败了吧！！')
            } catch (e) {}
        }
    });

    // 三个分析切换效果
    $('.exponent_head .items').each(function(_index,elem){
        $('.exponent_head .items').eq(0).addClass('eCur').siblings().removeClass('eCur');
        $('.exponent_body .tab_content').eq( 0 ).show().siblings().hide();
        $(elem).click(function(){
            $(elem).addClass('eCur').siblings().removeClass('eCur');
            $('.exponent_body .tab_content').eq( _index ).show().siblings().hide();
        });
    }); 
    // 2）传感器接口数据
    // 传感器点击事件      ##数据类型和时间类型都传1过去##
    $('.fixed_foot .fitems').eq(0).click(function(){
        $('.fixed_foot .fitems').eq(0).addClass('fCur').siblings().removeClass('fCur');
        $('#sensor_main').show();
        $('#exponent_mian').hide();
        // 传感器数据--点击事件及切换图表内容
        $('#swiper_sensor .data_items').eq(0).addClass('dCur');
        $('#dayweekmonth span').eq(2).addClass('sCur').siblings().removeClass('sCur');
        // URL
        ParameterMethodType = makeParameterMethod('phone.view.plant.device.data');
        ParameterFieldType = makeParameterFieldType('phone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'realPlantId',getRealPlantId,'dataType',indexData,'timeType',indexTime);        
        ParameterVerifyType = makeParameterVerify(getVerify);
        pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethodType + ParameterFieldType + ParameterVerifyType;
        // AJAX
        $.ajax({
            type: "GET",
            timeout: 1000,
            url: pageUrlType,
            dataType: "jsonp",
            jsonp: 'callback',
            success: function(response) {

                // 是否有折线图数据
                hasChartData = response.data_result.hasChartData;
                ChartData = response.data_result.ChartData;
                ChartTime = response.data_result.ChartTime;
                if(hasChartData == true){
                    $('#sensor_chart').show();
                    $('#sensor_nochart').hide();
                    SensorChart(ChartData,ChartTime);
                }else{
                    $('#sensor_chart').hide();
                    $('#sensor_nochart').show();
                }

            },
            error: function(e) {
                try {
                    console.log('种植详情点进来的传感器数据,请求失败了吧！！')
                } catch (e) {}
            }
        });
        // swiper
        $('#swiper_sensor .data_items').each(function(_index,elem){
            $(elem).click(function(){
                $('#swiper_sensor .data_items').removeClass('dCur');
                $(this).addClass('dCur');
                indexData = $('#swiper_sensor .dCur').index();
                $('#dayweekmonth span').eq(indexTime-1).addClass('sCur').siblings().removeClass('sCur');
                // URL
                ParameterMethodType = makeParameterMethod('phone.view.plant.device.data');
                ParameterFieldType = makeParameterFieldType('phone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'realPlantId',getRealPlantId,'dataType',indexData,'timeType',indexTime);        
                ParameterVerifyType = makeParameterVerify(getVerify);
                pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethodType + ParameterFieldType + ParameterVerifyType;
                // AJAX
                $.ajax({
                    type: "GET",
                    timeout: 1000,
                    url: pageUrlType,
                    dataType: "jsonp",
                    jsonp: 'callback',
                    success: function(response) {

                        // 是否有折线图数据
                        hasChartData = response.data_result.hasChartData;
                        ChartData = response.data_result.ChartData;
                        ChartTime = response.data_result.ChartTime;
                        if(hasChartData == true){
                            $('#sensor_chart').show();
                            $('#sensor_nochart').hide();
                            SensorChart(ChartData,ChartTime);
                        }else{
                            $('#sensor_chart').hide();
                            $('#sensor_nochart').show();
                        }

                    },
                    error: function(e) {
                        try {
                            console.log('种植详情点进来的传感器数据,请求失败了吧！！')
                        } catch (e) {}
                    }
                });
            });
        });
        // 天周月
        $('#dayweekmonth span').click(function(){
            $(this).addClass('sCur').siblings().removeClass('sCur');
            var indexData = $('#swiper_sensor .dCur').attr('datatype');
            // URL
            ParameterMethodType = makeParameterMethod('phone.view.plant.device.data');
            ParameterFieldType = makeParameterFieldType('phone',getPhone,'enterpriseInfoId',getEnterpriseInfoId,'realPlantId',getRealPlantId,'dataType',indexData,'timeType',$(this).attr('timeType'));        
            ParameterVerifyType = makeParameterVerify(getVerify);
            pageUrlType = getTestUrl +　"/rest/1.0/phoneView?v=1.0&format=json" + ParameterMethodType + ParameterFieldType + ParameterVerifyType;
            // AJAX
            $.ajax({
                type: "GET",
                timeout: 1000,
                url: pageUrlType,
                dataType: "jsonp",
                jsonp: 'callback',
                success: function(response) {

                    // 是否有折线图数据
                    hasChartData = response.data_result.hasChartData;
                    ChartData = response.data_result.ChartData;
                    ChartTime = response.data_result.ChartTime;
                    // 有折线图数据时，日周月数据变换如下
                    
                    if(hasChartData == true){
                        $('#sensor_chart').show();
                        $('#sensor_nochart').hide();
                        SensorChart(ChartData,ChartTime);
                    }else{
                        $('#sensor_chart').hide();
                        $('#sensor_nochart').show();
                    }

                },
                error: function(e) {
                    try {
                        console.log('种植详情点进来的传感器数据,请求失败了吧！！')
                    } catch (e) {}
                }
            });
        });
        
    });
    //指数点击事件 
    $('.fixed_foot .fitems').eq(1).click(function(){
        $('.fixed_foot .fitems').eq(1).addClass('fCur').siblings().removeClass('fCur');
        $('#sensor_main').hide();
        $('#exponent_mian').show();
    });
}

//可视区域宽高
var windowWidth = document.documentElement.clientWidth;
var windowHeight= document.documentElement.clientHeight;

// swiper
var FarmSwiper
FarmSwiper = new Swiper('#swiper_sensor',{
    pagination: '.pagination',
    loop:false
  })    


// ---------------------------------------------------------------------------
// 浏览器变化时执行
$(window).resize(function(){
    //可视区域宽高
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight= document.documentElement.clientHeight;

    // 字号的计算
	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );

    // 传感器图表计算
    $('#sensor_chart').css('height',$('#sensor_chart').width()*0.4);

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
// 初始化传感器数据函数
function InitDeviceData(_data){
    // 空气温度
    !_data.airTemp == 'undefined' || !_data.airTemp =='' ? $('#airTemp').html(_data.airTemp+'℃') : $('#airTemp').html('--℃');
    // 空气湿度
    !_data.airHumidity == 'undefined' || !_data.airHumidity =='' ? $('#airHumidity').html(_data.airHumidity+'℃') : $('#airHumidity').html('--℃');
    // 土壤湿度
    !_data.soilHumidity == 'undefined' || !_data.soilHumidity =='' ? $('#soilHumidity').html(_data.soilHumidity+'%') : $('#soilHumidity').html('--%');
    // 光照强度
    !_data.illumination == 'undefined' || !_data.illumination =='' ? $('#illumination').html(_data.illumination+'lux') : $('#illumination').html('--lux');
    // 二氧化塘
    !_data.co2 == 'undefined' || !_data.co2 =='' ? $('#co2').html(_data.co2+'℃') : $('#co2').html('--℃');
    // 土壤温度
    !_data.soilTemp == 'undefined' || !_data.soilTemp =='' ? $('#soilTemp').html(_data.soilTemp+'℃') : $('#soilTemp').html('--℃');
    // 空气露点
    !_data.dewPoint == 'undefined' || !_data.dewPoint =='' ? $('#dewPoint').html(_data.dewPoint+'℃') : $('#dewPoint').html('--℃');
}
// 初始化指数数据函数
function InitExponentData(_data){
    // 实际种植天数
    !_data.realPlantDay == 'undefined' || !_data.realPlantDay =='' ? $('#realPlantDay').html(_data.realPlantDay) : $('#realPlantDay').html('--');
    // 已种植天数
    !_data.alreadyDay == 'undefined' || !_data.alreadyDay =='' ? $('#alreadyDay').html(_data.alreadyDay) : $('#alreadyDay').html('--');
    // 自然成熟度
    if( !_data.matureExp == 'undefined' || !_data.matureExp =='' ){
        matureExpVal = _data.matureExp;
        $('#matureExp').html(_data.matureExp);
    }else{
        matureExpVal = 0;
        $('#matureExp').html('--');
    }

    // 平均发病概率
    $('#avgHarmful').html( _data.disease.avgHarmful );
    // 平均发病概率
    $('#maxHarmful').html( _data.disease.maxHarmful );
    var disease_list = '';
    var harmfulDataLen = _data.disease.harmfulData;
    var $disease_list = $('#disease_list');
    if( !harmfulDataLen=='undefined' || !harmfulDataLen==[]){
        // 有病虫害列表
        for( var i=0;i<harmfulDataLen.length;i++ ){
            var ColorValue = '';
            if(i%2 == 0){
                ColorValue = 'progress-bar-warning';
            }else if(i%2 == 1){
                ColorValue = 'progress-bar-success';
            }else if(i%2 == 2){
                ColorValue = 'progress-bar-danger';
            }else if(i%2 == 3){
                ColorValue = 'progress-bar-info';
            }else if(i%2 == 4){
                ColorValue = '';
            }
            disease_list += 
            '<li harmfulId="'+harmfulDataLen[i].harmfulId+'">'+
                '<p class="text_name white_nowrap">'+harmfulDataLen[i].harmfulName+'</p>'+
                '<div class="clear">'+
                    '<div class="progress">'+
                    '<div class="progress-bar '+ColorValue+' progress-bar-striped active" role="progressbar" aria-valuenow="'+harmfulDataLen[i].harmfulVal+'" aria-valuemin="0" aria-valuemax="100" style="width: '+harmfulDataLen[i].harmfulVal+'%;">'+
                        '<span class="sr-only">60% Complete</span>'+
                    '</div>'+
                    '</div>'+
                    '<span class="bar_num">'+harmfulDataLen[i].harmfulVal+'%</span>'+
                '</div>'+
            '</li>';
        }
    }
    $disease_list.append( disease_list );

    // 当前指数
    $('#lastValue').html( _data.health.lastValue );
    // 平均指数
    $('#avgValue').html( _data.health.avgValue );          
}

// 传感器数据--图表
function SensorChart(chartData,chartTime){
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
            categories: chartTime,
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
                connectNulls:true,//该设置会连接空值点
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '',
            data: chartData,
            color : "#6fac24"
        }]
    });
}


// 健康指数分析
function ExponentChart(categoriesData,seriesData){
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
            categories: categoriesData,
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
               fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }
        },
        series: seriesData
    });
}