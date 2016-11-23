// JavaScript Document


// var FontTimer;
// FontSize();

// function FontSize(){
// 	document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth > 414 ? 414 : 	document.documentElement.clientWidth)/12)+'px';
// }

// $(window).resize(function(){
// 	clearTimeout( FontTimer );
// 	FontTimer = setTimeout( FontSize , 500 );	
// });



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
//var getEntId = iframeSearch[2].split("=")[1];
var ParameterMethod,
		pageUrl;
		
	var player; 
	var FontTimer;	
	
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
		getFlightPlanSite: function () {
			
			ParameterMethod = AerialVideoView.makeParameterMethod("aerial.video.group.data"),
			groupId = AerialVideoView.makeParameterField("group_id",getGroupId);
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
					if( response.groupstr.assets_show == "1" ){
						loadZyMap(response.groupstr.list[0].base_id);
						zyghOnoff = false;
					}else{

						zyghOnoff = true;
					}

					var groupstr = response.groupstr;
					var enterpriseInfoData = {
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
						base_id : groupstr.list[0].base_id,
						video_list_show : groupstr.video_list_show,  //左侧视频列表展开或收缩
						business_card_show : groupstr.business_card_show,  //头部企业名片显示隐藏
						track_show : groupstr.track_show,  //轨迹显示或隐藏
						assets_show : groupstr.assets_show,  //资源规划
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
				sliderItemStr = '';
			for (var item in data) {
				
				currentStyle = item == 0 ? 'icur' : '';
				sliderItemStr  += "<li class='item video-url "+ currentStyle+
								  "' data-video-url='"+ data[item].file_url +
								  "' data-id='"+ data[item].id +
								 "' base-id='"+ data[item].base_id +
								  "' data-description='"+ data[item].description +"'>"+
								  "<img class='mn_pic' src='"+ data[item].thumbnail_image_url +"' />"+
								  "<p class='text_con'><img class='icon_mn' src='../images/map/icon_mnplay.png' />"+data[item].aerial_name+
								  "</p><i class='bg_opa50'></i></li>";
			}
			$playlistList.append(sliderItemStr);

		},
		enterpriseInfoModal : function(data){
			
			//@@航拍页面弹框等基础数据初始化
			$('#qy_logo').attr('src',data.logo_img);
			$('#qycard_name').html( data.business_name );
			$('#qycard_phone').html( data.business_tel );
			$('#qycard_mail').html( data.business_email );
			$('#qycard_weibo').html( data.business_weibo );
			$('#qycard_addr').html( data.business_address );
			$('#qycard_intro').html( data.business_card_introduce );
			
			if( data.description != ''){
				$('#scene_description').append(data.description);
			}else{
				$('.item_scence').hide();	
			}
			if( data.logo_img == "1" ){ 
				//如果企业、logo为true就显示
				$('#qy_logo_li').show();
			}else{
				$('#qy_logo_li').hide();
			}
			if( data.business_card_show == "1"  ){
				//如果头部企业名片为true就显示
				$('.item_qycard').show();
			}else{
				$('.item_qycard').hide();
			}
			if( data.track_show == "1"  ){
				//如果轨迹为true就显示
				$('.aerial_map').show();
			}else{
				$('.aerial_map').hide();
			}
			if( data.video_list_show == "1"  ){
				//如果左侧列表为true就展开，否则收缩起来
				zObj.pTimer = setTimeout(function(){
					$(".aerial_playlist").stop().animate({
						"left" : 0
					},500)
				},700);
				onoffBtn = false;
			}else{
				zObj.pTimer = setTimeout(function(){
					$(".aerial_playlist").stop().animate({
						"left" : -210
					},500)
				},700);
				onoffBtn = true;
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
			headerLen = $(".video_header_list2 li:visible").length;
			$(".video_header_list2 li:visible").css("width", parseInt($(".video_header_list2").width()/headerLen) )

			AerialVideoView.creatVideo(data.file_url);//初始化，创建视频插件

		},
		initBindDomEvent: function(){
			
			//左侧菜单选中状态
			$('.playlist_list').on('click','.video-url',function () {
				var that = $(this);				
				that.addClass('icur').siblings().removeClass('icur');
				
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

						if( zyghOnoff == false ){
							loadZyMap(response.trackstr[0].base_id);
							zyghOnoff = true;
						}else{

							zyghOnoff = false;
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
						headerLen = $(".video_header_list2 li:visible").length;
						$(".video_header_list2 li:visible").css("width", parseInt($(".video_header_list2").width()/headerLen) )

						AerialVideoView.creatVideo2(that.attr("data-video-url"));//左侧菜单点击时，每次都得重新创建一次视频插件，否则会出问题
						
					},
					error: function(e) {
						try {
							console.log(opt)
						} catch (e) {}
					}
				 });
				
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
				$(".smallbtn_map").hide();	
				$(".bigbtn_map").show();	
			});
			$(".bigbtn_map").click(function(){
				$(".aerial_map").show();
				$(".smallbtn_map").show();	
				$(".bigbtn_map").hide();	
			});
			
		},
		resizeFn: function () {

			$(document).scrollTop(0);

			clearTimeout( AerialVideoView.FontTimer );
			FontTimer = setTimeout( AerialVideoView.FontSize , 500 );

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
			$(".aerial_playlist").css({
				//"min-height" : $(document).height() - oHeaderH -IESpace,
					  "height" :  oWindowH - oHeaderH  -IESpace
			});
			$("#video_block").css({
				  "min-height" : 500 - oHeaderH -IESpace,
					  "height" : oWindowH - oHeaderH  -IESpace
			});
			$("#danmuarea").css({
				  "min-height" : 500 - oHeaderH -IESpace,
					  "height" : oWindowH - oHeaderH  -IESpace
			});
			$(".aerial_playlist").niceScroll({cursorcolor:"#919191",cursorwidth:6,cursoropacitymax:0.7,touchbehavior:false,autohidemode:false});
			$(".card_dialog .modal_body").niceScroll({cursorcolor:"#919191",cursorwidth:6,cursoropacitymax:0.7,touchbehavior:false,autohidemode:false});
			$(".scene_dialog .modal_body").niceScroll({cursorcolor:"#919191",cursorwidth:6,cursoropacitymax:0.7,touchbehavior:false,autohidemode:false});
			oWindowH < 500 ? $(".pano_dialog").addClass("pano_top") : 	$(".pano_dialog").removeClass("pano_top")
			
			//头部计算
			if(oWindowW<1280){
				$(".item_EV").hide();
				$(".item_ISO").hide();
			}else{
				$(".item_EV").show();
				$(".item_ISO").show();	
			}
			headerLen = $(".video_header_list2 li:visible").length;
			$(".video_header_list2 li:visible").css("width", parseInt($(".video_header_list2").width()/headerLen) )

		},
		initializeGoogelMaps: function (data,index_) {
			flightPlanSite=[];
			if(data[0].track_list == ""){
				$(".aerial_map").hide();
				return;
			}else
				$(".aerial_map").show();
				
				
			var bounds = new google.maps.LatLngBounds();
			
			
			for (var indx in data) {
				var list = data[indx].track_list;
				for (var item in list) {
					var gps = list[item].GPS;
					gps = gps.replace(/[()]/g, "");
					gps = gps.split(",");
					
					var temp = new google.maps.LatLng( parseFloat(gps[1]), parseFloat(gps[0]) );
					var tempLat =  parseFloat(gps[1]);
					var tempLing = parseFloat(gps[0]);
					var tempAlt = list[item].BAROMETER;
					var tempISO = list[item].ISO.split(":")[1];
					var tempEV = list[item].EV.split(":")[1];
					var tempShutter = list[item].Shutter.split(":")[1];
					var tempFnum = list[item].Fnum.split(":")[1];
					tempAlt = tempAlt.split(":");  
					tempAlt = tempAlt[1]
					
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

		creatVideo : function(videoURL){
			
			scriptAdd  = '<video id="example-video" class="video-js vjs-default-skin vjs-big-play-centered" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
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
								$("#isotude").html( ISOPlanSite[index_] );
								$("#evtude").html( EVPlanSite[index_] );
								$("#shuttertude").html( ShutterPlanSite[index_] );
								$("#Fnumtude").html( FnumPlanSite[index_] );
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
				
					playTimer = setInterval(function(){
						timeout();
					},1000);
				
			})	
			
		},
		creatVideo2 : function(videoURL){
			player.dispose();//清理
			scriptAdd  = '<video id="example-video" class="video-js vjs-default-skin vjs-big-play-centered" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
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
								$("#isotude").html( ISOPlanSite[index_] );
								$("#evtude").html( EVPlanSite[index_] );
								$("#shuttertude").html( ShutterPlanSite[index_] );
								$("#fnumtude").html( FnumPlanSite[index_] );
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
						onoffBtn = false;
					}else{
						zObj.pTimer = setTimeout(function() {
							$(".aerial_playlist").stop().animate({
								left: -210
							}, 300)
						}, 300);	
						onoffBtn = true;
					}
				});
				$("#BarOnoff").mouseleave(function(){
					clearTimeout( zObj.pTimer );
					zObj.pTimer = setTimeout(function() {
							$(".aerial_playlist").stop().animate({
								left: -210
							}, 300)
						}, 1000);
					onoffBtn = true;
				});
				$(".aerial_playlist").mousemove(function(){
					clearTimeout( zObj.pTimer );
					zObj.pTimer = setTimeout(function() {
							$(".aerial_playlist").stop().animate({
								left: 0
							}, 300)
						}, 300);
					onoffBtn = false;
				});
				$(".aerial_playlist").mouseleave(function(){
					clearTimeout( zObj.pTimer );
					zObj.pTimer = setTimeout(function() {
							$(".aerial_playlist").stop().animate({
								left: -210
							}, 300)
						}, 300);
					onoffBtn = true;
				});
		},
		FontSize : function(){
			document.documentElement.style.fontSize = parseInt((document.documentElement.clientWidth > 414 ? 414 : 	document.documentElement.clientWidth)/12)+'px';
		}
	};
	AerialVideoView.init();
})($);
