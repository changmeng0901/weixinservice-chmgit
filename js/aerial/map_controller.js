var map; //地图

var assetRoot="";
var ajaxRoot="";

//var farme_baseID = 106; //农场ID
//var googleMap_center = ["31.5988745972896", "121.806326508522"]; //地图中心点

var googleMap_center = [];
var iframeSearch = location.search.split("&");
var farme_baseID = iframeSearch[0].split("=")[1];
//googleMap_center.push(iframeSearch[1].split("=")[1]);
//googleMap_center.push(iframeSearch[2].split("=")[1]);

assetRoot=iframeSearch[1].split("=")[1];
ajaxRoot=assetRoot+'/rest/1.0/service?v=1.0&format=json&sign=5C21760DB93BB7B1A2CD0A9BE6B1E67E';

function loadZyMap(farme_baseID){
	//gMapInit(document.getElementById("map-canvas"), googleMap_center);
	google.maps.event.addListenerOnce(map, 'idle', function() {
		var overlay = new MyOverlay(map);
		if(typeof(idleFirst)!='undefined')
			idleFirst();
		ajaxConfig({ //106//162
				url: ajaxRoot + makeParameter_Method('base') + makeParameter_Field("base_id", farme_baseID),
				backfun: function(json) {
					loadC1(json.markstr);
					loadC2(json.secondstr);
					loadC3(json.thirdstr);
					loadC4Img(json.thirdstr);
					$("#map_loading").hide();
					$(".mengb").hide();
					loadDevice(); //传感器 气象站 视频 全景
				}
			});
			//
		ajaxConfig({
			url: ajaxRoot + makeParameter_Method('report') + makeParameter_Field("base_id", farme_baseID),
			backfun: function(json) {
				loadWeatherInfo(json);
			}
		});
		//
		var windowH=$(window).height();
		if(windowH<500){
			$("#ppvs").attr("height","230");
			$("#video_iframe,#video_iframe2,#video_iframe3,#video_iframe4").css("height","300px");
			$("#video_iframe,#video_iframe2,#video_iframe3,#video_iframe4").css("margin-top","-150px");
			$(".videobg,.videoimg").css("height","230px");
			$("#PlayViewOCX").attr("height","230");
			vHeight=300;
			}
	});
	//
	$(".mengb").click(clearPop);
	$(".popOutClose").click(function() {
		$(".mengb").trigger("click");
	});

	try {
		var OCXobj = document.getElementById("PlayViewOCX");
		OCXobj.SetOcxMode(0);
		openVideo();
	} catch (e) {

	}
};



MyOverlay.prototype = new google.maps.OverlayView();
MyOverlay.prototype.onAdd = function() { }
MyOverlay.prototype.onRemove = function() { }
MyOverlay.prototype.draw = function() {
	projection = this.getProjection();
}
function MyOverlay(map) { this.setMap(map); }
var projection;

var centerMarker;
function loadC1(markstr) {
	//console.log(markstr)
	//console.log([markstr[0].coordinateX, markstr[0].coordinateY])
	//gMapInit(document.getElementById("map-canvas"), [markstr[0].coordinateX, markstr[0].coordinateY]);
	//一级域markstr
	var calcZoom = 16;
	for (var i = 0; i < markstr.length; i++) {
		var k1Arr = [];
		var coordinateGroup = markstr[i]["coordinateGroup"];
		var bounds = new google.maps.LatLngBounds();
		coordinateGroup = coordinateGroup.replace(/[()]/g, '');
		if (coordinateGroup.length == 0)
			continue;
		coordinateGroup = coordinateGroup.split("_");
		for (var j = 0; j < coordinateGroup.length; j++) {
			k1Arr.push(coordinateGroup[j].split(","));
			bounds.extend(makeLatLng(coordinateGroup[j].split(",")));
		};
		if(!bounds.isEmpty()){
			calcZoom = getBoundsZoomLevel(bounds);
			//if(typeof(calcZoom) != "undefined" && calcZoom >0)
			//	map.setZoom(calcZoom);
        }
		drawingPolygon(k1Arr, markstr[i]['color'], 1);
		var k1Marker = setMarker([markstr[i].coordinateX, markstr[i].coordinateY], markstr[i].name);
		k1Marker.parentData = markstr[i];
		google.maps.event.addDomListener(k1Marker, 'click', function(event) {
			farmeInfoShow(k1Marker);
		});
		centerMarker = k1Marker;
		new Wenzi(makeLatLng([markstr[i].coordinateX, markstr[i].coordinateY]), markstr[i].name, map, 1);
	}
	if(typeof(idleDoSomething)!='undefined'){
		centerMarker.setMap(null);
		setTimeout(function(){idleDoSomething();},1);
	}
}

function loadC2(secondstr) {
	//二级域secondstr
	for (var i = 0; i < secondstr.length; i++) {
		var k2Arr = [];
		var coordinateGroup = secondstr[i]["coordinateGroup"];
		var bounds = new google.maps.LatLngBounds();
		coordinateGroup = coordinateGroup.replace(/[()]/g, '');
		if (coordinateGroup.length == 0)
			continue;
		coordinateGroup = coordinateGroup.split("_");
		for (var j = 0; j < coordinateGroup.length; j++) {
			var arr = coordinateGroup[j].split(",");
			bounds.extend(makeLatLng(arr));
			k2Arr.push(arr);
		};
		new Wenzi(bounds.getCenter(), secondstr[i]["name"], map, 2);
		drawingPolygon(k2Arr, secondstr[i]['color'], 2);
	}
}

