
var FontTimer,
    makeParameterMethod,
    makeParameterField,
    makeParameterVerify,
    ParameterMethod,
    ParameterField,
    ParameterVerify,
    pageUrl;
FontSize();

// ?enterprise_info_id=2&verify=######&domain=http://app.frameasy.cn&phone=13693047153
var iframeSearch = location.search.split("&");
var getEnterpriseId = iframeSearch[0].split("=")[1];
var getVerify = iframeSearch[1].split("=")[1];
var getTestUrl = iframeSearch[2].split("=")[1];
var getPhone = iframeSearch[3].split("=")[1];

// &method=phone.view.real.plant&field={"phone":"13693047153","enterpriseInfoId":"2"}&verify=asdf
makeParameterMethod = function (string) {
    var Method = '&method=' + string;
    return Method;
}
makeParameterField = function (PhoneNumber, Number,EnterpriseID, ID) { 
    return encodeURI('&field={"'+PhoneNumber+'":"'+Number+'","'+EnterpriseID+'":"'+ID+'"}');
}
makeParameterVerify = function (string) {
    var Verify = '&verify=' + string;
    return Verify;
}


// ajax加载左侧数据
ParameterMethod = makeParameterMethod('phone.view.real.plant');
ParameterField = makeParameterField('phone', getPhone,'enterpriseInfoId', getEnterpriseId);
ParameterVerify = makeParameterVerify(getVerify);
pageUrl = getTestUrl +"/rest/1.0/phoneView?v=1.0&format=json"+ ParameterMethod + ParameterField+ParameterVerify;
$.ajax({
    type: "GET",
    timeout: 1000,
    url: pageUrl,
    dataType: "jsonp",
    jsonp: 'callback',
    success: function(response) {
        
        if( response.invoke_result == 'NOT_LOGIN' ){
            // 如果没有登录
            window.location.href="http://www.baidu.com";
        }else if( response.invoke_result == 'INVOKE_FAILURE' ){
            // 如果登录失败
            alert('请重新加载页面！');
        }else if(response.invoke_result == 'INVOKE_SUCCESS'){
            // 如果成功
            if( response.data_result!=''||response.data_result.realPlantList!=[] ){
                
                // 如果有数据则执行，如下：
                InitPlantData(response.data_result.realPlantList);

            }
        }
    },
    error: function(e) {
        try {
            console.log('请求失败了吧！！')
        } catch (e) {}
    }
});

// ajax加载右侧数据
ParameterMethod2 = makeParameterMethod('phone.view.device');
pageUrl2 = getTestUrl +"/rest/1.0/phoneView?v=1.0&format=json"+ ParameterMethod2 + ParameterField+ParameterVerify;
$.ajax({
    type: "GET",
    timeout: 1000,
    url: pageUrl2,
    dataType: "jsonp",
    jsonp: 'callback',
    success: function(response) {
        
        if( response.invoke_result == 'NOT_LOGIN' ){
            // 如果没有登录
            window.location.href="http://www.baidu.com";
        }else if( response.invoke_result == 'INVOKE_FAILURE' ){
            // 如果登录失败
            alert('请重新加载页面！');
        }else if(response.invoke_result == 'INVOKE_SUCCESS'){
            // 如果成功
            if( response.data_result.realPlantList!=''||response.data_result.realPlantList!=[] ){
                
                // 如果有数据则执行，如下：
                InitMonitorData(response.data_result);

            }
        }
    },
    error: function(e) {
        try {
            console.log('请求失败了吧！！')
        } catch (e) {}
    }
});


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

// 选项卡切换
$('.croplist_tabhd .items').each(function(index,elem){
    $('.croplist_tabhd .items').eq(0).addClass('cCur').siblings().removeClass('cCur');
    $('.croplist_tabbd .crop_content').eq(0).show().siblings().hide();
        
    $(elem).click(function(){
        $(elem).addClass('cCur').siblings().removeClass('cCur');
        $('.croplist_tabbd .crop_content').eq($(this).index()).show().siblings().hide();
    });
});

$(window).resize(function(){
	clearTimeout( FontTimer );
	FontTimer = setTimeout( FontSize , 500 );
});




// 计算不同分辨率下的文字大小
function FontSize(){
	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth>414?414:document.documentElement.clientWidth)/12)+'px';
}

