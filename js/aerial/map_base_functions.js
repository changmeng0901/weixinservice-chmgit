//加载地图
/*(1)function gMapInit(domObj, laglntArr) {
	var point = makeLatLng(laglntArr);
	var mapOptions = {
		center: point,
		zoom: 17, //15
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		streetViewControl: false, // 取消街景
		// disableDoubleClickZoom:true,
		mapTypeControl: false,
		panControl: true,
		zoomControl: xc_zoomSet,
		panControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		}
	};
	map = new google.maps.Map(domObj, mapOptions);
}*/
//传入一个数组转换为地图坐标对象
function makeLatLng(arr) {
	return new google.maps.LatLng(arr[0], arr[1]);
}
/*根据坐标点数组 在地图上画层*pointArr：是个二维数组 polygonColor：层颜色，theme：涂层透明度1，2，3同时也是ZINDEX层级
isEditable：层是否可再编辑，不填默认是false*/
function drawingPolygon(pointArr, polygonColor, theme, isEditable) {
	var triangleCoords = [];
	for (var i = 0; i < pointArr.length; i++) {
		triangleCoords.push(makeLatLng(pointArr[i]));
	}
	var polygonTheme = theme - 1;
	var themeArr = [
		[0.8, 0.1, 4],
		[0.45, 0.45, 3],
		[0.8, 0.5, 2]
	];
	var bermudaTriangle = new google.maps.Polygon({
		paths: triangleCoords,
		strokeColor: polygonColor,
		strokeOpacity: themeArr[polygonTheme][0],
		fillOpacity: themeArr[polygonTheme][1],
		strokeWeight: themeArr[polygonTheme][2],
		fillColor: polygonColor,
		editable: isEditable || false,
		zIndex: theme
	});
	//bermudaTriangle.fillColor='#000000'
	bermudaTriangle.setMap(map);
	//	google.maps.event.addDomListener(bermudaTriangle, 'click', function(event) { // alert(1)
	//		alert(bermudaTriangle.Contains(event.latLng));
	//	});
}

