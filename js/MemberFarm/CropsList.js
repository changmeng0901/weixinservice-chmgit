
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
ParameterField = makeParameterField('phone', '13693047153','enterpriseInfoId', '2');
ParameterVerify = makeParameterVerify('asdf');
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
            if( response.data_result.realPlantList!=''||response.data_result.realPlantList!=[] ){
                
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
alert(pageUrl2)
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
        var dl_list='';
        var $strong_list = $('#zhongzxx_content');
        for(var i=0;i<_data.length;i++){

            var _list = _data[i].tunnelRealPlant;
            for(var j=0;j<_list.length;j++){
                dl_list +=  '<dl class="dl_dl clear">'+
                                '<dt class="dl_dt">'+
                                    '<img src="'+_list[j].plantImg+'" >'+
                                '</dt>'+
                                '<dd class="dl_dd">'+
                                    '<p class="crop_name">'+_list[j].plantName+'</p>'+
                                    '<p class="crop_time">定值时间：<span>'+_list[j].plantBeginTime+'</span></p>'+
                                '</dd>'+
                                '<dd class="dl_arrow">'+
                                    '<a href="PlantDetail.html">'+
                                        '<img src="../images/MemberFarm/CropsList_arrow.png" >'+
                                    '</a>'+
                                '</dd>'+
                            '</dl>';
            }
            strong_list += '<strong class="text_title">'+_data[i].tunnelName+'</strong>'+
                           '<div class="mtf1 pl10 pr10" id="greenhouse'+i+'">'+dl_list+'</div>';
            // alert(dl_list);
        }
        
        $strong_list.append( strong_list );
          
}
// 物联网设备函数
function InitMonitorData(_data){

        var monitor_list='';
        var sensor_list='';
        var mvideo=_data.video;
        var svideo = _data.device;
        var $monitor = $('#monitor');
        var $sensor = $('#sensor');
        for(var i=0;i<mvideo.length;i++){

            monitor_list += '<dl class="dl_dl clear">'+
                            '<dt class="dl_dt">'+
                                '<img src="../images/MemberFarm/CropsList_monitor.png" >'+
                            '</dt>'+
                            '<dd class="dl_dd">'+
                                '<p class="crop_name">'+mvideo[i].videoName+'</p>'+
                                '<p class="crop_time">'+mvideo[i].tunnelName+'</span></p>'+
                            '</dd>'+
                            '<dd class="dl_arrow">'+
                                '<a href="PlantDetail.html">'+
                                    '<img src="../images/MemberFarm/CropsList_arrow.png" >'+
                                '</a>'+
                            '</dd>'+
                        '</dl>';
        }  
        for(var i=0;i<svideo.length;i++){

            sensor_list += '<dl class="dl_dl clear">'+
                            '<dt class="dl_dt">'+
                                '<img src="../images/MemberFarm/CropsList_sensor" >'+
                            '</dt>'+
                            '<dd class="dl_dd">'+
                                '<p class="crop_name">'+svideo[i].deviceName+'</p>'+
                                '<p class="crop_time">'+svideo[i].tunnelName+'</span></p>'+
                            '</dd>'+
                            '<dd class="dl_arrow">'+
                                '<a href="PlantDetail.html">'+
                                    '<img src="../images/MemberFarm/CropsList_arrow.png" >'+
                                '</a>'+
                            '</dd>'+
                        '</dl>';
        }  
        $monitor.append( monitor_list );
        $sensor.append( sensor_list );

          
}
function initBindDomEvent(){
    
}