function loadC3(thirdstr) {
	//console.log(thirdstr)
	//三级域thirdstr
	for (var i = 0; i < thirdstr.length; i++) {
		var k3Arr = [];
		var coordinateGroup = thirdstr[i]["coordinateGroup"];
		var bounds = new google.maps.LatLngBounds();
		coordinateGroup = coordinateGroup.replace(/[()]/g, '');
		if (coordinateGroup.length == 0)
			continue;
		coordinateGroup = coordinateGroup.split("_");
		for (var j = 0; j < coordinateGroup.length; j++) {
			var arr = coordinateGroup[j].split(",");
			bounds.extend(makeLatLng(arr));
			k3Arr.push(arr);
		};
        var centerpoint = new google.maps.LatLng(parseFloat(thirdstr[i].latitude),parseFloat(thirdstr[i].longitude));
		new Wenzi(centerpoint, thirdstr[i]["tunnelName"], map, 3);
		drawingPolygon(k3Arr, thirdstr[i]['color'], 3);
	}
}
//
function loadC4Img(thirdstr) {

	var nowDate = new Date().getTime();
	for (var i = 0; i < thirdstr.length; i++) {
		var tempb = false;
		var left, right, imgUrl;
		if (thirdstr[i].realPlantLength == 0) {
			imgUrl = '/asset/images/wt.png';
		} else if (thirdstr[i].realPlantLength > 1) {
			imgUrl = '/asset/images/dt.png';
		} else {
			if(thirdstr[i].realPlantImage == ""){
				imgUrl = '/asset/images/wt.png';
			}else{
				imgUrl = thirdstr[i].realPlantImage+"@60h_60w|60-1ci.png";
			}
		}
		var coordinateGroup = thirdstr[i]["coordinateGroup"];
		coordinateGroup = coordinateGroup.replace(/[()]/g, '').split("_");
		var bounds = new google.maps.LatLngBounds();
		for (var j = 0; j < coordinateGroup.length; j++) {
			var arr = coordinateGroup[j].split(",");
			bounds.extend(makeLatLng(arr));
		};
		left = new google.maps.LatLng(parseFloat(thirdstr[i].latitude) + 0.0000424, parseFloat(thirdstr[i].longitude) + 0.000055);
		right = new google.maps.LatLng(parseFloat(thirdstr[i].latitude) - 0.000045, parseFloat(thirdstr[i].longitude) - 0.000060);
		var newBounds = new google.maps.LatLngBounds(right, left);
		new USGSOverlay(newBounds, imgUrl, map, thirdstr[i], tempb);
			//tempb目前缺少
	}
}
//传感器和气象站marker
function loadC5deviceStr(deviceStr) {
	//console.log(deviceStr)
	if (deviceStr.length == 0) {
		return
	}
	for (var i = 0; i < deviceStr.length; i++) {
		var device = deviceStr[i];
		var latlng = makeLatLng([device.coordinateX, device.coordinateY]);
		var arr = {};
		arr.device_ = device.deviceType;
		//		if(device.deviceType=='1'){
		//			console.log(device.sn;)
		//		}
		arr.device_base_id = device.baseId;
		arr.device_partition_id = device.partitionId;
		arr.device_id = device.id;
		arr.device_sn = device.sn;
		arr.device_name = device.name;
		arr.device_description = device.description;
		arr.device_factory = device.factoryTime;
		arr.device_deviceType = device.deviceType;
		arr.device_type_id = device.deviceTypeId;
		arr.device_coordinateX = device.coordinateX;
		arr.device_coordinateY = device.coordinateY;
		arr.device_status = device.status;
		arr._index = i;
		//console.log(arr)
		new CustomOverlay(map, '', latlng, arr);
	}
}
//监控marker
function loadMonitor(videoStr) {
	if (videoStr.length == 0) {
		return;
	}
	for (var i = 0; i < videoStr.length; i++) {
		var temp = videoStr[i];
		var arr = {};
		arr.device_ = 3;
		arr.video_id = temp.videoId;
		arr.video_sn = temp.sn;
		arr.video_name = temp.name;
		arr.video_description = temp.description;
		arr.video_coordinateX = temp.coordinateX;
		arr.video_coordinateY = temp.coordinateY;
		arr.video_status = temp.status;
		var selected = temp.selected ? 0 : 1;
		arr.video_selected = selected;
		arr.video_factoryTime = temp.factoryTime;
		arr.video_ip = temp.ip;
		arr.video_channel_no = temp.channelNo;
		arr.video_device_video_channel_no = temp.deviceVideoChannelNo;
		arr.video_username = temp.username;
		arr.video_password = temp.password;
		arr.video_app_ip = temp.appIp;
		arr.video_app_port = temp.appPort;
		arr.video_app_device_video_channel_no = temp.appDeviceVideoChannelNo;
		arr.video_app_username = temp.appUsername;
		arr.video_app_password = temp.appPassword;
		arr.video_type_id = temp.deviceTypeId;
		arr.video_access_way = temp.accessWay;
		arr.video_webcam_url = temp.webcamUrl;
		arr.video_app_web_port = temp.appWebPort;
		arr._index = i;
		var latlng = makeLatLng([temp.coordinateX, temp.coordinateY]);
		//console.log(latlng)
		var custom = new CustomOverlay(map, "", latlng, arr);
		//videoArray.push(custom);
	}
	//video_index = videoStr.length;
}
//360度全景marker
function loadsixth(krpanoStr) {
	for (var i = 0; i < krpanoStr.length; i++) {
		var temp = krpanoStr[i];
		var arr = {};
		arr.device_ = 4;
		arr.krpano_id = temp.id;
		arr.krpano_sn = temp.sn;
		arr.krpano_name = temp.name;
		arr.krpano_coordinateX = temp.coordinateX;
		arr.krpano_coordinateY = temp.coordinateY;
		arr.krpano_front_url = temp.frontUrl;
		arr.krpano_back_url = temp.backUrl;
		arr.krpano_left_url = temp.leftUrl;
		arr.krpano_right_url = temp.rightUrl;
		arr.krpano_up_url = temp.upUrl;
		arr.krpano_down_url = temp.downUrl;
		arr.krpano_base_id = temp.baseId;
		arr.krpano_partions_id = temp.partionsId;
		arr.krpano_tunnel_info_id = temp.tunnelInfoId;
		arr.krpano_file_fold = temp.filefold;
		arr.krpano_fold_name = temp.foldName;
		arr.enterid = temp.enterpriseInfoId;
		arr.fileType = temp.fileType;
		arr._index = i;
		var latlng = makeLatLng([temp.coordinateX, temp.coordinateY]);
		var custom = new CustomOverlay(map, '', latlng, arr);
		//krpanoArray.push(custom);
	}
	//krpano_index = krpanoStr.length;
}
//
function clearPop() {
	closeVideo();
	closeVideo2();
	closeVideo3();
	closeVideo4();
	if ($("#map_loading").is(":hidden")) {
		if ($("#farmeImg").length > 0) {
			$("#farmeImg").remove();
		}
		if ($("#krpano_close_btn").length > 0) {
			$("#krpano_close_btn").remove();
		}
		$(".mengb").hide();
		setTimeout(function() {
			$("#farmInfoD").hide();
			$("#xiugeng").hide();
			$("#noCrops").hide();
			$("#sensor").hide();
			$("#weatherStation").hide();
		}, 200);
	}
}
//农场信息弹出
function farmeInfoShow(obj) {
	if(typeof(calcZoom) != "undefined" && calcZoom >0)
		map.setZoom(calcZoom);
	else
		map.setZoom(16);
	map.setCenter(obj.getPosition());
	var parentData = obj.parentData;
	//(1)$(".mengb").show();
	setPopOutDivPosition("#farmInfoD");
	$("#farmInfoD h2").html(parentData.name);
	$("#farmInfoD .farmpic img").attr("src", parentData.baseImageUrl); //之前是baseImageUrl
	$("#farmInfoD .fl_concat").html(parentData.contact);
	$("#farmInfoD .phone").html(parentData.phone);
	$("#farmInfoD .cm_address").html(parentData.address);
	$("#farmInfoD .farminfo_footer").html('描述：' + parentData.description);
}
//
function showInfoWindow(obj) {
	//(1)$(".mengb").show();
	//(2)$("#map_loading").show();
	if (obj.realPlantLength > 0) { //有种植物
		ajaxConfig({
			url: ajaxRoot + makeParameter_Method('realplant') + makeParameter_Field("tunnel_info_id", obj.tunnelInfoId),
			backfun: function(json) {
				$("#map_loading").hide();
				addRealPlantInfo(json, 0); //#xiugeng装载种植物数据
			}
		});
	} else { //无种植物--获取地块信息
		ajaxConfig({
			url: ajaxRoot + makeParameter_Method('tunnel') + makeParameter_Field("tunnel_info_id", obj.tunnelInfoId),
			backfun: function(json) {
				$("#map_loading").hide();
				addTunnelInfo(json); //#noCrops装载地块数据
				setPopOutDivPosition("#noCrops");
			}
		});
	}
}
//
function setPopOutDivPosition(id) {
	var infodW = $(id).width();
	var infodH = $(id).height();
	var DW = $(".map_content").width();
	var DH = $(".map_content").height();
	if (infodH * 2 + 30 <= DH) {
		$(id).css({
			"left": (DW - infodW) / 2 - 3,
			"top": DH / 2 - infodH - 30
		}).show();
		$(id).children(".supIco").show();
	} else {
		$(id).css({
			"left": (DW - infodW) / 2 - 3,
			"top": (DH - infodH) / 2
		}).show();
		$(id).children(".supIco").hide();
	}
}
//
function loadDevice() {
	ajaxConfig({
		url: ajaxRoot + makeParameter_Method('device') + makeParameter_Field("base_id",farme_baseID),
		backfun: function(json) {
			loadC5deviceStr(json.deviceStr); //传感器 气象站
			loadMonitor(json.videoStr) ;//视频
			loadsixth(json.krpanoStr); //全景
		}
	});
}
///
function addRealPlantInfo(obj, index) {
	var b, e;
	var x = new Array();
	var y = new Array();
	var real = obj.realPlantInfo[index];
	if (real.floristicsType == 2) {
		var dz = (real.dingm < 10 ? "0" + real.dingm : real.dingm) + "-" + (real.dingd < 10 ? "0" + real.dingd : real.dingd);
		var cs = (real.kaim < 10 ? "0" + real.kaim : real.kaim) + "-" + (real.kaid < 10 ? "0" + real.kaid : real.kaid);
		var js = (real.jiem < 10 ? "0" + real.jiem : real.jiem) + "-" + (real.jied < 10 ? "0" + real.jied : real.jied);
		$(".xiugeng_hasData_begin").html("落叶休眠<br>" + dz);
		$(".xiugeng_hasData_center").html("采收开始<br>" + cs);
		$(".xiugeng_hasData_end").html("采收结束<br>" + js);
		$("#xiugeng_noData").hide();
		$("#xiugeng_hasData").show();
		b = cs;
		e = js;
		b = b.split("-")[0];
		e = e.split("-")[0];
	} else {
		if (real.plantId == 0) {
			$(".cropsData_begin").html("休耕开始<br>" + real.middle);
			$(".cropsData_end").html("休耕结束<br>" + real.plantEndTime);
			$("#xiugeng_noData").show();
			$("#xiugeng_hasData").hide();
		} else {
			$(".xiugeng_hasData_begin").html("定植时间<br>" + real.plantBeginTime);
			$(".xiugeng_hasData_center").html("采收开始<br>" + real.middle);
			$(".xiugeng_hasData_end").html("种植结束<br>" + real.plantEndTime);
			$("#xiugeng_noData").hide();
			$("#xiugeng_hasData").show();
		}
		b = real.middle;
		e = real.plantEndTime;
		b = b.split("-")[1];
		e = e.split("-")[1];
	}; //
	if (real.listStr != "") {
		$("#chartInfo").show();
		var ts_s = real.listStr.split(" KG<br/>");
		var tob = {};
		for (var t = 0; t < ts_s.length; t++) {
			var tp = ts_s[t].split(":");
			tob[tp[0]] = tp[1];
		}
		b = parseInt(b, 10);
		e = parseInt(e, 10);
		for (var i = b; i <= 12; i++) {
			if (tob[i + "月"]) {
				y.push(parseFloat(tob[i + "月"]));
				x.push(i + "月");
			}
		}
		if (e < b)
			for (var i = 1; i <= e; i++) {
				if (tob[i + "月"]) {
					y.push(parseFloat(tob[i + "月"]));
					x.push(i + "月");
				}
			}
		$('#chartInfo').highcharts({
			title: {
				text: '',
				x: -20
			},
			subtitle: {
				text: '',
				x: -20
			},
			xAxis: {
				categories: x,
				min: 0
			},
			yAxis: {
				min: 0,
				title: {
					text: '数值(kg)'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				valueSuffix: 'Kg',
				pointFormat: '{point.key}<br/>产量:{point.y}'
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				x: 100,
				y: 100,
				borderWidth: 0
			},
			series: [{
				name: '产量',
				data: y
			}]
		});
	} else {
		$("#chartInfo").hide();
	};
	$("#xiugeng .cropsPic img").attr("src",  real.plantImgRound);
	if (obj.realPlantInfo.length == 1) { //种了1个
		$("#xiugeng h2").html(real.breedName + '&nbsp;&nbsp;' + real.tunnelName);
		$(".data_select").hide();
		$("#realPlantInfo_select").unbind("change").html('');
	} else { //种了好几个
		$("#realPlantInfo_select").unbind("change").html(''); //先解除绑定，否则改变内容也会触发onchange
		$("#xiugeng h2").html(real.tunnelName);
		$(".data_select").css("display", "inline-block");
		for (var j = 0; j < obj.realPlantInfo.length; j++) {
			var options = document.createElement("option");
			options.setAttribute("value", j);
			options.innerHTML = obj.realPlantInfo[j].breedName;
			if (j == index) {
				options.setAttribute("selected", "selected");
			}
			$("#realPlantInfo_select").append(options);
		}
		$("#realPlantInfo_select").selectpicker().selectpicker('val', index);
		$("#realPlantInfo_select").bind("change", function() {
			var val = $(this).val();
			addRealPlantInfo(obj, val);
		});
	};
	$("#xiugeng .farmer_mess").html("农户&nbsp;&nbsp;" + real.farmerName + "&nbsp;&nbsp;" + real.cropArea + "亩/" + real.tunnelArea + "亩");
	setPopOutDivPosition("#xiugeng"); //数据装载完成后弹出指定DIV并定位
	var xiugengH2W=$("#xiugeng h2").width();
	if(xiugengH2W>235){
		$("#xiugeng .data_select").addClass("dsMaxwidth");
	}
	else{
		$("#xiugeng .data_select").removeClass("dsMaxwidth");
	}
}
//
function addTunnelInfo(json) {
	//console.log(json)
	var tunnelInfo = json.tunnelInfo[0];
	var h2text = tunnelInfo.tunnelName + '&nbsp;&nbsp;<span>' + (tunnelInfo.masterType == '' ? "农场管理员" : tunnelInfo.masterType) + '&nbsp;&nbsp;';
	h2text += (tunnelInfo.masterName == '' ? "暂无数据" : tunnelInfo.masterName) + '</span>';
	$("#noCrops h2").html(h2text);
	$("#noCrops .farmer_mess").html('农户&nbsp;&nbsp;' + tunnelInfo.farmerName + '&nbsp;&nbsp;' + tunnelInfo.muArea + '亩/' + tunnelInfo.tunnelArea + '亩');
	var tunnelLandTest = json.tunnelLandTest[0];
	if (json.tunnelLandTest > 0) {
		$("#noCrops .jiance_mechanism").html('检测机构：' + (tunnelLandTest.testOrg == '' ? "暂无数据" : tunnelLandTest.testOrg)).attr("title", (tunnelLandTest.testOrg == '' ? "暂无数据" : tunnelLandTest.testOrg));
		$("#noCrops .jiance_date").html('检测日期：' + (tunnelLandTest.testDate == '' ? "暂无数据" : tunnelLandTest.testDate));
		$("#noCrops .landRecord_wp_p1").eq(0).html(tunnelLandTest.ph == "" ? "--" : tunnelLandTest.ph); //PH
		$("#noCrops .landRecord_wp_p1").eq(1).html(tunnelLandTest.ec == "" ? "--" : tunnelLandTest.ec); //EC
		$("#noCrops .landRecord_wp_p1").eq(2).html(tunnelLandTest.pb == "" ? "--" : tunnelLandTest.pb); //PB
	} else {
		$("#noCrops .jiance_mechanism").html('检测机构：暂无数据');
		$("#noCrops .jiance_date").html('检测日期：暂无数据');
		$("#noCrops .landRecord_wp_p1").eq(0).html("--"); //PH
		$("#noCrops .landRecord_wp_p1").eq(1).html("--"); //PH
		$("#noCrops .landRecord_wp_p1").eq(2).html("--"); //PH
	}
	var tunnelSoilHistory = json.tunnelSoilHistory;
	$("#noCrops .landHistory_list").html("");
	if (tunnelSoilHistory.length == 0) {
		var thisYear = new Date().getFullYear();
		$("#noCrops .landHistory_list").html('<li><p class="historyP1">' + thisYear + '-' + thisYear + '</p><p class="historyP2">暂无数据</p></li>');
	} else {
		for (var i = 0; i < tunnelSoilHistory.length; i++) {
			var lis = '';
			lis += '<li>';
			lis += '<p class="historyP1">';
			lis += tunnelSoilHistory[i].beginTime + '-' + tunnelSoilHistory[i].endTime;
			lis += '</p>';
			lis += '<p class="historyP2">' + tunnelSoilHistory[i].soilData1 + '<span>' + tunnelSoilHistory[i].soilData2 + '</span></p>';
			lis += '</li>';
			$("#noCrops .landHistory_list").append(lis);
		}
	}
}
//
function showDeviceInfoWindow(json) {
	//(1)$(".mengb").show();
	//(2)$("#map_loading").show();
	var deviceType = json.device_;
	var device_type_id = parseInt(json.device_type_id);
	//console.log(deviceType)
	var deviceSn = json.device_sn;
	if (deviceType == '4') { //360
		showKrpano_iframe(json);
	} else if (deviceType == '3') { //video
		showMonitor(json);
	} else if (deviceType == '1') {
		showDevice_environmental(deviceSn, device_type_id); //传感器
	} else if (deviceType == '2') {
		showDevice_weather(deviceSn); //气象站
	}
}
//
function showDevice_environmental(sn, device_type_id) {
	//console.log(sn);
	ajaxConfig({
		url: ajaxRoot + makeParameter_Method('environmental') + makeParameter_Field("sn", sn),
		backfun: function(json) {
			$("#map_loading").hide();
			//console.log(json)
			var reportInfo = json.reportInfo;
			if (device_type_id == 101) {
				$("#sensor h2").html("奥科美二合一传感器");
			} else if (device_type_id == 102) {
				$("#sensor h2").html("奥科美四合一传感器");
			} else if (device_type_id == 103) {
				$("#sensor h2").html("奥科美六合一传感器");
			}
			var sensorSN = '<span>编号：' + sn + '</span>';
			$("#sensor h2").append(sensorSN);
			$("#sensor .sensor_c2_p1").html('露点：' + reportInfo.ludian + ' ℃ ');
			$("#sensor .sensor3date p.font_my").eq(0).html('温度 ' + reportInfo.soilTemp + ' ℃');
			$("#sensor .sensor3date p.font_my").eq(1).html(reportInfo.illumination + 'LUX');
			$("#sensor .sensor3date p.font_my").eq(2).html(reportInfo.co2 + ' ppm');
			$("#sensor .sensor_bottom").html('采集时间：' + reportInfo.genTime);
			$("#sensor .sensor_c2 p").eq(1).html('湿度：' + reportInfo.airHumidity + ' %');
			$("#sensor .sensor_c").html('<img src="' + assetRoot + '/asset/images/cloud.png" />' + reportInfo.airTemp + '℃');
			setPopOutDivPosition("#sensor"); //数据装载完成后弹出指定DIV并定位
		}
	});
}

function showDevice_weather(sn) {
	//console.log(sn)
	//var ssn = 'A010006A00013135000';
	ajaxConfig({
		url: ajaxRoot + makeParameter_Method('weather.station') + makeParameter_Field("device_sn", sn),
		backfun: function(json) {
			//console.log(json);
			$("#map_loading").hide();
			var weatherStation = json.weatherStation;
			$("#weatherStation h2 span").html("编号：" + (weatherStation.device_sn ? weatherStation.device_sn : ""));
			$("#weatherStation .ws_data_1_c").html(parseFloat(weatherStation.air_temp) > -99 ? weatherStation.air_temp + " ℃" : "无数据");
			$("#weatherStation .ws_data_1_time").html("采集时间：" + (weatherStation.gen_time ? weatherStation.gen_time : "无数据"));
			$("#ws_data_1_uld1").html("降水量" + weatherStation.rainfall + "mm");
			$("#ws_data_1_uld2").html(parseFloat(weatherStation.air_humidity) > -99 ? "湿度" + weatherStation.air_humidity + "%" : "");
			$("#ws_data_1_uld3").html(weatherStation.wind_direction ? (weatherStation.wind_direction.flName + weatherStation.wind_direction.flClass) : "");
			var TuRang = ""; //$(".ws_data_1_ul2 li").eq(0).children(".p2")
			if (parseFloat(weatherStation.soil_temp) > -99) { //土壤温度
				TuRang += "温度" + weatherStation.soil_temp + "℃<br/>";
			}
			if (parseFloat(weatherStation.soil_humidity) > -99) { //土壤湿度
				TuRang += "湿度2" + weatherStation.soil_humidity + "%<br/>";
			}
			if (parseFloat(weatherStation.soil_humidity2) > -99) { //土壤湿度2
				TuRang += "湿度2" + weatherStation.soil_humidity2 + "%";
			};
			$(".ws_data_1_ul2 li").eq(0).children(".p2").html(TuRang);
			$(".ws_data_1_ul2 li").eq(1).children(".p2").html((parseFloat(weatherStation.illumination) > -99 ? "光照" + weatherStation.illumination + "LUX<br/>" : "") + (parseFloat(weatherStation.solar_radiation) > -99 ? "辐射" + weatherStation.solar_radiation + "w/㎡" : ""));
			$(".ws_data_1_ul2 li").eq(2).children(".p2").html(parseFloat(weatherStation.atmospheric_pressure) > -99 ? weatherStation.atmospheric_pressure + "Pa" : "");
			$(".ws_data_1_ul2 li").eq(3).children(".p2").html(parseFloat(weatherStation.pm25) > -99 ? weatherStation.pm25 : "");
			setPopOutDivPosition("#weatherStation"); //数据装载完成后弹出指定DIV并定位
		}
	});
}
//
function loadWeatherInfo(json) {
	var reportInfo = json.reportInfo;
	//console.log(reportInfo)
	if (!reportInfo.isok) {
		return;
	};
	$("#weather .w_address").html(reportInfo.district_cn + '&nbsp;&nbsp;' + reportInfo.name_cn);
	var iconTypeRoot = reportInfo.pictureTypeSn == "d/" ? "day" : "night/";
	$("#weather .w_pic1 img").attr("src", assetRoot + '/asset/images/icon/' + iconTypeRoot + (parseInt(reportInfo.pictureType) <= 9 ? "0" + reportInfo.pictureType : reportInfo.pictureType) + '.png');
	$("#weather .w_data1_no").html(reportInfo.airTemp);
	$("#weather .w_data1_c").html(reportInfo.theWeather);
	$("#weather .w_c_High").html(reportInfo.dayHigh + '°');
	$("#weather .w_c_Low").html(reportInfo.dayLow + '°');
	var now = new Date();
	now.setDate(now.getDate() + 1);
	$("#w_data_tomorrow").html(now.format("MM月dd日"));
	now.setDate(now.getDate() + 1);
	$("#w_data_afterTomorrow").html(now.format("MM月dd日"));
	$("#w_data_tomorrow_pic img").attr("src", assetRoot + '/asset/images/icon/day/' + reportInfo.day2 + '.png');
	$("#w_data_afterTomorrow_pic img").attr("src", assetRoot + '/asset/images/icon/day/' + reportInfo.day3 + '.png');
	$("#weather .w_Wrlist_w").html('降水量 ' + reportInfo.rainfall);
	$("#weather .w_Wrlist_r").html(reportInfo.windd + reportInfo.winds + '级');
	$("#w_data_tomorrow_c").html(reportInfo.day2High + '° / ' + reportInfo.day2Low + '°');
	$("#w_data_afterTomorrow_c").html(reportInfo.day3High + '° / ' + reportInfo.day3Low + '°');
	$("#weather").show();
	$("#weather_close").click(function() {
		$("#weather").slideUp("fast");
	});

}

function showKrpano_iframe(json) {
	var oimg = new Image();
	oimg.src = assetRoot + "/asset/images/cose.png";
	oimg.id = "krpano_close_btn";
	if (json.fileType == 1) { //360全景iframe
		var krpano_id = json.krpano_id;
		var base_id = json.krpano_base_id ? json.krpano_base_id : "";
		$("#krpano_iframe").show();
		$(window).bind("resize", resetFrameSize);
		resetFrameSize(); //assetRoot
		var src = assetRoot + "/map/Krpano.seam?type=2&krpano_id=" + krpano_id + "&base_id=" + base_id + "&enterid=" + json.enterid+"&closelogo=1";
		$("#krpano_iframe").attr("src", src);
		$(oimg).css({
			"position": "absolute",
			"right": "0px",
			"top": "0px",
			"cursor": "pointer",
			"z-index": 9999
		});
		$("body").append(oimg);
		$("#krpano_close_btn").unbind("click");
		$("#krpano_close_btn").bind("click", function() {
			closeKrpanoFrame();
			$(this).remove();
		});
		$("#map_loading").hide();
	} else if (json.fileType == 2) { //没有360全景 图片弹出
		var farmeImg = new Image();
		farmeImg.style.position = "absolute";
		farmeImg.style.left = "50%";
		farmeImg.style.zIndex = 1000;
		farmeImg.style.top = "50%";
		farmeImg.id = "farmeImg";
		farmeImg.style.display = "none";
		farmeImg.onload = function() {
			var w = this.width;
			var h = this.height;
			var ww = $(window).width();
			var wh = $(window).height();
			this.setAttribute("width", ""); //解决IE8下自动生成图片宽高属性
			this.setAttribute("height", ""); //解决IE8下自动生成图片宽高属性
			if (w >= ww || h >= wh) {
				if ((w / h) > (ww / wh)) { //超宽
					farmeImg.style.width = ww * 0.8 + 'px';
					farmeImg.style.marginLeft = -ww * 0.8 / 2 + 'px';
					farmeImg.style.marginTop = -(ww * 0.8 / (w / h)) / 2 + "px";
				} else { //超高
					farmeImg.style.height = wh * 0.9 + 'px';
					farmeImg.style.marginLeft = -(wh * 0.9 * (w / h)) / 2 + "px";
					farmeImg.style.marginTop = -(wh * 0.9) / 2 + "px";
				};
			} else {
				farmeImg.style.marginLeft = -w / 2 + 'px';
				farmeImg.style.marginTop = -h / 2 + "px";
			}
			$(farmeImg).delay(200).fadeIn(100, function() {
				setTimeout(function() {
					$(oimg).css({
						"position": "absolute",
						"left": "50%",
						"top": "50%",
						"margin-left": farmeImg.offsetWidth / 2 - 15 + "px",
						"margin-top": -farmeImg.offsetHeight / 2 - 15 + "px",
						"cursor": "pointer",
						"z-index": 9999
					});
					$("body").append(oimg);
					$("#krpano_close_btn").unbind("click");
					$("#krpano_close_btn").bind("click", function() {
						$(this).remove();
						$(".mengb").trigger("click");
					});
				}, 1);
			});
			$("#map_loading").hide();
		};
		farmeImg.src = json.krpano_file_fold;
		$("body").append(farmeImg);
	}
}
//
function closeKrpanoFrame() {
	$(window).unbind("resize", resetFrameSize);
	$("#krpano_iframe").hide();
	$(".mengb").hide();
	$("#krpano_iframe").attr("src", "");
}
//
function resetFrameSize() {
	if ($("#krpano_iframe").is(":visible")) {
		var height = $(window).height();
		var width = document.body.clientWidth;
		$("#krpano_iframe").css({
			"width": width,
			"height": height,
			"position": "fixed",
			"z-index": 1000,
			left: 0,
			top: 0
		});
	}
}
//
function showMonitor(json) {	
	$("#map_loading").hide();
	var tempThis = {};
	tempThis.arr = json;
		//
		//视频
	if (tempThis.arr.video_webcam_url != "" && !/msie/.test(navigator.userAgent.toLowerCase())) {
		vHLSurl = tempThis.arr.video_webcam_url;
		window.a.init();
		//$('#login3').show();
		$("#video_iframe").hide();
		$("#video_iframe2").hide();
		$("#video_iframe3").show();
	} else {
		if (tempThis.arr.video_access_way == null || tempThis.arr.video_access_way == 1) {
			$("#video_iframe2").show();
			strIP = tempThis.arr.video_app_ip;
			strPort = tempThis.arr.video_app_port;
			strName1 = tempThis.arr.video_app_username;
			strPwd1 = tempThis.arr.video_app_password;
			ChanNum1 = tempThis.arr.video_app_device_video_channel_no;
			cameraID1 = tempThis.arr.video_app_device_video_channel_no;
			setTimeout(function() {
				StartPlayView();
				StopPlayView();
			}, 1);
			$("#switch2").closest(".vb").attr("class", "videobut_ vb");
			$("#switch2").unbind("click");
			$("#switch2").bind("click", function() {
				StartPlayView();
				$(this).closest(".vb").attr("class", "videobut vb");
			});

		} else if (tempThis.arr.video_access_way == 2) {
			$("#video_iframe").show();
			szAccount = tempThis.arr.video_sn;
			szRegIP = tempThis.arr.video_ip;
			password = tempThis.arr.video_password;
			username = tempThis.arr.video_username;
			channelNo = tempThis.arr.video_channel_no;
			//setTimeout(function(){videoReady()},1);
			//setTimeout(function(){openVideo();StopPlay();},1);
			$("#switch1").closest(".vb").attr("class", "videobut_ vb");
			$("#switch1").unbind("click");
			$("#switch1").bind("click", function() {
				$(this).closest(".vb").attr("class", "videobut vb");
				openVideo();
			});
		} else if (tempThis.arr.video_access_way == 3) {
			if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
				$(".videoimg__").html("");
				$(".videoimg__").append('<img src="' + assetRoot + '/asset/images/zwsp.png"  height="418" />');
				$("#video_iframe4").show();
			} else {
				$(".videoimg__").html("<div id='divPlugin' style='width:100%;height:100%;'></div>");
				$("#switch3").closest(".vb").attr("class", "videobut_ vb");
				$("#video_iframe4").show();
				// 初始化插件参数及插入插件
				setTimeout(function() {
					WebVideoCtrl.I_InitPlugin("100%", "100%", {
						iWndowType: 1,
						cbSelWnd: function() {}
					});
					WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
					var iChannelID = parseInt(tempThis.arr.video_app_device_video_channel_no, 10); //通道列表
					var appPort = parseInt(tempThis.arr.video_app_web_port, 10);
					var bZeroChannel = false;

					strIP = tempThis.arr.video_app_ip;
					strPort = tempThis.arr.video_app_port;
					strName1 = tempThis.arr.video_app_username;
					strPwd1 = tempThis.arr.video_app_password;
					ChanNum1 = iChannelID;
					webAppPort = appPort;
					bzChannel = bZeroChannel;

					$("#switch3").unbind("click");
					$("#switch3").bind("click", function() {
						$(this).closest(".vb").attr("class", "videobut vb");
						newVideoPreview(strIP, 1, ChanNum1, bzChannel);
					});

					// 登录
					var iRet = WebVideoCtrl.I_Login(tempThis.arr.video_app_ip, 1, appPort, tempThis.arr.video_app_username, tempThis.arr.video_app_password, {
						success: function(xmlDoc) {
							showOPInfo("登录成功...");
						},
						error: function() {
							showOPInfo("登录失败...");
						}
					});
					if (-1 == iRet) {
						showOPInfo("已登录过...");
					}
				}, 1);
			}
		}
	}
	//
}