function getBoundsZoomLevel(bounds) {
	var mapDim = {
		    height: $("#map-canvas").height(),
		    width: $("#map-canvas").width()
		};
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 19;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

//添加一级域的MARKER
function setMarker(latLngArr, name) {
	var point = makeLatLng(latLngArr);
	return new google.maps.Marker({
		position: point,
		map: map,
		title: name
			//icon: '../asset/images/zb.png',
			//_name: array.name,
			//_id: array.id,
			//_index: i,
			//_coordinate_X: array.coordinateX,
			//_coordinate_Y: array.coordinateY,
			//_imgUrl: array.baseImageUrl
	});
}
//浮动文字
function Wenzi(bounds, wenzi, map, type) {
	this.bounds_ = bounds;
	this.wenzi_ = wenzi;
	this.map_ = map;
	this.div_ = null;
	this.setMap(map);
	this.type_ = type;
}
Wenzi.prototype = new google.maps.OverlayView();
Wenzi.prototype.onAdd = function() {
	var div = document.createElement('div');
	div.style.border = 'none';
	div.style.index = "777";
	div.style.color = "#FFFFFF";
	div.style.borderWidth = '0px';
	div.style.position = 'absolute';
	div.innerHTML = this.wenzi_;
	this.div_ = div;
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.div_);
	var _self = this;
};
Wenzi.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var lat = this.bounds_.lat();
	var lng = this.bounds_.lng();
	var newpoint = new google.maps.LatLng(lat, lng);
	var div = this.div_;
	var zoom = map.getZoom();
	var yu = parseInt(this.wenzi_.length / 2);
	if (this.type_ == 1) {
		if (zoom < 15) {
			this.show();
			var aPoint = overlayProjection.fromLatLngToContainerPixel(newpoint);
			aPoint.x = aPoint.x - (11 * this.wenzi_.length);
			newpoint = overlayProjection.fromContainerPixelToLatLng(aPoint);
			div.style.width = 11 * this.wenzi_.length + "px";
			div.style.fontSize = "20px";
			div.style.width = 20 * this.wenzi_.length + "px";
		} else if (zoom == 15) {
			this.show();
			newpoint = new google.maps.LatLng(lat, lng - (0.001 * yu));
			div.style.fontSize = "20px";
			div.style.width = 20 * this.wenzi_.length + "px";
		} else {
			this.hide();
		}
	} else if (this.type_ == 2) {
		if (zoom <= 15) {
			this.hide();
		} else if (zoom == 16) {
			this.show();
			newpoint = new google.maps.LatLng(lat + 0.0002, lng - (0.000242 * yu));
			div.style.width = 11 * this.wenzi_.length + "px";
			div.style.fontSize = "11px";
		} else if (zoom == 17) {
			this.show();
			newpoint = new google.maps.LatLng(lat + 0.0001, lng - (0.000185 * yu));
			div.style.width = 16 * this.wenzi_.length + "px";
			div.style.fontSize = "16px";
		} else if (zoom == 18) {
			this.show();
			newpoint = new google.maps.LatLng(lat + 0.00006, lng - (0.000139 * yu));
			div.style.width = 23 * this.wenzi_.length + "px";
			div.style.fontSize = "23px";
		} else if (zoom == 19) {
			this.show();
			newpoint = new google.maps.LatLng(lat + 0.00004, lng - (0.000119 * yu));
			div.style.width = 45 * this.wenzi_.length + "px";
			div.style.fontSize = "45px";
		} else if (zoom > 19) {
			this.show();
			newpoint = new google.maps.LatLng(lat + 0.00003, lng - (0.000119 * yu));
			div.style.width = 45 * this.wenzi_.length + "px";
			div.style.fontSize = "50px";
		}
	} else if (this.type_ == 3) {
		if (zoom < 18) {
			this.hide();
		} else if (zoom == 18) {
			this.show();
			newpoint = new google.maps.LatLng(lat - 0.00004, lng - (0.000064 * yu));
			div.style.width = 11 * this.wenzi_.length + "px";
			div.style.fontSize = "10px";
		} else if (zoom == 19) {
			this.show();
			newpoint = new google.maps.LatLng(lat - 0.00004, lng - (0.000029 * yu));
			div.style.width = 13 * this.wenzi_.length + "px";
			div.style.fontSize = "12px";
		} else if (zoom > 19) {
			this.show();
			newpoint = new google.maps.LatLng(lat - 0.00004, lng - (0.000049 * yu));
			div.style.width = 18 * this.wenzi_.length + "px";
			div.style.fontSize = "18px";
		}
	}
	var latLng = overlayProjection.fromLatLngToDivPixel(newpoint);
	div.style.left = latLng.x + 'px';
	div.style.top = latLng.y + 'px';
};
Wenzi.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
};
Wenzi.prototype.hide = function() {
	if (this.div_) {
		this.div_.style.visibility = 'hidden';
	}
};
Wenzi.prototype.show = function() {
	if (this.div_) {
		this.div_.style.visibility = 'visible';
	}
};
Wenzi.prototype.toggle = function() {
	if (this.div_) {
		if (this.div_.style.visibility == 'hidden') {
			this.show();
		} else {
			this.hide();
		}
	}
};
Wenzi.prototype.toggleDOM = function() {
	if (this.getMap()) {
		this.setMap(null);
	} else {
		this.setMap(this.map_);
	}
};
//
function USGSOverlay(bounds, image, map, obj, tempb) {
	this.parents = obj;
	this.bounds_ = bounds;
	this.image_ = image;
	this.map_ = map;
	this.div_ = null;
	this.tempb_ = tempb;
	this.setMap(map);
}
USGSOverlay.prototype = new google.maps.OverlayView();
USGSOverlay.prototype.onAdd = function() {
	var div = document.createElement('div');
	div.style.border = 'none';
	div.style.index = "777";
	div.style.borderWidth = '0px';
	div.style.position = 'absolute';
	var img = document.createElement('img');
	img.src = this.image_;
	img.style.width = '100%';
	img.style.height = '100%';
	img.style.position = "absolute";
	var img2 = document.createElement('img');
	img2.src = assetRoot + '/asset/images/touming.png';
	img2.style.position = "absolute";
	img2.style.width = '100%';
	img2.style.height = '100%';
	div.appendChild(img);
	if (this.tempb_)
		div.appendChild(img2);
	this.div_ = div;
	var panes = this.getPanes();
	panes.overlayImage.appendChild(this.div_);
	var _self = this;
	google.maps.event.addDomListener(this.div_, 'click', function(event) { //图片点击事件
		map.setZoom(19);
		map.setCenter(_self.bounds_.getCenter());
		setTimeout(function() {
			showInfoWindow(_self.parents)
		}, 100)
	});
};
USGSOverlay.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
	var div = this.div_;
	var zoom = map.getZoom();
	if (zoom < 16) {
		this.hide();
	} else {
		this.show();
		div.style.left = sw.x + 'px';
		div.style.top = ne.y + 'px';
		div.style.width = (ne.x - sw.x) + 'px';
		div.style.height = (sw.y - ne.y) + 'px';
	}

};
USGSOverlay.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
};
USGSOverlay.prototype.hide = function() {
	if (this.div_) {
		this.div_.style.visibility = 'hidden';
	}
};
USGSOverlay.prototype.show = function() {
	if (this.div_) {
		this.div_.style.visibility = 'visible';
	}
};
USGSOverlay.prototype.toggle = function() {
	if (this.div_) {
		if (this.div_.style.visibility == 'hidden') {
			this.show();
		} else {
			this.hide();
		}
	}
};
USGSOverlay.prototype.toggleDOM = function() {
	if (this.getMap()) {
		this.setMap(null);
	} else {
		this.setMap(this.map_);
	}
};
//
//地图上设备层
function CustomOverlay(map, imgsrc, latlng, arr) {
	this.polygons = [];
	this.map = map;
	this.div = null;
	this.setMap(map);
	this.imgsrc_ = imgsrc;
	this.latlng_ = latlng;
	this.arr = arr;
	//	if (arr.device_ == 3) {
	//		console.log(arr)
	//	}
};
CustomOverlay.prototype = new google.maps.OverlayView();
CustomOverlay.prototype.onAdd = function() {
	var div = document.createElement("DIV");
	div.id = "div_id";
	div.style.border = "none";
	div.style.borderWidth = "0px";
	div.style.position = "absolute";
	// div.style.height="0px";
	div.style.visibility = "visible";
	div.draggable = true;
	this.div = div;
	var tempThis = this;
	this.addPolygon(this.latlng_);
	this.getPanes().floatShadow.appendChild(div);
	//
	var _self = this;
	google.maps.event.addDomListener(this.div, 'click', function(event) { //图片点击事件
		map.setZoom(19);
		map.setCenter(_self.latlng_);
		showDeviceInfoWindow(_self.arr)
	});
	//
};
CustomOverlay.prototype.draw = function() {
	var divPixel = this.getProjection().fromLatLngToDivPixel(
		this.quadrilateral.latLng);
	var latLng = this.quadrilateral.latLng;
	var lat = latLng.lat();
	var lng = latLng.lng();
	var left, right;
	if (this.arr.device_ == 2) {
		left = new google.maps.LatLng(lat + (0.0000424 * 4), lng + (0.000055 * 4));
		right = new google.maps.LatLng(lat - (0.000045 * 4), lng - (0.000060 * 4));
	}if (this.arr.device_ == 4) {
		left = new google.maps.LatLng(lat + (0.0000424 * 4), lng + (0.00012 * 1.5));
		right = new google.maps.LatLng(lat, lng - (0.00012 * 1.5));
	} else {
		left = new google.maps.LatLng(lat + 0.0000424, lng + 0.000055);
		right = new google.maps.LatLng(lat - 0.000045, lng - 0.000060);
	}
	var bounds2 = new google.maps.LatLngBounds(right, left);
	var sw = this.getProjection().fromLatLngToDivPixel(bounds2.getSouthWest());
	var ne = this.getProjection().fromLatLngToDivPixel(bounds2.getNorthEast());
	this.quadrilateral.shape.style.left = sw.x + "px";
	this.quadrilateral.shape.style.top = ne.y + "px";
	this.quadrilateral.shape.style.width = (ne.x - sw.x) + 'px';
	this.quadrilateral.shape.style.height = (sw.y - ne.y) + 'px';
}
CustomOverlay.prototype.onRemove = function() {
	// Not Implemented Here
}

