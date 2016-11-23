var WGS84_to_GCJ02 = function() {}

WGS84_to_GCJ02.prototype.a = 6378245.0;
WGS84_to_GCJ02.prototype.ee = 0.00669342162296594323;
WGS84_to_GCJ02.prototype.transform = function(wgLat, wgLon) {

    if (this.outOfChina(wgLat, wgLon)) {
        return [wgLat, wgLon];
    }

    dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0);
    dLon = this.transformLon(wgLon - 105.0, wgLat - 35.0);
    radLat = wgLat / 180.0 * Math.PI;
    magic = Math.sin(radLat);
    magic = 1 - this.ee * magic * magic;
    sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * Math.PI);
    dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * Math.PI);
    mgLat = wgLat + dLat;
    mgLon = wgLon + dLon;

    return [mgLat, mgLon];

};

WGS84_to_GCJ02.prototype.outOfChina = function(lat, lon) {

    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;

    return false;

};

WGS84_to_GCJ02.prototype.transformLat = function(x, y) {

    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;

    return ret;

};

WGS84_to_GCJ02.prototype.transformLon = function(x, y) {

    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;

    return ret;

};


xc_zoomSet = true;
var zyghOnoff = true;	
var map;
var flightPath;
var FirstMarker,
		LastMarker,
		AnimateMarker,
		playTimer,
		scrollZoom;
		
var iframeSearch = location.search.split("&");
var getGroupId = iframeSearch[0].split("=")[1];
var getTestUrl = iframeSearch[1].split("=")[1];
var operTypeUrl = iframeSearch[2].split("=")[1];//1:企业航拍视频列表（查看企业所有视频） 2：航拍组视频列表（按分
var ParameterMethod,
		pageUrl;
		
	var player; 	
	
var index_ = 0;	

var po;
var aPosition;		
var myoverlay;
var scriptAdd;
var point;
var latPo;



			var flightPlanSite = [],
				arrLat = [],
				arrLing = [],
				arrAlt = [],
				arrISO = [],
				arrEV = [],
				arrShutter = [],
				arrFnum = [];

var onoffBtn = true;