function closeCgq() {
	$(".maptck").hide();
}

function closeQxz() {
	$(".qixz").hide();
}

function closeVideo() {
	try {
		StopPlay();
	} catch (e) {

	}
	$(".mengb").hide();
	$("#video_iframe").hide();
}

function closeVideo2() {
	try {
		StopPlayView();
	} catch (e) {

	}
	$(".mengb").hide();
	$("#video_iframe2").hide();
}

function closeVideo3() {
	document.getElementById("hlsdiv").innerHTML = "";
	$(".mengb").hide();
	$("#video_iframe3").hide();
}

function closeVideo4() {
	try {
		clickStopRealPlay();
		clickLogout();
	} catch (e) {

	}
	$(".mengb").hide();
	$("#video_iframe4").hide();
}
///////////视频
var g_iWndIndex = 0;

function PTZZoomStop() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(11, true, {
			iWndIndex: g_iWndIndex,
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
			}
		});
	}
}

function PTZZoomout() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(11, false, {
			iWndIndex: g_iWndIndex,
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 调焦-成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + "  调焦-失败！");
			}
		});
	}
}

function PTZZoomIn() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(10, false, {
			iWndIndex: g_iWndIndex,
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 调焦+成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + "  调焦+失败！");
			}
		});
	}
}
//方向PTZ停止
function mouseUpPTZControl() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(1, true, {
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 停止云台成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + " 停止云台失败！");
			}
		});
	}
}
//PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
var g_bPTZAuto = false;

