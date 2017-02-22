
// (1)查看更多功能
function ViewMoreFn(obj,oDownName,oMoreCon){
	//默认是关闭的
	if($(obj).hasClass(oDownName)){
		//如果点击时，是展开的图标，则收起更多内容及图标变为收起图标
		$(obj).removeClass(oDownName);
		$(oMoreCon).hide();
	}else{
		$(obj).addClass(oDownName);
		$(oMoreCon).show();
	}
}

//(6)地图的放大和缩小
$('.btn_screen').click(function(){
	//默认onoff='false',即不是全屏的地图状态
	if($(this).attr('onoff') == 'false'){
		$(this).attr('onoff','true');
		$(this).find('img').attr('src','../images/marketing/btn_smallscreen.png');
		$('#big_map').addClass('bigmap');
		$('.card_main').css('overflow-y','hidden');
	}else{
		$(this).attr('onoff','false');
		$(this).find('img').attr('src','../images/marketing/btn_fullscreen.png');
		$('#big_map').removeClass('bigmap');
		$('.card_main').css('overflow-y','auto');
	}
});

// (2)农场风光轮播图
var sceneryCarousel = $('#scenery-slider').carousel({
		itemWidth: 200,
		itemHeight: 134,
		distance: 10,
		selectedItemDistance: 70,//当前选中的项之间的距离和其他物品。
		selectByClick: false,  //表明旋转木马项是否可以选择单击。
		selectedItemZoomFactor: 1,//当前选项的比例
		unselectedItemZoomFactor: 0.5,//没有被选中的比例
		unselectedItemAlpha: 0.9,
		motionStartDistance: 200,
		topMargin: 10,
		gradientStartPoint: 0.35,
		gradientOverlayColor: "#ebebeb",
		gradientOverlaySize: 190,
		autoSlideshow: true, //指示是否显示物品在自动幻灯片模式
		navigationButtonsVisible : false,//表示导航按钮是否可见。
		preload : true //指示是否要预加载的所有项目在开始,然后启动插件。
		
	})
	//默认第几个点是选中的
	$('.scenery_dot span').eq( $('#scenery-slider li.sc-selected').index()).addClass('dq_dot');
	//当滑屏时，点和图片都变化
	sceneryCarousel.on('closestItemChanged.sc', function(evt) {
		//console.log(evt.item.index());
		$('.scenery_signtxt').html( $('#scenery-slider li').eq(evt.item.index()).find('.sc-content h2').html() );
		$('.scenery_dot span').eq( evt.item.index()).addClass('dq_dot').siblings().removeClass('dq_dot');
	});
	
// (2-1)农场风光图片点击时，放大图片功能
$('#scenery-slider .sky-carousel-container li').click(function(){
	$('#swiper_scenery').show();
	var _index = $(this).index();
	var mySwiper;
	mySwiper = new Swiper('#swiper_scenery',{
		initialSlide : _index,
		loop: false,
		lazyLoading : true,
		lazyLoadingInPrevNext : true,
	});
	if(_index == 0){
		//如果是第一个会有问题，所以在这里把translate3d设置成0
		//mySwiper.translate = '0';
		$('#swiper_scenery .swiper-wrapper').attr('style','transform: translate3d(0px, 0px, 0px); transition-duration: 0ms;')
	}
});
$('#swiper_scenery').click(function(){
	$(this).hide();
});


