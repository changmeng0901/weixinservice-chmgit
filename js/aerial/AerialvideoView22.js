// JavaScript Document

//---------------------------------竖屏地图航线
xc_zoomSet = true;
var zyghOnoffTT = true;	
var map;
var flightPathTT;
var FirstMarkerTT,
		LastMarkerTT,
		AnimateMarkerTT,
		playTimerTT,
		scrollZoomTT;
		
var iframeSearch = location.search.split("&");
var getGroupId = iframeSearch[0].split("=")[1];
var getTestUrl = iframeSearch[1].split("=")[1];
var operTypeUrl = iframeSearch[2].split("=")[1];//1:企业航拍视频列表（查看企业所有视频） 2：航拍组视频列表（按分
var ParameterMethod,
		pageUrl;
		
	var playerTT; 	
	
var indexTT_ = 0;	

var poTT;
var aPositionTT;		
var myoverlayTT;
var scriptAddTT;
var pointTT;
var latPoTT;



			

var onoffBtnTT = true;
alert(3333)

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

	
var flightPlanSiteTT = [],
				arrLatTT = [],
				arrLingTT = [],
				arrAltTT = [],
				arrISOTT = [],
				arrEVTT = [],
				arrShutterTT = [],
				arrFnumTT = [];
	var zObjTT = {};
	var headerLenTT;

	var AerialVideoViewTT = {
		init: function () {
			AerialVideoViewTT.playlistAnimate();
			AerialVideoViewTT.initBindDomEvent()
			//AerialVideoViewTT.sliderMapBar();
			AerialVideoViewTT.getFlightPlanSite();
			AerialVideoViewTT.resizeFn();
			$(window).resize( AerialVideoViewTT.resizeFn );
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
			
			ParameterMethod = AerialVideoViewTT.makeParameterMethod("aerial.video.group.data");
			if(operTypeUrl=="1"){//1:企业航拍视频列表（查看企业所有视频） 2：航拍组视频列表（按分组查看）
				groupId = AerialVideoViewTT.makeTwoParameterField("group_id","","entId",getGroupId);
			}else if(operTypeUrl=="2"){				
				groupId = AerialVideoViewTT.makeTwoParameterField("group_id",getGroupId,"entId","");
			}
			
			pageUrl = getTestUrl +"/rest/1.0/aerialVideo?v=1.0&format=json"+ ParameterMethod + groupId;

			$.ajax({
			 	type: "GET",
			 	timeout: 1000,
			 	url: pageUrl,
			 	dataType: "jsonp",
			 	jsonp: 'callback',
			 	success: function(response) {
					
					AerialVideoViewTT.initializeGoogelMaps(response.groupstr.list,0);
					//zyghOnoffTT = true;
					if( response.groupstr.assets_show == "1" && response.groupstr.list[0].track_list!="" ){
						loadZyMap(response.groupstr.list[0].base_id);
						zyghOnoffTT = false;
					}
					if( response.groupstr.assets_show == "1" ){
						zyghOnoffTT = false;
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
						base_id : groupstr.list[0].base_id,
						video_list_show : groupstr.video_list_show,  //左侧视频列表展开或收缩
						business_card_show : groupstr.business_card_show,  //头部企业名片显示隐藏
						track_show : groupstr.track_show,  //轨迹显示或隐藏
						assets_show : groupstr.assets_show,  //资源规划
						logo_show : groupstr.logo_show,//是否显示企业LOGO
					 };
					 
					 
					 AerialVideoViewTT.enterpriseInfoModal(enterpriseInfoData);
					 //初始化完地图，再去往左侧菜单添加数据
					 AerialVideoViewTT.sliderMapBar(response.groupstr.list);
			 	},
			 	error: function(e) {
			 		try {
			 			console.log(opt)
			 		} catch (e) {}
			 	}
			 });

		},
		sliderMapBar: function (data) {
			var $playlistList = $('.playlist_list22'),
				sliderItemStr = '';
			for (var item in data) {
				
				currentStyle = item == 0 ? 'icur' : '';
				sliderItemStr  += '<dl class="item22 video-url '+currentStyle+
								  '" data-video-url="'+ data[item].file_url +
								  '" data-id="'+ data[item].id +
								  '" base-id="'+ data[item].base_id +
								  '" data-description="'+ data[item].description +
								  '"><dt><img src="'+data[item].thumbnail_image_url+
								  '" /><p class="video_stro22 font12"><img src="../images/aerial/icon_mnplay.png" /><span>'+data[item].aerial_name+
								  '</span></p><i class="v_mark22"></i></dt><dd>'+data[item].description
								  +'</dd></dl>'
			}
			$playlistList.append(sliderItemStr);

		},
		enterpriseInfoModal : function(data){
			
			//@@航拍页面弹框等基础数据初始化
			$('#qy_logo22').attr('src',data.logo_img);
			$('#qycard_name22').html( data.business_name );
			$('#qycard_phone22').html( data.business_tel );
			$('#qycard_mail22').html( data.business_email );
			$('#qycard_weibo22').html( data.business_weibo );
			$('#qycard_addr22').html( data.business_address );
			$('#qycard_intro22').html( data.business_card_introduce );
			
			if( data.description != ''){
				$('#scene_description22').append(data.description);
			}else{
				$('.item_scence22').hide();	
			}
			if( data.logo_img == "1" ){ 
				//如果企业、logo为true就显示
				$('#qy_logo_li22').show();
			}else{
				$('#qy_logo_li22').hide();
			}
			if( data.business_card_show == "1"  ){
				//如果头部企业名片为true就显示
				$('.item_qycard22').show();
			}else{
				$('.item_qycard22').hide();
			}
			if(data.track_list==""){
				$('.googlemap_wap22').hide();
			}else{
				if( data.track_show == "1" ){
					//如果轨迹为true就显示
					$('.googlemap_wap22').show();
				}else{
					$('.googlemap_wap22').hide();
				}
			}
			
			

			AerialVideoViewTT.creatVideo(data.file_url);//初始化，创建视频插件

		},
		initBindDomEvent: function(){
			
			

			//手机竖屏列表选中状态(即横屏的左侧菜单)
			$('.playlist_list22').on('click','.video-url',function () {
				var that = $(this);				
				that.addClass('icur').siblings().removeClass('icur');
				
				ParameterMethod = AerialVideoViewTT.makeParameterMethod("aerial.track.data"),
				groupId = AerialVideoViewTT.makeParameterField("aerial_video_id",that.attr('data-id'));
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
						AerialVideoViewTT.initializeGoogelMaps(response.trackstr,0);
						//取轨迹的第一个值，如果有初始化页面头部的值，没有显示--
						var list = response.trackstr[0].track_list;	
						if(list!=""){	
							var item=0;
							var gps = list[item].GPS;
							gps = gps.replace(/[()]/g, "");
							gps = gps.split(",");	
						}else{
						}

						if( zyghOnoffTT == false && list!="" ){
							loadZyMap(response.trackstr[0].base_id);
						}
						
						if( that.attr("data-description")!= ''){
							$('.item_scence22').show();	
							$('#scene_description22').html(that.attr("data-description"));
						}else{
							$('.item_scence22').hide();	
						}
						
						headerLenTT = $(".video_info22 li:visible").length;
						$(".video_info22 li:visible").css("width", parseInt($(".video_info22").width()/headerLenTT) )

						AerialVideoViewTT.creatVideo2(that.attr("data-video-url"));//左侧菜单点击时，每次都得重新创建一次视频插件，否则会出问题
						
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
			
		},
		resizeFn: function () {

			$(document).scrollTop(0);

			//(4)计算主体高度
			var oWindowW = $(window).width();
			var oWindowH = $(window).height();
			var oHeaderH = $('.video_header_wap').outerHeight();
			var oFooterH = $('.video_footer_wap').outerHeight();

			$(".aerial_playlist").niceScroll({cursorcolor:"#919191",cursorwidth:6,cursoropacitymax:0.7,touchbehavior:false,autohidemode:false});
			$(".card_dialog .modal_body").niceScroll({cursorcolor:"#919191",cursorwidth:6,cursoropacitymax:0.7,touchbehavior:false,autohidemode:false});
			$(".scene_dialog .modal_body").niceScroll({cursorcolor:"#919191",cursorwidth:6,cursoropacitymax:0.7,touchbehavior:false,autohidemode:false});
			oWindowH < 500 ? $(".pano_dialog").addClass("pano_top") : 	$(".pano_dialog").removeClass("pano_top")
			
			headerLenTT = $(".video_info22 li:visible").length;
			$(".video_info22 li:visible").css("width", parseInt($(".video_info22").width()/headerLenTT) )

		},
		initializeGoogelMaps: function (data,indexTT_) {
			flightPlanSiteTT=[];
			if(data[0].track_list == ""){
				$(".googlemap_wap22").hide();
				return;
			}else{
				$(".googlemap_wap22").show();
			}	
				
			var boundsTT = new google.maps.LatLngBounds();
			
			
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
					
					boundsTT.extend(temp);
					scrollZoomTT = getBoundsZoomLevel(boundsTT);
										
					flightPlanSiteTT.push( temp );//x和y
					arrLatTT.push( tempLat );//x
					arrLingTT.push( tempLing );//y
					arrAltTT.push( tempAlt );//海拔
					arrISOTT.push( tempISO );//ISO
					arrEVTT.push( tempEV );//EV
					arrShutterTT.push( tempShutter );//Shutter快门
					arrFnumTT.push( tempFnum );//Fnum
				}
			}

			//console.log(flightPlanSiteTT);
			
			LatPlanSite = arrLatTT;
			LingPlanSite = arrLingTT;
			AltPlanSite = arrAltTT;
			ISOPlanSite = arrISOTT;
			EVPlanSite = arrEVTT;
			ShutterPlanSite = arrShutterTT;
			FnumPlanSite = arrFnumTT;

			var myLatLng = flightPlanSiteTT[0];
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
		    	map = new google.maps.Map(document.getElementById("map-canvas22"), myOptions);//初始化地图
			}
			else{
				map.setOptions(myOptions);
			}
			if(!boundsTT.isEmpty()){
						scrollZoomTT = getBoundsZoomLevel(boundsTT);
						if(typeof(scrollZoomTT) != "undefined" && scrollZoomTT >0)
							map.setZoom(scrollZoomTT);
					}
					//console.log(scrollZoomTT)
			//alert(flightPlanSiteTT)
			if(typeof(flightPathTT)=="undefined"){
				flightPathTT = new google.maps.Polyline({//类型为直线的
					path: flightPlanSiteTT,
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2
		    	});
			}else{
				flightPathTT.setPath(flightPlanSiteTT);
			}
		    

			if(typeof(FirstMarkerTT)=="undefined"){
				FirstMarkerTT = new google.maps.Marker({  //起点
					icon:"../images/commons/icon_plane2.png",
					map: map,
					position:  flightPlanSiteTT[0],
				});
			}else{
				FirstMarkerTT.setPosition(flightPlanSiteTT[0]);
				
			}
			
			if(typeof(LastMarkerTT)=="undefined"){
				LastMarkerTT = new google.maps.Marker({  //终点
					icon:"../images/commons/icon_plane2.png",
					map: map,
					position:  flightPlanSiteTT[flightPlanSiteTT.length-1],
				});
			}else{
				LastMarkerTT.setPosition( flightPlanSiteTT[flightPlanSiteTT.length-1]);
			}
			
			if(typeof(AnimateMarkerTT)=="undefined"){
				AnimateMarkerTT = new google.maps.Marker({  //动态滑动点
					icon:"../images/commons/icon_plane4.png",
					map: map,
				});
			}
					
			
			flightPathTT.setMap( map );
			
			myoverlayTT = new MyOverlay(map);			
			

		},

		creatVideo : function(videoURL){
			
			scriptAddTT  = '<video id="example-video22" class="video-js vjs-default-skin vjs-big-play-centered" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
			$("#video_block22").html(scriptAddTT);
			playerTT = videojs("example-video22");
			playerTT.pause();
					
					function timeout(){
						indexTT_=Math.round(playerTT.currentTime());//获取到视频的当前时间，即播放进度
						if( indexTT_ < flightPlanSiteTT.length ){
							console.log(flightPlanSiteTT.length)
							console.log(indexTT_)
							//myoverlayTT = new MyOverlay(map);
							
							
							aPositionTT = flightPlanSiteTT[indexTT_];//获取坐标，之后动态滑点每次都居中
							poTT = myoverlayTT.getProjection();
							pointTT = poTT.fromLatLngToContainerPixel(aPositionTT);
							pointTT.y = pointTT.y+17;
							latPoTT = poTT.fromContainerPixelToLatLng(pointTT)
							AnimateMarkerTT.setPosition( latPoTT );
							map.setCenter(latPoTT);
							indexTT_++;
						}else{
							clearInterval( playTimerTT );
						}
					}
					playTimerTT = setTimeout(function(){
						timeout();
					},1000);
			playerTT.on('pause',function(){
				clearTimeout(playTimerTT);
				indexTT_=Math.round(playerTT.currentTime());
			});

	
			playerTT.on('play',function(){
				playTimerTT = setInterval(function(){
					timeout();
				},1000);
			})	
			
		},
		creatVideo2 : function(videoURL){
			playerTT.dispose();//清理
			scriptAddTT  = '<video id="example-video22" class="video-js vjs-default-skin vjs-big-play-centered" controls><source src="'+videoURL+'" type="application/x-mpegURL"/></video>';
			$("#video_block22").html(scriptAddTT);
			playerTT = videojs("example-video22");
			playerTT.pause();
			clearInterval( playTimerTT );
					
					function timeout(){
							indexTT_=Math.round(playerTT.currentTime());
							if( indexTT_ < flightPlanSiteTT.length ){
								console.log(flightPlanSiteTT.length)
								console.log(indexTT_)
								//myoverlayTT = new MyOverlay(map);
								
								
								aPositionTT = flightPlanSiteTT[indexTT_];//获取坐标，之后动态滑点每次都居中
								poTT = myoverlayTT.getProjection();
								pointTT = poTT.fromLatLngToContainerPixel(aPositionTT);
								pointTT.y = pointTT.y+17;
								latPoTT = poTT.fromContainerPixelToLatLng(pointTT)
								AnimateMarkerTT.setPosition( latPoTT );
								map.setCenter(latPoTT);
								indexTT_++;
							}else{
								clearInterval( playTimerTT );
							}
						}
						playTimerTT = setTimeout(function(){
							timeout();
						},1000);
			playerTT.on('pause',function(){
				clearInterval(playTimerTT);
				indexTT_=Math.round(playerTT.currentTime());
			});
			
			
			
				
			playerTT.on('play',function(){
				
					
					playTimerTT = setInterval(function(){
						timeout();
					},1000);
				
			})	
		},
		playlistAnimate: function () {
				
		}
	};
	AerialVideoViewTT.init();
})($);