function mouseDownPTZControl(iPTZIndex) {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		bZeroChannel = false,
		iPTZSpeed = 2,
		bStop = false;

	if (bZeroChannel) { // 零通道不支持云台
		return;
	}

	if (oWndInfo != null) {
		if (9 == iPTZIndex && g_bPTZAuto) {
			iPTZSpeed = 0; // 自动开启后，速度置为0可以关闭自动
			bStop = true;
		} else {
			g_bPTZAuto = false; // 点击其他方向，自动肯定会被关闭
			bStop = false;
		}

		WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
			iPTZSpeed: iPTZSpeed,
			success: function(xmlDoc) {
				if (9 == iPTZIndex) {
					g_bPTZAuto = !g_bPTZAuto;
				}
				showOPInfo(oWndInfo.szIP + " 开启云台成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + " 开启云台失败！");
			}
		});
	}
}

function PTZFoucusStop() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(12, true, {
			iWndIndex: g_iWndIndex,
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + "  聚焦停止失败！");
			}
		});
	}
}

function PTZFoucusOut() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(13, false, {
			iWndIndex: g_iWndIndex,
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + "  聚焦-失败！");
			}
		});
	}
}

function PTZFocusIn() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(12, false, {
			iWndIndex: g_iWndIndex,
			success: function(xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 聚焦+成功！");
			},
			error: function() {
				showOPInfo(oWndInfo.szIP + "  聚焦+失败！");
			}
		});
	}
}