CustomOverlay.prototype.addPolygon = function(latLng) {
	var shape = document.createElement("div");
	shape.className = "customPolygon";
	shape.style.position = "relative";
	var img = document.createElement('img');
	if (this.arr.device_ == 1) {
		img.src = assetRoot + '/asset/images/vidicon2.png' //devicesrc;
	} else if (this.arr.device_ == 2) {
		img.src = assetRoot + '/asset/images/vidicon4.png' //weathersrc;
	} else if (this.arr.device_ == 3) {
		img.src = assetRoot + '/asset/images/vidicon3.png' //videosrc;
	} else if (this.arr.device_ == 4) {
		img.src = assetRoot + '/asset/images/krpanoimg2.png' //krpanosrc;
	}
	img.style.width = '100%';
	img.style.height = '100%';
	shape.appendChild(img);
	var tempThis = this;
	//this.div.setAttribute("aa", this.arr.device_name);
	this.div.appendChild(shape);
	//clic(tempThis, shape);//ajax
	this.quadrilateral = {
		shape: shape,
		latLng: latLng
	};
};
//
// 检测点是否在polygon范围内;
google.maps.Polygon.prototype.Contains = function(point) {
	// ray casting alogrithm http://rosettacode.org/wiki/Ray-casting_algorithm
	var crossings = 0,
		path = this.getPath();

	// for each edge
	for (var i = 0; i < path.getLength(); i++) {
		var a = path.getAt(i),
			j = i + 1;
		if (j >= path.getLength()) {
			j = 0;
		}
		var b = path.getAt(j);
		if (rayCrossesSegment(point, a, b)) {
			crossings++;
		}
	}

	// odd number of crossings?
	return (crossings % 2 == 1);

	function rayCrossesSegment(point, a, b) {
		var px = point.lng(),
			py = point.lat(),
			ax = a.lng(),
			ay = a.lat(),
			bx = b
			.lng(),
			by = b.lat();
		if (ay > by) {
			ax = b.lng();
			ay = b.lat();
			bx = a.lng();
			by = a.lat();
		}
		// alter longitude to cater for 180 degree crossings
		if (px < 0) {
			px += 360;
		};
		if (ax < 0) {
			ax += 360;
		};
		if (bx < 0) {
			bx += 360;
		};

		if (py == ay || py == by)
			py += 0.00000001;
		if ((py > by || py < ay) || (px > Math.max(ax, bx)))
			return false;
		if (px < Math.min(ax, bx))
			return true;

		var red = (ax != bx) ? ((by - ay) / (bx - ax)) : Infinity;
		var blue = (ax != px) ? ((py - ay) / (px - ax)) : Infinity;
		return (blue >= red);
	}
};

function makeParameter_Field(IDtype, ID) { //base_id
	return encodeURI('&field={"data":{"' + IDtype + '":"' + ID + '"}}')
}
//
function makeParameter_Method(string) {
	var Method = '&method=' + string + '.data'
	return Method;
}
//
function ajaxConfig(opt) {
	$.ajax({
		type: "GET",
		timeout: 10000,
		url: opt.url,
		dataType: "jsonp",
		jsonp: 'callback',
		success: function(json) {
			//	var data=$.parseJSON(json)
			opt.backfun(json)
		},
		error: function(e) {
			$("#map_loading").hide();
			try {
				console.log(opt)
			} catch (e) {}
		}
	});
}
//
if (!Date.prototype.format) {
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month
			"d+": this.getDate(), //day
			"h+": this.getHours(), //hour
			"m+": this.getMinutes(), //minute
			"s+": this.getSeconds(), //second
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
			"S": this.getMilliseconds() //millisecond
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
}