// (3)生产追溯轮播图
for(var i=0;i<2;i++){
	TraceCarousel(i);
}
function TraceCarousel (item){
	var traceCarousel = traceCarousel+item
	traceCarousel = $('#trace-slider'+item).carousel({
		itemWidth: 166, //The width of the carousel item images.
		itemHeight: 110,
		distance: 10,
		selectedItemDistance: 70,
		selectedItemZoomFactor: 1,
		unselectedItemZoomFactor: 0.2,
		unselectedItemAlpha: 0.9,
		motionStartDistance: 200,
		topMargin: 10,
		gradientStartPoint: 0.35,
		gradientOverlayColor: "#ebebeb",
		gradientOverlaySize: 190,
		selectByClick: false,
		topMargin : 5,
		navigationButtonsVisible : true,
		autoSlideshow: false
		
	})
	var trace_li_width = $('.trace_datelist'+item).width()/3;
	var trace_li_len =  $('.trace_datelist'+item+' li').length;
	$('.trace_datelist'+item+' li').width( trace_li_width );
	$('.trace_datelist'+item+' ol').css({
		'width' : trace_li_width*trace_li_len,
		'left' : -($('#trace-slider'+item+' li.sc-selected').index()-1)*trace_li_width
	});
	//生产追溯下的内容是当前LI里的H2里的内容
	$('.trace_signtxt'+item).html( $('#trace-slider'+item+' li.sc-selected').find('.sc-content h2').html() );
	$('.trace_txtdetail'+item).html( $('#trace-slider'+item+' li.sc-selected').find('.sc-content p').html() );
	//默认第几个点是选中的
	$('.trace_datelist'+item+' li').eq( $('#trace-slider'+item+' li.sc-selected').index()).addClass('dq_dot');
	//当滑屏时，点和图片都变化
	traceCarousel.on('closestItemChanged.sc', function(evt) {
		$('.trace_signtxt'+item).html( $('#trace-slider'+item+' li').eq(evt.item.index()).find('.sc-content h2').html() );
		$('.trace_txtdetail'+item).html( $('#trace-slider'+item+' li').eq(evt.item.index()).find('.sc-content p').html() );
		$('.trace_datelist'+item+' li').eq( evt.item.index()).addClass('dq_dot').siblings().removeClass('dq_dot');
		$('.trace_datelist'+item+' ol').css({
			'left' : -(evt.item.index()-1)*trace_li_width
		});
	});
	
	// (3-1)生产追溯图片点击时，放大图片功能
	$('#trace-slider'+item+' .sky-carousel-container li').click(function(){
		$('#swiper_trace'+item).show();
		var _index2 = $(this).index();
		var mySwiper2;
		mySwiper2 = new Swiper('#swiper_trace'+item,{
			initialSlide : _index2,
			loop: false,
			lazyLoading : true,
			lazyLoadingInPrevNext : true,
		});
		if(_index2 == 0){
			//如果是第一个会有问题，所以在这里把translate3d设置成0
			//mySwiper.translate = '0';
			$('#swiper_trace'+item+' .swiper-wrapper').attr('style','transform: translate3d(0px, 0px, 0px); transition-duration: 0ms;')
		}
	});
	$('#swiper_trace'+item).click(function(){
		$(this).hide();
	});
}

// (4)荣誉轮播图
var honorCarousel = $('#honor-slider').carousel({
		itemWidth: 116, //The width of the carousel item images.
		itemHeight: 160,
		enableMouseWheel: false,
		gradientOverlayVisible: false,
		gradientOverlayColor: '#F0F3EE',
		gradientOverlaySize: 300,
		distance: 10,
		selectedItemDistance: 0,
		selectByClick: false,  
		selectedItemZoomFactor: 1.0,
		unselectedItemZoomFactor: 0.8,
		showPreloader: false,
		topMargin : 5,
		navigationButtonsVisible : false,
		motionStartDistance : 200,
		autoSlideshow: true
		
	})
	//荣誉下的内容是当前LI里的H2里的内容
	$('.honor_signtxt').html( $('#honor-slider li.sc-selected').find('.sc-content h2').html() );
	//当滑屏时，荣誉下的内容和图片都变化
	honorCarousel.on('closestItemChanged.sc', function(evt) {
		//console.log(evt.item.index());
		$('.honor_signtxt').html( $('#honor-slider li').eq(evt.item.index()).find('.sc-content h2').html() );
	});
// (4-1)荣誉图片点击时，放大图片功能
$('#honor-slider .sky-carousel-container li').click(function(){
	$('#swiper_honor').show();
	var _index3 = $(this).index();
	var mySwiper3;
	mySwiper3 = new Swiper('#swiper_honor',{
		initialSlide : _index3,
		loop: false,
		lazyLoading : true,
		lazyLoadingInPrevNext : true,
	});
	if(_index3 == 0){
		//如果是第一个会有问题，所以在这里把translate3d设置成0
		//mySwiper.translate = '0';
		$('#swiper_honor .swiper-wrapper').attr('style','transform: translate3d(0px, 0px, 0px); transition-duration: 0ms;')
	}
});
$('#swiper_honor').click(function(){
	$(this).hide();
});
	
	
	//()窗口变化时，显示状态
	$(window).resize(function(){
		for(var i=0;i<2;i++){
			TraceCarousel(i);
		}
	});