// 种植信息函数
function InitPlantData(_data){
        var strong_list = '';
        var $strong_list = $('#zhongzxx_content');
        if( _data == '' || _data == [] || _data == 'undefined'){
            strong_list = 
            '<div class="no_information" style="background:none;">'+
                '<img src="../images/MemberFarm/CropsList_nodata1.png" class="no_icon">'+
                '<p class="no_tip">暂无数据</p>'+
            '</div>';
            $strong_list.append( strong_list );
        }else{
            for(var i=0;i<_data.length;i++){
        		var dl_list='';
                var _list = _data[i].tunnelRealPlant;
                for(var j=0;j<_list.length;j++){
                    dl_list +=  '<dl class="dl_dl clear" realPlantId="'+ _list[j].realPlantId +'">'+
                                    '<dt class="dl_dt">'+
                                        '<img src="'+_list[j].plantImg+'" >'+
                                    '</dt>'+
                                    '<dd class="dl_dd">'+
                                        '<p class="crop_name">'+_list[j].plantName+'</p>'+
                                        '<p class="crop_time">定值时间：<span>'+_list[j].plantBeginTime+'</span></p>'+
                                    '</dd>'+
                                    '<dd class="dl_arrow">'+
                                        '<a href="javascript:;" onclick="ViewPlant(this)">'+
                                            '<img src="../images/MemberFarm/CropsList_arrow.png" >'+
                                        '</a>'+
                                    '</dd>'+
                                '</dl>';
                }
                strong_list += '<strong class="text_title">'+_data[i].tunnelName+'</strong>'+
                               '<div class="greenhouse mtf1 pl10 pr10" id="greenhouse'+i+'">'+dl_list+'</div>';
                // alert(dl_list);
            }
            
            $strong_list.append( strong_list );
        }
          
}
// 物联网设备函数
function InitMonitorData(_data){

        var monitor_list='';
        var sensor_list='';
        var mvideo=_data.video;
        var svideo = _data.device;
        var $monitor = $('#monitor');
        var $sensor = $('#sensor');
        if( mvideo == '' || mvideo == [] || mvideo == 'undefined'){
            // 监控暂无数据
            monitor_list = 
            '<div class="no_information" style="background:none;">'+
                '<img src="../images/MemberFarm/CropsList_nodata2.png" class="no_icon">'+
                '<p class="no_tip">暂无数据</p>'+
            '</div>';
            $monitor.append( monitor_list );
        }else{
            for(var i=0;i<mvideo.length;i++){

                monitor_list += '<dl class="dl_dl clear" videoId="'+ mvideo[i].videoId +'">'+
                                '<dt class="dl_dt">'+
                                    '<img src="../images/MemberFarm/CropsList_monitor.png" >'+
                                '</dt>'+
                                '<dd class="dl_dd">'+
                                    '<p class="crop_name">'+mvideo[i].videoName+'</p>'+
                                    '<p class="crop_time">'+mvideo[i].tunnelName+'</span></p>'+
                                '</dd>'+
                                '<dd class="dl_arrow">'+
                                    '<a href="javascript:;" onclick="VideoIdLink(this)">'+
                                        '<img src="../images/MemberFarm/CropsList_arrow.png" >'+
                                    '</a>'+
                                '</dd>'+
                            '</dl>';
            } 
            $monitor.append( monitor_list ); 
        }
        if(svideo == '' || svideo == [] || svideo == 'undefined'){
            // 传感器暂无数据
            sensor_list = 
            '<div class="no_information" style="background:none;">'+
                '<img src="../images/MemberFarm/CropsList_nodata2.png" class="no_icon">'+
                '<p class="no_tip">暂无数据</p>'+
            '</div>';
            $sensor.append( sensor_list );
        }else{
            for(var i=0;i<svideo.length;i++){

                sensor_list += '<dl class="dl_dl clear" deviceId="'+ svideo[i].deviceId +'">'+
                                '<dt class="dl_dt">'+
                                    '<img src="../images/MemberFarm/CropsList_sensor.png" >'+
                                '</dt>'+
                                '<dd class="dl_dd">'+
                                    '<p class="crop_name">'+svideo[i].deviceName+'</p>'+
                                    '<p class="crop_time">'+svideo[i].tunnelName+'</span></p>'+
                                '</dd>'+
                                '<dd class="dl_arrow">'+
                                    '<a href="javascript:;" onclick="DeviceIdLink(this)">'+
                                        '<img src="../images/MemberFarm/CropsList_arrow.png" >'+
                                    '</a>'+
                                '</dd>'+
                            '</dl>';
            }  
            $sensor.append( sensor_list );
        }
          
}

// 物联网设备--监控列表单项点击事件
var indexData,
    indexTime;
indexData = 1;
indexTime = 3;
function VideoIdLink(obj){
    window.location.href="http://192.168.21.187/weixinservice/MemberFarm/Monitor.html?videoId="+$(obj).parents('.dl_dl').attr('videoid')+"&verify="+getVerify+"&domain="+getTestUrl+"&phone="+getPhone;
}
// 物联网设备--传感器列表单项点击事件
function DeviceIdLink(obj){
    // 本地 = http://192.168.21.187/weixinservice/MemberFarm/Exponent.html?enterpriseInfoId=2&deviceId=1045&dataType=1&timeType=3&verify=asdf&domain=http://192.168.21.188:8080&phone=13693047153
    window.location.href="http://192.168.21.187/weixinservice/MemberFarm/Exponent.html?enterpriseInfoId="+getEnterpriseId+"&deviceId="+$(obj).parents('.dl_dl').attr('deviceid')+"&dataType="+indexData+"&timeType="+indexTime+"&verify="+getVerify+"&domain="+getTestUrl+"&phone="+getPhone;
}
// 种植信息--种植列表单项点击事件
function ViewPlant(obj){
    window.location.href="http://192.168.21.187/weixinservice/MemberFarm/PlantDetail.html?enterpriseInfoId="+getEnterpriseId+"&realPlantId="+$(obj).parents('.dl_dl').attr('realplantid')+"&dataType="+indexData+"&timeType="+indexTime+"&verify="+getVerify+"&domain="+getTestUrl+"&phone="+getPhone;
}
