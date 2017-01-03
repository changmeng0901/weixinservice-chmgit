
//选项卡切换事件
$('.tab_head .t_item').click(function(){
	$(this).addClass('tCur').siblings().removeClass('tCur');
	$('.tab_content').eq($(this).index()).show().siblings('.tab_content').hide();
});



//价格趋势折线图
var jgqsCharts = function(){
		$('#jgqs_charts').highcharts({
			credits : {
				enabled : false  //去掉版全信息	
			},
			//chart: {
	            //type: 'spline'
	        //},
	        title: {
	            text: '',
	            x: -20 //center
	        },
	        subtitle: {
	            text: '',
	            x: -20
	        },
	        xAxis: {
	        	type: 'datetime',
	        	lineColor : '#bfbfbf',//轴线的颜色
	        	tickColor:  '#bfbfbf',//刻度线的颜色
	        	tickLength : 8, //刻度线的长度
	        	tickmarkPlacement: 'on',  //on刻度线位于在类别名称的中心
	        	labels    :{
					style : {
						fontSize : '12px'
					}	
				},
	            categories: ['10-5', '10-6', '10-8','10-9', '10-10']
	        },
	        yAxis: {
	            title: {
	                text: ''
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        colors: ['#46afeb', '#90b901'],
	        tooltip: {
	            valueSuffix: '单位'
	        },
	        plotOptions: {//去掉圆点或小方块
	        	//lineWidth : 2,
	            spline: {
	                marker: {
	                    enabled: true,
	                   // radius: 3,
                    	//lineWidth: 3
	                }
	            }
	        },
	        legend: {
	            layout: 'horizontal',
	            align: 'center',
	            verticalAlign: 'bottom',
	            borderWidth: 0
	        },
	        series: [{
	            name: '八里桥市场',
	            type: 'spline',
	            marker: {
	                symbol: 'circle', //圆形图标  symbols:["circle","diamond","square","triangle","triangle-down"
					lineColor: 'rgba(255,255,255,0.2)',  
					lineWidth: 3
	            },
	            data: [7.0, 6.9, 9.5, 14.5]
	        }, {
	            name: '日上市场',
	            type: 'spline',
	            marker: {
	                symbol: 'circle',
					lineColor: 'rgba(255,255,255,0.2)',  
					lineWidth: 3
	            },
	            data: [-0.2, 20.1, 14.1,2.5]
	        }]
	    });
	};
	jgqsCharts();