function showOPInfo(str) {
	try {
		console.log(str);
	} catch (e) {

	}
}
//新硬盘录像机开始预览方法
function newVideoPreview(szIP, iStreamType, iChannelID, bZeroChannel) {
	// 开始预览 
	var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
		iStreamType: iStreamType,
		iChannelID: iChannelID,
		bZeroChannel: bZeroChannel
	});
	if (iRet == 0) {
		showOPInfo("开启阅览成功...");
		$("#video_iframe4 .fdimg1").show();
		$("#video_iframe4 .fdimg2").hide();
	} else {
		showOPInfo("开启阅览失败...");
		$("#video_iframe4 .fdimg1").hide();
		$("#video_iframe4 .fdimg2").hide();
	}
	$("#switch3").unbind("click");
	$("#switch3").bind("click", function() {
		$(this).closest(".vb").attr("class", "videobut_ vb");
		clickStopRealPlay();
	});
}
//停止预览
function clickStopRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "停止预览成功！";
		} else {
			szInfo = "停止预览失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
	$("#switch3").unbind("click");
	$("#switch3").bind("click", function() {
		$(this).closest(".vb").attr("class", "videobut vb");
		newVideoPreview(strIP, 1, ChanNum1, bzChannel);
	});
}

function clickLogout() {
	if (strIP == "") {
		return;
	}
	var iRet = WebVideoCtrl.I_Logout(strIP);
	if (0 == iRet) {
		szInfo = "退出成功！";
	} else {
		szInfo = "退出失败！";
	}
	showOPInfo(strIP + " " + szInfo);
}
var strIP = "61.51.81.46";
var strPort = "8003";
var strName1 = "admin";
var strPwd1 = "12345";
var ChanNum1 = "2";
var cameraID1 = "";
var webAppPort, bzChannel;