//(8)地图航线
;(function ($) {
	/**
	* author: 前端小菜鸟
	* date: 2016-07-12 
	* resizeFn 		  ==> 初始化窗口
	* playlistAnimate ==> 播放列表定时器设置
	* getFlightPlanSite ==> 初始化调用后端接口api，获取数据
	* sliderMapBar ==> 通过getFlightPlanSite函数获取的数据，动态渲染左侧菜单dom
	* initBindDomEvent ==> 初始化页面所有需要绑定事件的dom元素
	* initializeGoogelMaps ==> 谷歌地图render，此方法还需拆分，具体根据返回数据查分不同模块@todu
	*/

	

	var zObj = {};
	var headerLen;

	var AerialVideoView = {
		init: function () {
			AerialVideoView.playlistAnimate();
			AerialVideoView.initBindDomEvent()
			//AerialVideoView.sliderMapBar();
			AerialVideoView.getFlightPlanSite();
			AerialVideoView.resizeFn();
			$(window).resize( AerialVideoView.resizeFn );
		},
		makeParameterMethod: function (string) {
			var Method = '&method=' + string;
			return Method;
		},
		makeParameterField: function (IDtype, ID) { //base_id
			return encodeURI('&field={"data":{"' + IDtype + '":"' + ID + '"}}');
		},
		makeTwoParameterField: function (IDtype1, ID1,IDtype2, ID2) { //base_id
			return encodeURI('&field={"data":{"' + IDtype1 + '":"' + ID1 + '","' + IDtype2 + '":"' + ID2 + '"}}');
		},
		getFlightPlanSite: function () {
			
			ParameterMethod = AerialVideoView.makeParameterMethod("aerial.video.group.data");
			if(operTypeUrl=="1"){//1:企业航拍视频列表（查看企业所有视频） 2：航拍组视频列表（按分组查看）
				groupId = AerialVideoView.makeTwoParameterField("group_id","","entId",getGroupId);
			}else if(operTypeUrl=="2"){				
				groupId = AerialVideoView.makeTwoParameterField("group_id",getGroupId,"entId","");
			}
			
			pageUrl = getTestUrl +"/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;

			$.ajax({
			 	type: "GET",
			 	timeout: 1000,
			 	url: pageUrl,
			 	dataType: "jsonp",
			 	jsonp: 'callback',
			 	success: function(response) {
					
					AerialVideoView.initializeGoogelMaps(response.groupstr.list,0);
					//zyghOnoff = true;
					if( response.groupstr.assets_show == "1" && response.groupstr.list[0].track_list!="" ){
						loadZyMap(response.groupstr.list[0].base_id);
						zyghOnoff = false;
					}
					if( response.groupstr.assets_show == "1" ){
						zyghOnoff = false;
					}

					var groupstr = response.groupstr;
					var enterpriseInfoData = {
						track_list : groupstr.list[0].track_list,
						logo_img : groupstr.logo_img,  //企业logo
						group_name : groupstr.group_name,
					 	business_name: groupstr.business_name,
					 	business_tel: groupstr.business_tel,
					 	business_email: groupstr.business_email,
						business_weibo: groupstr.business_weibo,
						business_address: groupstr.business_address,
						business_card_introduce:groupstr.business_card_introduce,
						description : groupstr.list[0].description,
						file_url : groupstr.list[0].file_url,
						id :  groupstr.list[0].id,
						aerial_name :  groupstr.list[0].aerial_name,
						release_time : groupstr.release_time,
						video_timer : groupstr.video_timer,
						view_count : groupstr.list[0].view_count,//播放次数(浏览量)
						good_count : groupstr.list[0].good_count,//点赞量(好评)
						group_video_id:groupstr.list[0].group_video_id,//
						thumbnail_image_url:groupstr.list[0].thumbnail_image_url,//视频图片
						base_id : groupstr.list[0].base_id,
						video_list_show : groupstr.video_list_show,  //左侧视频列表展开或收缩
						business_card_show : groupstr.business_card_show,  //头部企业名片显示隐藏
						track_show : groupstr.track_show,  //轨迹显示或隐藏
						assets_show : groupstr.assets_show,  //资源规划
						logo_show : groupstr.logo_show,//是否显示企业LOGO
					 };
					 
					 
					 AerialVideoView.enterpriseInfoModal(enterpriseInfoData);
					 //初始化完地图，再去往左侧菜单添加数据
					 AerialVideoView.sliderMapBar(response.groupstr.list);
			 	},
			 	error: function(e) {
			 		try {
			 			console.log(opt)
			 		} catch (e) {}
			 	}
			 });

		},
		sliderMapBar: function (data) {
			var $playlistList = $('.playlist_list'),
				sliderItemStr = '',
				style_time = '';
			for (var item in data) {
				if(data[item].view_count==''||typeof(data[item].view_count)=='undefined'){
						//如果查看量没有值，则给0
					  	data[item].view_count=0;
					  }
				if(data[item].good_count==''||typeof(data[item].good_count)=='undefined'){
						//如果好评没有值，则给0
					  	data[item].good_count=0;
					  }
				if(data[item].video_timer==''||typeof(data[item].video_timer)=='undefined'){
						//如果视频时长没有值，则不显示
					  	style_time='none';
					  }else{
						style_time='block';

					  }
				currentStyle = item == 0 ? ' icur' : '';
				sliderItemStr  += "<dl class='item"+currentStyle+
								  "' onoff='true' onoffTwo='true'><dt class='video-url' data-video-url='"+ data[item].file_url +
								  "' data-id='"+ data[item].id +
								  "' base-id='"+ data[item].base_id +
								  "' data-description='"+ data[item].description +
								  "' aerial-name='"+ data[item].aerial_name +
								  "' group-video-id='"+ data[item].group_video_id +
								  "' thumbnail-image-url='"+ data[item].thumbnail_image_url +
								  "'><img src='"+data[item].thumbnail_image_url+
								  "' /><p class='video_stro font12'><img src='../images/aerial/icon_mnplay.png' /><span>"+data[item].aerial_name+
								  "</span></p><p class='play_time' style='display:"+style_time+";'>"+data[item].video_timer+
								  "</p><i class='v_mark'></i></dt><dd><strong class='aerial_name'>"+ data[item].aerial_name +
								  "</strong><p class='send_time'>发布时间<span>"+data[item].release_time+
								  "</span></p><div class='description'>"+data[item].description+
								  "</div><div class='dd_foot clear'><p class='sm_plays fl'><img src='../images/aerial/AerialvideoView_play.png' /><span id='sm_plays'>"+data[item].view_count+
								  "</span>次播放</p><p class='sm_Opt fr'><img src='../images/aerial/AerialvideoView_opt.png' /><span id='sm_Opt'>"+data[item].good_count+
								  "</span></p></div></dd></dl>";
				/*if(data[item].video_timer==''||typeof(data[item].video_timer)=='undefined'){
						//如果视频时长没有值，则不显示
					  	$('.playlist_list .item').eq(item).find('.play_time').hide();
					  }*/

			}
			$playlistList.append(sliderItemStr);

				

		},
		enterpriseInfoModal : function(data){			
			//@@航拍页面弹框等基础数据初始化
			if(data.logo_img!=""){
				$("#qy_logo_li").html("<img class=\"qy_logo\" id=\"qy_logo\" src=\""+data.logo_img+"@38h_132w_90q.jpg\" />");				
			}else{
				$('#qy_logo_li').html("<p style='font-size: 14px;font-weight: bold;color: #fff;word-break: break-all;overflow: hidden;'>"+data.business_name+"</p>");
			}	
			$('#qycard_logo').attr('src',data.logo_img);
			
			$('#qycard_name').html( data.business_name );
			if(data.business_tel==""){
				$('.qycard_phone').css("display","none");
			}else{
				$('.qycard_phone').css("display","block");
				$('#qycard_phone').html( data.business_tel );
			}
			if(data.business_email==""){
				$('.qycard_mail').css("display","none");
			}else{
				$('.qycard_mail').css("display","block");
				$('#qycard_mail').html( data.business_email );
			}
			if(data.business_weibo==""){
				$('.qycard_weibo').css("display","none");
			}else{
				$('.qycard_weibo').css("display","block");
				$('#qycard_weibo').html( data.business_weibo );
			}
			if(data.business_address==""){
				$('.qycard_addr').css("display","none");
			}else{
				$('.qycard_addr').css("display","block");
				$('#qycard_addr').html( data.business_address );
				$('#qycard_addr').attr("title",data.business_address);
			}	
			$('#qycard_intro').html( data.business_card_introduce );

			if( $('#longitude').html() == '' ){ $('#longitude').html('--') }
			if( $('#latitude').html() == '' ){ $('#latitude').html('--') }
			if( $('#altitude').html() == '' ){ $('#altitude').html('--') }
			if( $('#isoitude').html() == '' ){ $('#isoitude').html('--') }
			if( $('#kmitude').html() == '' ){ $('#kmitude').html('--') }
			if( $('#evitude').html() == '' ){ $('#evitude').html('--') }
			if( $('#gyitude').html() == '' ){ $('#gyitude').html('--') }
			
			if( $('#longitude_pos').html() == '' ){ $('#longitude_pos').html('--') }
			if( $('#latitude_pos').html() == '' ){ $('#latitude_pos').html('--') }
			if( $('#altitude_pos').html() == '' ){ $('#altitude_pos').html('--') }
			$(document).attr("title",data.aerial_name);
			if( data.view_count==''||typeof(data.view_count)=='undefined' ){
				$('#plays_count').html(0);
			}else{
				$('#plays_count').html(data.view_count);
			}
			if( data.good_count==''||typeof(data.good_count)=='undefined' ){
				$('#Opt_count').html(0);
			}else{
				$('#Opt_count').html(data.good_count);
			}
			
			if( data.description != ''){
				$('#scene_description').append(data.description);
			}else{
				$('.item_scence').hide();	
			}
			if( data.logo_img == "1" ){ 
				//如果企业、logo为true就显示
				$('#qy_logo_li').show();
			}else{
				//$('#qy_logo_li').hide();
			}
			if( data.business_card_show == "1"  ){
				//如果头部企业名片为true就显示
				$('.item_qycard').show();
			}else{
				$('.item_qycard').hide();
			}
			if(data.track_list==""){
				$('.aerial_map').hide();
				$('.bigbtn_map').hide();
			}else{
				if( data.track_show == "1" ){
					//如果轨迹为true就显示
					$('.aerial_map').show();
				}else{
					$('.aerial_map').hide();
				}
			}
			zObj.pTimer = setTimeout(function(){
					$(".aerial_playlist").stop().animate({
						"left" : -210
					},500);
				},700);
			onoffBtn = true;


			$('.WeChat_share .WeChat_img2').click(function(){
				$('.WeChat_share').hide();
				$('body').css('overflow','auto');
			});
			$('#WeChat_shareBtn').click(function(){
				$('.WeChat_share').show();
				$('body').css('overflow','hidden');
			});
			
			//头部计算
			var oWindowW = $(window).width();
			var oWindowH = $(window).height();
			if(oWindowW<1280){
				$(".item_EV").hide();
				$(".item_ISO").hide();
			}else{
				$(".item_EV").show();
				$(".item_ISO").show();	
			}
			if($(window).width()>$(window).height()){
				headerLen = $(".video_header_list2 li:visible").length;
				$(".video_header_list2 li:visible").css("width", parseInt($(".video_header_list2").width()/headerLen) )
			}else{
				headerLen = $(".video_header_list2 li:visible").length;
				$(".video_header_list2 li:visible").css("width", "inherit")
			}

			AerialVideoView.creatVideo(data.file_url,data.thumbnail_image_url);//初始化，创建视频插件

		},
		initBindDomEvent: function(){
			
			//左侧菜单选中状态
			$('.playlist_list').on('click','.video-url',function () {
				zObj.pTimer = setTimeout(function() {
					$(".aerial_playlist").stop().animate({
						left: -210
					}, 300)
				}, 300);	
				$('.aerial_map').stop().animate({
					"left" : 20
				},500);
				$(".bigbtn_map").stop().animate({
					"left" : 20
				},500);
				onoffBtn = true;

				var that = $(this);	
				that.parent().addClass('icur').siblings().removeClass('icur');				
				$(document).attr("title",that.attr('aerial-name'));
				
				if($(".playlist_list .icur").attr("onoff")=="false"){
					$('#Opt_count').html(parseInt($(".playlist_list .icur #sm_Opt").html()));
				}else{
					$('#Opt_count').html($(".playlist_list .icur #sm_Opt").html());
				}
				if($(".playlist_list .icur").attr("onofftwo")=="false"){
					$('#plays_count').html(parseInt($(".playlist_list .icur #sm_plays").html()));
				}else{
					$('#plays_count').html($(".playlist_list .icur #sm_plays").html());
				}

				
				ParameterMethod = AerialVideoView.makeParameterMethod("aerial.track.data"),
				groupId = AerialVideoView.makeParameterField("aerial_video_id",that.attr('data-id'));
				pageUrl = getTestUrl +"/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;

				//var url = "http://192.168.21.55:8080/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;
				
	
				$.ajax({
					type: "GET",
					timeout: 1000,
					url: pageUrl,
					dataType: "jsonp",
					jsonp: 'callback',
					success: function(response) {
						//console.log(JSON.stringify(response))
						//console.log(response.trackstr)
						AerialVideoView.initializeGoogelMaps(response.trackstr,0);
						//取轨迹的第一个值，如果有初始化页面头部的值，没有显示--
						var list = response.trackstr[0].track_list;	
						if(list!=""){	
							var item=0;
							var gps = list[item].GPS;
							gps = gps.replace(/[()]/g, "");
							gps = gps.split(",");								
	
							$('#longitude').html(parseFloat(gps[0]));
							$('#latitude').html(parseFloat(gps[1]));
							$('#altitude').html(list[item].BAROMETER);
							$('#isoitude').html(list[item].ISO);
							$('#evitude').html(list[item].EV);
							$('#kmitude').html(list[item].Shutter);
							$('#gyitude').html(list[item].Fnum);
							
							$('#longitude_pos').html(parseFloat(gps[0]));
							$('#latitude_pos').html(parseFloat(gps[1]));
							$('#altitude_pos').html(list[item].BAROMETER);
						}else{
							$('#longitude').html("--");
							$('#latitude').html("--");
							$('#altitude').html("--");
							$('#isoitude').html("--");
							$('#evitude').html("--");
							$('#kmitude').html("--");
							$('#gyitude').html("--");
							
							$('#longitude_pos').html("--");
							$('#latitude_pos').html("--");
							$('#altitude_pos').html("--");
						}

						if( zyghOnoff == false && list!="" ){
							loadZyMap(response.trackstr[0].base_id);
						}
						
						if( that.attr("data-description")!= ''){
							$('.item_scence').show();	
							$('#scene_description').html(that.attr("data-description"));
						}else{
							$('.item_scence').hide();	
						}
						//头部计算
						var oWindowW = $(window).width();
						var oWindowH = $(window).height();
						if(oWindowW<1280){
							$(".item_EV").hide();
							$(".item_ISO").hide();
						}else{
							$(".item_EV").show();
							$(".item_ISO").show();	
						}
						if($(window).width()>$(window).height()){
							headerLen = $(".video_header_list2 li:visible").length;
							$(".video_header_list2 li:visible").css("width", parseInt($(".video_header_list2").width()/headerLen) )
						}else{
							headerLen = $(".video_header_list2 li:visible").length;
							$(".video_header_list2 li:visible").css("width", "inherit")
						}
						
						AerialVideoView.creatVideo2(that.attr("data-video-url"),that.attr("thumbnail-image-url"));//左侧菜单点击时，每次都得重新创建一次视频插件，否则会出问题
						
					},
					error: function(e) {
						try {
							console.log(opt)
						} catch (e) {}
					}
				 });
				
			});

			//列表点赞(好评)
			$("#Opt_btn").click(function(){
				var seeAttr = $(".playlist_list .item.icur").attr("onoff");
				if( seeAttr=="true"){//如果当前身上开关是true，说明未被点赞
					$("#Opt_count").html(parseInt($(".playlist_list .item.icur #sm_Opt").html())+1);
					$(".playlist_list .item.icur #sm_Opt").html(parseInt($(".playlist_list .item.icur #sm_Opt").html())+1);///////
					ParameterMethod = AerialVideoView.makeParameterMethod("aerial.info.set"),
					//operTypeUrl1:播放次数 2：好评（点赞）
					groupId = AerialVideoView.makeTwoParameterField("group_video_id",$(".playlist_list .icur dt").attr("group-video-id"),"type",operTypeUrl);
					pageUrl = getTestUrl +"/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;
					$.ajax({
						type: "GET",
						timeout: 1000,
						url: pageUrl,
						dataType: "jsonp",
						jsonp: 'callback'
					});
					$(".playlist_list .item.icur").attr("onoff","false")
					
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
			//复选框插件
			$('input[class=iCheck]').iCheck({
				checkboxClass: 'icheckbox_minimal',
				increaseArea: '20%' // optional
			});
			//复制链接
			$(".btn_copy").click(function(){
				$(".share_dialog .ipt_link").select();
				//document.execCommand("Copy");
			});
			//底部悬浮地图--收缩和展开
			$(".smallbtn_map").click(function(){
				$(".aerial_map").hide();
				//$(".smallbtn_map").hide();	
				$(".bigbtn_map").show();
				if($(".aerial_map").css('left')=='20px'){
					$(".bigbtn_map").css('left','20px');
				}else{
					if($(window).width()>$(window).height()){
						$(".bigbtn_map").css('left','170px');
					}else{
						$(".bigbtn_map").css('left','20px');	
					}
					
				}
			});
			$(".bigbtn_map").click(function(){
				$(".aerial_map").show();
				//$(".smallbtn_map").show();	
				$(".bigbtn_map").hide();	
			});
			
		},
		resizeFn: function () {

			$(document).scrollTop(0);

			//(4)计算主体高度
			var oWindowW = $(window).width();
			var oWindowH = $(window).height();
			var oHeaderH = $('.video_header_wap').outerHeight();
			var oFooterH = $('.video_footer_wap').outerHeight();
			var IESpace = 0; //为了解决ie8大屏出滚动条问题，html和body差4PX
			if( $("html").height() > $("body").height() ){
				IESpace	= 4;
			}else{
				IESpace	=0
			}
			if($(window).width()>$(window).height()){
				$(".aerial_playlist").css({
					"height" :  oWindowH - oHeaderH  -IESpace
				});
			}else{
				$(".aerial_playlist").css({
					"height" :  "inherit"
				});
			}
			if($(window).width()>$(window).height()){
				$("#video_block").css({
					"height" : oWindowH - oHeaderH  -IESpace
				});

			}else{
				$("#video_block").css({
					"height" : "6.462rem"
				});
				//$(".bigbtn_map").hide();
				$(".aerial_map").css({
					"left" : "inhert"
				})
			}
			$("#danmuarea").css({
				  "min-height" : 500 - oHeaderH -IESpace,
					  "height" : oWindowH - oHeaderH  -IESpace
			});
			oWindowH < 500 ? $(".pano_dialog").addClass("pano_top") : 	$(".pano_dialog").removeClass("pano_top")
			
			//头部计算
			if(oWindowW<1280){
				$(".item_EV").hide();
				$(".item_ISO").hide();
			}else{
				$(".item_EV").show();
				$(".item_ISO").show();	
			}
			if($(window).width()>$(window).height()){
				headerLen = $(".video_header_list2 li:visible").length;
				$(".video_header_list2 li:visible").css("width", parseInt($(".video_header_list2").width()/headerLen) )
			}else{
				headerLen = $(".video_header_list2 li:visible").length;
				$(".video_header_list2 li:visible").css("width", "inherit")
			}
			
			if(navigator.userAgent.indexOf("Android")>0){
				$(".pano_dialog").addClass("pano_android");
				$(".WeChat_share .share_pos").addClass("share_android");
			}else{
				$(".pano_dialog").removeClass("pano_android");	
				$(".WeChat_share .share_pos").removeClass("share_android");
			}

		},
		initializeGoogelMaps: function (data,index_) {
			flightPlanSite=[];
			if(data[0].track_list == ""){
				$(".aerial_map").hide();
				//$(".smallbtn_map").hide();	
				$(".bigbtn_map").hide();
				return;
			}else{
				$(".aerial_map").show();
				//$(".smallbtn_map").show();	
				$(".bigbtn_map").hide();
			}	
				
			var bounds = new google.maps.LatLngBounds();
			
			
			for (var indx in data) {
				var list = data[indx].track_list;
				for (var item in list) {
					var gps = list[item].GPS;
					gps = gps.replace(/[()]/g, "");
					gps = gps.split(",");
					
					// var temp = new google.maps.LatLng( parseFloat(gps[1]), parseFloat(gps[0]) );
					// var tempLat =  parseFloat(gps[1]);
					// var tempLing = parseFloat(gps[0]);
					var GCJ02loc = new WGS84_to_GCJ02().transform(parseFloat(gps[1]), parseFloat(gps[0]));
					var temp = new google.maps.LatLng(GCJ02loc[0], GCJ02loc[1]);					
					var tempLat = GCJ02loc[1];
					var tempLing =GCJ02loc[0];
					var tempAlt = list[item].BAROMETER;
					var tempISO = list[item].ISO.split(":")[1];
					var tempEV = list[item].EV.split(":")[1];
					var tempShutter = list[item].Shutter.split(":")[1];
					var tempFnum = list[item].Fnum.split(":")[1];
					//tempAlt = tempAlt.split(":");  
					//tempAlt = tempAlt[1]
					
					bounds.extend(temp);
					scrollZoom = getBoundsZoomLevel(bounds);
										
					flightPlanSite.push( temp );//x和y
					arrLat.push( tempLat );//x
					arrLing.push( tempLing );//y
					arrAlt.push( tempAlt );//海拔
					arrISO.push( tempISO );//ISO
					arrEV.push( tempEV );//EV
					arrShutter.push( tempShutter );//Shutter快门
					arrFnum.push( tempFnum );//Fnum
				}
			}

			//console.log(flightPlanSite);
			
			LatPlanSite = arrLat;
			LingPlanSite = arrLing;
			AltPlanSite = arrAlt;
			ISOPlanSite = arrISO;
			EVPlanSite = arrEV;
			ShutterPlanSite = arrShutter;
			FnumPlanSite = arrFnum;

			var myLatLng = flightPlanSite[0];
			var myOptions = {
				zoom: 19,
				center: myLatLng,
				mapTypeId: google.maps.MapTypeId.SATELLITE,
				mapTypeControl: true,//false表示不显示控件，即头部地图类型不显示
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,//HORIZONTAL_BAR普通类型
					position: google.maps.ControlPosition.TOP_LEFT  
				},
				zoomControl: true,//取消放大缩小
				zoomControlOptions: {
					position: google.maps.ControlPosition.RIGHT_BOTTOM 
				},
				scaleControl: true,
				streetViewControl: false,// 取消街景
	 			mapTypeControl:false,//取消地图切换

			};
			if(typeof(map) == "undefined"){
		    	map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);//初始化地图
			}
			else{
				map.setOptions(myOptions);
			}
			if(!bounds.isEmpty()){
						scrollZoom = getBoundsZoomLevel(bounds);
						if(typeof(scrollZoom) != "undefined" && scrollZoom >0)
							map.setZoom(scrollZoom);
					}
					//console.log(scrollZoom)
			//alert(flightPlanSite)
			if(typeof(flightPath)=="undefined"){
				flightPath = new google.maps.Polyline({//类型为直线的
					path: flightPlanSite,
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2
		    	});
			}else{
				flightPath.setPath(flightPlanSite);
			}
		    

			if(typeof(FirstMarker)=="undefined"){
				FirstMarker = new google.maps.Marker({  //起点
					icon:"../images/commons/icon_plane2.png",
					map: map,
					position:  flightPlanSite[0],
				});
			}else{
				FirstMarker.setPosition(flightPlanSite[0]);
				
			}
			
			if(typeof(LastMarker)=="undefined"){
				LastMarker = new google.maps.Marker({  //终点
					icon:"../images/commons/icon_plane2.png",
					map: map,
					position:  flightPlanSite[flightPlanSite.length-1],
				});
			}else{
				LastMarker.setPosition( flightPlanSite[flightPlanSite.length-1]);
			}
			
			if(typeof(AnimateMarker)=="undefined"){
				AnimateMarker = new google.maps.Marker({  //动态滑动点
					icon:"../images/commons/icon_plane4.png",
					map: map,
				});
			}
					
			
			flightPath.setMap( map );
			
			myoverlay = new MyOverlay(map);
							
		
				
				
			

		},

		creatVideo : function(videoURL,imgURL){
			
			scriptAdd  = '<video id="example-video" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;" preload="auto" poster="'+imgURL+'" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
			$("#video_block").html(scriptAdd);
			player = videojs("example-video");
			player.pause();
					
					function timeout(){
							index_=Math.round(player.currentTime());//获取到视频的当前时间，即播放进度
							if( index_ < flightPlanSite.length ){
								console.log(flightPlanSite.length)
								console.log(index_)
								//myoverlay = new MyOverlay(map);
								
								
								aPosition = flightPlanSite[index_];//获取坐标，之后动态滑点每次都居中
								po = myoverlay.getProjection();
								point = po.fromLatLngToContainerPixel(aPosition);
								point.y = point.y+17;
								latPo = po.fromContainerPixelToLatLng(point)
								AnimateMarker.setPosition( latPo );
								map.setCenter(latPo);
								$("#longitude").html( LatPlanSite[index_] );
								$("#latitude").html( LingPlanSite[index_] );
								$('#altitude').html( AltPlanSite[index_]+'米' );
								$("#isoitude").html( ISOPlanSite[index_] );
								$("#evitude").html( EVPlanSite[index_] );
								$("#kmitude").html( ShutterPlanSite[index_] );
								$("#gyitude").html( FnumPlanSite[index_] );
								
								$("#longitude_pos").html( LatPlanSite[index_] );
								$("#latitude_pos").html( LingPlanSite[index_] );
								$('#altitude_pos').html( AltPlanSite[index_]+'米' );
								index_++;
							}else{
								clearInterval( playTimer );
							}
						}
						playTimer = setTimeout(function(){
							timeout();
						},1000);
			player.on('pause',function(){
				clearTimeout(playTimer);
				index_=Math.round(player.currentTime());
			});

			
			
				
			player.on('play',function(){
					if( $(".playlist_list .item.icur").attr("onofftwo")=="true" ){
						$("#plays_count").html(parseInt($(".playlist_list .item.icur #sm_plays").html())+1);
						$(".playlist_list .item.icur #sm_plays").html(parseInt($(".playlist_list .item.icur #sm_plays").html())+1);
						ParameterMethod = AerialVideoView.makeParameterMethod("aerial.info.set"),
						//operTypeUrl1:播放次数 2：好评（点赞）
						groupId = AerialVideoView.makeTwoParameterField("group_video_id",$(".playlist_list .icur dt").attr("group-video-id"),"type",1);
						pageUrl = getTestUrl +"/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;
						$.ajax({
							type: "GET",
							timeout: 1000,
							url: pageUrl,
							dataType: "jsonp",
							jsonp: 'callback'
						});
						$(".playlist_list .item.icur").attr("onofftwo","false")
					}
					
				
					playTimer = setInterval(function(){
						timeout();
					},1000);
				
			})	
			
		},
		creatVideo2 : function(videoURL,imgURL){
			player.dispose();//清理
			scriptAdd  = '<video id="example-video" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;" preload="auto" poster="'+imgURL+'" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
			$("#video_block").html(scriptAdd);
			player = videojs("example-video");
			player.pause();
			clearInterval( playTimer );
					
					function timeout(){
							index_=Math.round(player.currentTime());
							if( index_ < flightPlanSite.length ){
								console.log(flightPlanSite.length)
								console.log(index_)
								//myoverlay = new MyOverlay(map);
								
								
								aPosition = flightPlanSite[index_];//获取坐标，之后动态滑点每次都居中
								po = myoverlay.getProjection();
								point = po.fromLatLngToContainerPixel(aPosition);
								point.y = point.y+17;
								latPo = po.fromContainerPixelToLatLng(point)
								AnimateMarker.setPosition( latPo );
								map.setCenter(latPo);
								$("#longitude").html( LatPlanSite[index_] );
								$("#latitude").html( LingPlanSite[index_] );
								$('#altitude').html( AltPlanSite[index_]+'米' );
								$("#isoitude").html( ISOPlanSite[index_] );
								$("#evitude").html( EVPlanSite[index_] );
								$("#kmitude").html( ShutterPlanSite[index_] );
								$("#gyitude").html( FnumPlanSite[index_] );
								
								$("#longitude_pos").html( LatPlanSite[index_] );
								$("#latitude_pos").html( LingPlanSite[index_] );
								$('#altitude_pos').html( AltPlanSite[index_]+'米' );
								index_++;
							}else{
								clearInterval( playTimer );
							}
						}
						playTimer = setTimeout(function(){
							timeout();
						},1000);
			player.on('pause',function(){
				clearInterval(playTimer);
				index_=Math.round(player.currentTime());
			});
			
			
			
				
			player.on('play',function(){
					if( $(".playlist_list .item.icur").attr("onofftwo")=="true" ){
						$("#plays_count").html(parseInt($(".playlist_list .item.icur #sm_plays").html())+1);
						$(".playlist_list .item.icur #sm_plays").html(parseInt($(".playlist_list .item.icur #sm_plays").html())+1);
						ParameterMethod = AerialVideoView.makeParameterMethod("aerial.info.set"),
						//operTypeUrl1:播放次数 2：好评（点赞）
						groupId = AerialVideoView.makeTwoParameterField("group_video_id",$(".playlist_list .icur dt").attr("group-video-id"),"type",1);
						pageUrl = getTestUrl +"/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;
						$.ajax({
							type: "GET",
							timeout: 1000,
							url: pageUrl,
							dataType: "jsonp",
							jsonp: 'callback'
						});
						$(".playlist_list .item.icur").attr("onofftwo","false");
					}
					playTimer = setInterval(function(){
						timeout();
					},1000);
				
			})	
		},
		playlistAnimate: function () {
				//var onoffBtn = true;
				// zObj.pTimer = setTimeout(function(){
				// 	$(".aerial_playlist").stop().animate({
				// 		"left" : -210
				// 	},500)
				// },700);
				$("#BarOnoff").click(function(){
					clearTimeout( zObj.pTimer );
					if( onoffBtn ){
						zObj.pTimer = setTimeout(function() {
							$(".aerial_playlist").stop().animate({
								left: 0
							}, 300)
						}, 300);
						$('.aerial_map').stop().animate({
							"left" : 170
						},500);
						$(".bigbtn_map").stop().animate({
							"left" : 170
						},500);
						onoffBtn = false;
					}else{
						zObj.pTimer = setTimeout(function() {
							$(".aerial_playlist").stop().animate({
								left: -210
							}, 300)
						}, 300);	
						$('.aerial_map').stop().animate({
							"left" : 20
						},500);
						$(".bigbtn_map").stop().animate({
							"left" : 20
						},500);
						onoffBtn = true;
					}
				});
				// $("#BarOnoff").mouseleave(function(){
				// 	clearTimeout( zObj.pTimer );
				// 	zObj.pTimer = setTimeout(function() {
				// 			$(".aerial_playlist").stop().animate({
				// 				left: -210
				// 			}, 300)
				// 		}, 1000);
				// 	$('.aerial_map').stop().animate({
				// 		"left" : 20
				// 	},500);
				// 	$(".bigbtn_map").stop().animate({
				// 		"left" : 20
				// 	},500);
				// 	onoffBtn = true;
				// });
				// $(".aerial_playlist").mousemove(function(){
				// 	clearTimeout( zObj.pTimer );
				// 	zObj.pTimer = setTimeout(function() {
				// 			$(".aerial_playlist").stop().animate({
				// 				left: 0
				// 			}, 300)
				// 		}, 300);
				// 	$('.aerial_map').stop().animate({
				// 		"left" :170
				// 	},500);
				// 	$(".bigbtn_map").stop().animate({
				// 		"left" :170
				// 	},500);
				// 	onoffBtn = false;
				// });
				// $(".aerial_playlist").mouseleave(function(){
				// 	clearTimeout( zObj.pTimer );
				// 	zObj.pTimer = setTimeout(function() {
				// 			$(".aerial_playlist").stop().animate({
				// 				left: -210
				// 			}, 300)
				// 		}, 300);
				// 	$('.aerial_map').stop().animate({
				// 		"left" : 20
				// 	},500);
				// 	$(".bigbtn_map").stop().animate({
				// 		"left" : 20
				// 	},500);
				// 	onoffBtn = true;
				// });
		}
	};
	AerialVideoView.init();
})($);