function StartPlayView() {
	$("#switch2").unbind("click");
	$("#switch2").bind("click", function() {
		StopPlayView();
		$(this).closest(".vb").attr("class", "videobut_ vb");
	});
	try {
		OCXobj = document.getElementById("PlayViewOCX");
		OCXobj.SetOcxMode(0);
		OCXobj.SetWndNum(1);
		$("#video_iframe2 .fdimg1").show();
		$("#video_iframe2 .fdimg2").hide();
		strXML = "<?xml version='1.0'?><Parament><CameraID>" + cameraID1 + "</CameraID><DeviceIP>" + strIP + "</DeviceIP><DevicePort>" + strPort + "</DevicePort><User>" + strName1 + "</User><Password>" + strPwd1 + "</Password><ChannelNum>" + ChanNum1 + "</ChannelNum><ProtocolType>0</ProtocolType><StreamType>0</StreamType><Transmits></Transmits></Parament>";
		OCXobj.StartTask_Preview_InWnd(strXML, 0);
	} catch (e) {
		$("#video_iframe2 .fdimg1").hide();
		$("#video_iframe2 .fdimg2").hide();
	}
}

function StopPlayView() {
	$("#switch2").unbind("click");
	$("#switch2").bind("click", function() {
		StartPlayView();
		$(this).closest(".vb").attr("class", "videobut vb");
	});

	OCXobj = document.getElementById("PlayViewOCX");
	try {
		OCXobj.StopAllPreview();
	} catch (e) {

	}
}
/*****设置抓图格式为JPG******/
function CatchPicJPG() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.SetCapturParam("C:\\pic", 0);
}
/*****设置抓图格式为BMP******/
function CatchPicBMP() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.SetCapturParam("C:\\pic", 1);
}
/*****云台：左上******/
function PTZLeftUp() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(25, 3);
}
/*****云台：上******/
function PTZUp() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(21, 3);
}
/*****云台：右上******/
function PTZRightUp() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(26, 3);
}
/*****云台：左******/
function PTZLeft() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(23, 3);
}
/*****云台：自转******/
function PTZAuto() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(29, 3);
}
/*****云台：右******/
function PTZRight() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(24, 3);
}
/*****云台：左下******/
function PTZLeftDown() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(27, 3);
}
/*****云台：下******/
function PTZDown() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(22, 3);
}
/*****云台：右下******/
function PTZRightDown() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(28, 3);
}
/*****云台：停止******/
function PTZStop() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(-21, 3);
}
/*****云台：焦距+******/
function PTZAddTimes() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(11, 3);
}
/*****云台：焦距-******/
function PTZMinusTimes() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(12, 3);
}
/*****云台：焦点+******/
function PTZFarFocus() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(13, 3);
}
/*****云台：焦点-******/
function PTZNearFocus() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(14, 3);
}
/*****云台：光圈+******/
function PTZLargeAperture() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(15, 3);
}
/*****云台：光圈-******/
function PTZSmallAperture() {
	OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.StartTask_PTZ(16, 3);
}
/*****云台：调用预置点******/
function GetPt() {
	OCXobj = document.getElementById("PlayViewOCX");
	ptNum = document.getElementById("SelectGetpt").value;
	var ret = OCXobj.PTZCtrlGotoPreset(ptNum);

}
/*****云台：设置预置点******/
function SetPt() {
	OCXobj = document.getElementById("PlayViewOCX");
	ptNum = document.getElementById("SelectSetpt").value;
	var ret = OCXobj.PTZCtrlSetPreset(parseInt(ptNum));
}
//连接设备
//alert(noTemp);alert(passWord);alert(userName);alert(ip);
var iConnHandle = -1; //连接设备返回句柄
var iPlayHandle = -1; //播放视频返回句柄
//var iChannel = 1;			//设备视频通道
var iStreamType = 1; //取设备流类型	0：主码流	1：子码流
var szAccount = "";
var szRegIP = "";
var iRegPort = 7660;
var password = "";
var username = "";
var channelNo = "";
//7660
//流媒体服务IP、端口
var iStreamServerPort = 7554; //7554
var iPlayConnMode = 0; //取流方式	0：与设备直连取流	1：通过流媒体转发取流

function openVideo() {
	try {
		$("#switch1").unbind("click");
		$("#switch1").bind("click", function() {
			$(this).closest(".vb").attr("class", "videobut_ vb");
			StopPlay();
		});

		var PlayOCX = document.getElementById("ppvs");
		iConnHandle = PlayOCX.ConnectDeviceByACS(szAccount, szRegIP, iRegPort, username, password);
		if (0 > iConnHandle) {
			alert("连接设备失败！");
		} else {
			if (0 > iConnHandle) {
				alert("请先连接设备，并确保连接成功！");
				return;
			}
			var PlayOCX = document.getElementById("ppvs");
			setTimeout(function() {
				iPlayHandle = PlayOCX.StreamPlayStartByTCP(szRegIP, iStreamServerPort, szAccount, "1", iStreamType, 1);
			}, 500);

		}
		$("#video_iframe .fdimg1").show();
		$("#video_iframe .fdimg2").hide();
	} catch (e) {
		$("#video_iframe .fdimg1").hide();
		$("#video_iframe .fdimg2").hide();
	}
}

function videoReady() {
	try {
		var PlayOCX = document.getElementById("ppvs");
		iConnHandle = PlayOCX.ConnectDeviceByACS(szAccount, szRegIP, iRegPort, username, password);
		PlayOCX.StreamPlayStop();
		PlayOCX.RealPlayStop();
	} catch (e) {

	}

}

function StopPlay() {
	var PlayOCX = document.getElementById("ppvs");
	try {
		$("#switch1").unbind("click");
		$("#switch1").bind("click", function() {
			$(this).closest(".vb").attr("class", "videobut vb");
			openVideo();
		});

		PlayOCX.StreamPlayStop();
		PlayOCX.RealPlayStop();
		iPlayHandle = -1;
	} catch (e) {}
	if (iPlayHandle >= 0) {
		if (parseInt(iPlayConnMode) == 0) {
			if (PlayOCX.RealPlayStop()) {
				iPlayHandle = -1;
			}
		} else {
			if (PlayOCX.StreamPlayStop()) {
				iPlayHandle = -1;
			}
		}
	}
}

function PTZControlOn(temp) {
	if (temp == 12) {
		$("#v1").attr("src", assetRoot + "/asset/images/growth/onbut_jian.png");
	}
	if (temp == 11) {
		$("#v2").attr("src", assetRoot + "/asset/images/growth/onbut_jia.png");
	}
	if (temp == 21) {
		$("#v3").attr("src", assetRoot + "/asset/images/growth/onbut_up.png");
	}
	if (temp == 23) {
		$("#v4").attr("src", assetRoot + "/asset/images/growth/onbut_left.png");
	}
	if (temp == 24) {
		$("#v5").attr("src", assetRoot + "/asset/images/growth/onbut_right.png");
	}
	if (temp == 22) {
		$("#v6").attr("src", assetRoot + "/asset/images/growth/onbut_down.png");
	}
	if (temp == 14) {
		$("#v7").attr("src", assetRoot + "/asset/images/growth/onbut_jian.png");
	}
	if (temp == 13) {
		$("#v8").attr("src", assetRoot + "/asset/images/growth/onbut_jia.png");
	}
	//channelNo:函数设备通道号
	//temp：命令控制号（11 - 焦距变大，12 - 焦距变小 ，13 - 焦点变大  ，14 - 焦点变小 ， 15 - 光圈变大，16 - 光圈变小 ，21 - 云台向上， 22 - 云台向下， 23 - 云台左转， 24 - 云台右转）
	//alert(channelNo+'  '+temp);	
	var PlayOCX = document.getElementById("ppvs");
	PlayOCX.PTZControl(channelNo, temp, 0, 1);
}

function PTZControlOff(temp) {
	if (temp == 12) {
		$("#v1").attr("src", assetRoot + "/asset/images/growth/but_jian.png");
	}
	if (temp == 11) {
		$("#v2").attr("src", assetRoot + "/asset/images/growth/but_jia.png");
	}
	if (temp == 21) {
		$("#v3").attr("src", assetRoot + "/asset/images/growth/but_up.png");
	}
	if (temp == 23) {
		$("#v4").attr("src", assetRoot + "/asset/images/growth/but_left.png");
	}
	if (temp == 24) {
		$("#v5").attr("src", assetRoot + "/asset/images/growth/but_right.png");
	}
	if (temp == 22) {
		$("#v6").attr("src", assetRoot + "/asset/images/growth/but_down.png");
	}
	if (temp == 14) {
		$("#v7").attr("src", assetRoot + "/asset/images/growth/but_jian.png");
	}
	if (temp == 13) {
		$("#v8").attr("src", assetRoot + "/asset/images/growth/but_jia.png");
	}

	//channelNo:函数设备通道号
	//temp：命令控制号（11 - 焦距变大，12 - 焦距变小 ，13 - 焦点变大  ，14 - 焦点变小 ， 15 - 光圈变大，16 - 光圈变小 ，21 - 云台向上， 22 - 云台向下， 23 - 云台左转， 24 - 云台右转）
	//alert('    ');
	var PlayOCX = document.getElementById("ppvs");
	PlayOCX.PTZControl(channelNo, temp, 1, 1);
}