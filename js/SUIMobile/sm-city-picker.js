/*!
 * =====================================================
 * SUI Mobile - http://m.sui.taobao.org/
 *
 * =====================================================
 */
// jshint ignore: start
+function($){

$.smConfig.rawCitiesData = [{"name":"北京","sub":[{"name":"北京"},{"name":"海淀"},{"name":"朝阳"},{"name":"顺义"},{"name":"怀柔"},{"name":"通州"},{"name":"昌平"},{"name":"延庆"},{"name":"丰台"},{"name":"石景山"},{"name":"大兴"},{"name":"房山"},{"name":"密云"},{"name":"门头沟"},{"name":"平谷"}]},{"name":"上海","sub":[{"name":"上海"},{"name":"闵行"},{"name":"宝山"},{"name":"嘉定"},{"name":"浦东南汇"},{"name":"金山"},{"name":"青浦"},{"name":"松江"},{"name":"奉贤"},{"name":"崇明"},{"name":"徐家汇"},{"name":"浦东"}]},{"name":"天津","sub":[{"name":"天津"},{"name":"武清"},{"name":"宝坻"},{"name":"东丽"},{"name":"西青"},{"name":"北辰"},{"name":"宁河"},{"name":"汉沽"},{"name":"静海"},{"name":"津南"},{"name":"塘沽"},{"name":"大港"},{"name":"蓟县"}]},{"name":"重庆","sub":[{"name":"重庆"},{"name":"永川"},{"name":"合川"},{"name":"南川"},{"name":"江津"},{"name":"万盛"},{"name":"渝北"},{"name":"北碚"},{"name":"巴南"},{"name":"长寿"},{"name":"黔江"},{"name":"万州"},{"name":"涪陵"},{"name":"开县"},{"name":"城口"},{"name":"云阳"},{"name":"巫溪"},{"name":"奉节"},{"name":"巫山"},{"name":"潼南"},{"name":"垫江"},{"name":"梁平"},{"name":"忠县"},{"name":"石柱"},{"name":"大足"},{"name":"荣昌"},{"name":"铜梁"},{"name":"璧山"},{"name":"丰都"},{"name":"武隆"},{"name":"彭水"},{"name":"綦江"},{"name":"酉阳"},{"name":"秀山"}]},{"name":"黑龙江","sub":[{"name":"哈尔滨"},{"name":"齐齐哈尔"},{"name":"牡丹江"},{"name":"佳木斯"},{"name":"绥化"},{"name":"黑河"},{"name":"大兴安岭"},{"name":"伊春"},{"name":"大庆"},{"name":"七台河"},{"name":"鸡西"},{"name":"鹤岗"},{"name":"双鸭山"}]},{"name":"吉林","sub":[{"name":"长春"},{"name":"吉林"},{"name":"延边"},{"name":"四平"},{"name":"通化"},{"name":"白城"},{"name":"辽源"},{"name":"松原"},{"name":"白山"}]},{"name":"辽宁","sub":[{"name":"沈阳"},{"name":"大连"},{"name":"鞍山"},{"name":"抚顺"},{"name":"本溪"},{"name":"丹东"},{"name":"锦州"},{"name":"营口"},{"name":"阜新"},{"name":"辽阳"},{"name":"铁岭"},{"name":"朝阳"},{"name":"盘锦"},{"name":"葫芦岛"}]},{"name":"内蒙古","sub":[{"name":"呼和浩特"},{"name":"包头"},{"name":"乌海"},{"name":"乌兰察布"},{"name":"通辽"},{"name":"兴安盟"},{"name":"赤峰"},{"name":"鄂尔多斯"},{"name":"巴彦淖尔"},{"name":"锡林郭勒"},{"name":"呼伦贝尔"},{"name":"阿拉善盟"}]},{"name":"河北","sub":[{"name":"石家庄"},{"name":"保定"},{"name":"张家口"},{"name":"承德"},{"name":"唐山"},{"name":"廊坊"},{"name":"沧州"},{"name":"衡水"},{"name":"邢台"},{"name":"邯郸"},{"name":"秦皇岛"}]},{"name":"山西","sub":[{"name":"太原"},{"name":"大同"},{"name":"阳泉"},{"name":"晋中"},{"name":"长治"},{"name":"晋城"},{"name":"临汾"},{"name":"运城"},{"name":"朔州"},{"name":"忻州"},{"name":"吕梁"}]},{"name":"陕西","sub":[{"name":"西安"},{"name":"咸阳"},{"name":"延安"},{"name":"榆林"},{"name":"渭南"},{"name":"商洛"},{"name":"安康"},{"name":"汉中"},{"name":"宝鸡"},{"name":"铜川"},{"name":"杨凌"}]},{"name":"山东","sub":[{"name":"济南"},{"name":"青岛"},{"name":"淄博"},{"name":"德州"},{"name":"烟台"},{"name":"潍坊"},{"name":"济宁"},{"name":"泰安"},{"name":"临沂"},{"name":"菏泽"},{"name":"滨州"},{"name":"东营"},{"name":"威海"},{"name":"枣庄"},{"name":"日照"},{"name":"莱芜"},{"name":"聊城"}]},{"name":"新疆","sub":[{"name":"乌鲁木齐"},{"name":"克拉玛依"},{"name":"石河子"},{"name":"昌吉"},{"name":"吐鲁番"},{"name":"巴音郭楞"},{"name":"阿拉尔"},{"name":"阿克苏"},{"name":"喀什"},{"name":"伊犁"},{"name":"塔城"},{"name":"哈密"},{"name":"和田"},{"name":"阿勒泰"},{"name":"克州"},{"name":"博尔塔拉"}]},{"name":"西藏","sub":[{"name":"拉萨"},{"name":"日喀则"},{"name":"山南"},{"name":"林芝"},{"name":"昌都"},{"name":"那曲"},{"name":"阿里"}]},{"name":"青海","sub":[{"name":"西宁"},{"name":"海东"},{"name":"黄南"},{"name":"海南"},{"name":"果洛"},{"name":"玉树"},{"name":"海西"},{"name":"海北"},{"name":"格尔木"}]},{"name":"甘肃","sub":[{"name":"兰州"},{"name":"定西"},{"name":"平凉"},{"name":"庆阳"},{"name":"武威"},{"name":"金昌"},{"name":"张掖"},{"name":"酒泉"},{"name":"天水"},{"name":"陇南"},{"name":"临夏"},{"name":"甘南"},{"name":"白银"},{"name":"嘉峪关"}]},{"name":"宁夏","sub":[{"name":"银川"},{"name":"石嘴山"},{"name":"吴忠"},{"name":"固原"},{"name":"中卫"}]},{"name":"河南","sub":[{"name":"郑州"},{"name":"安阳"},{"name":"新乡"},{"name":"许昌"},{"name":"平顶山"},{"name":"信阳"},{"name":"南阳"},{"name":"开封"},{"name":"洛阳"},{"name":"商丘"},{"name":"焦作"},{"name":"鹤壁"},{"name":"濮阳"},{"name":"周口"},{"name":"漯河"},{"name":"驻马店"},{"name":"三门峡"},{"name":"济源"}]},{"name":"江苏","sub":[{"name":"南京"},{"name":"无锡"},{"name":"镇江"},{"name":"苏州"},{"name":"南通"},{"name":"扬州"},{"name":"盐城"},{"name":"徐州"},{"name":"淮安"},{"name":"连云港"},{"name":"常州"},{"name":"泰州"},{"name":"宿迁"}]},{"name":"湖北","sub":[{"name":"武汉"},{"name":"襄阳"},{"name":"鄂州"},{"name":"孝感"},{"name":"黄冈"},{"name":"黄石"},{"name":"咸宁"},{"name":"荆州"},{"name":"宜昌"},{"name":"恩施"},{"name":"十堰"},{"name":"神农架"},{"name":"随州"},{"name":"荆门"},{"name":"天门"},{"name":"仙桃"},{"name":"潜江"}]},{"name":"浙江","sub":[{"name":"杭州"},{"name":"湖州"},{"name":"嘉兴"},{"name":"宁波"},{"name":"绍兴"},{"name":"台州"},{"name":"温州"},{"name":"丽水"},{"name":"金华"},{"name":"衢州"},{"name":"舟山"}]},{"name":"安徽","sub":[{"name":"合肥"},{"name":"蚌埠"},{"name":"芜湖"},{"name":"淮南"},{"name":"马鞍山"},{"name":"安庆"},{"name":"宿州"},{"name":"阜阳"},{"name":"亳州"},{"name":"黄山"},{"name":"滁州"},{"name":"淮北"},{"name":"铜陵"},{"name":"宣城"},{"name":"六安"},{"name":"池州"}]},{"name":"福建","sub":[{"name":"福州"},{"name":"厦门"},{"name":"宁德"},{"name":"莆田"},{"name":"泉州"},{"name":"漳州"},{"name":"龙岩"},{"name":"三明"},{"name":"南平"},{"name":"钓鱼岛"}]},{"name":"江西","sub":[{"name":"南昌"},{"name":"九江"},{"name":"上饶"},{"name":"抚州"},{"name":"宜春"},{"name":"吉安"},{"name":"赣州"},{"name":"景德镇"},{"name":"萍乡"},{"name":"新余"},{"name":"鹰潭"}]},{"name":"湖南","sub":[{"name":"长沙"},{"name":"湘潭"},{"name":"株洲"},{"name":"衡阳"},{"name":"郴州"},{"name":"常德"},{"name":"益阳"},{"name":"娄底"},{"name":"邵阳"},{"name":"岳阳"},{"name":"张家界"},{"name":"怀化"},{"name":"永州"},{"name":"湘西"}]},{"name":"贵州","sub":[{"name":"贵阳"},{"name":"遵义"},{"name":"安顺"},{"name":"黔南"},{"name":"黔东南"},{"name":"铜仁"},{"name":"毕节"},{"name":"六盘水"},{"name":"黔西南"}]},{"name":"四川","sub":[{"name":"成都"},{"name":"攀枝花"},{"name":"自贡"},{"name":"绵阳"},{"name":"南充"},{"name":"达州"},{"name":"遂宁"},{"name":"广安"},{"name":"巴中"},{"name":"泸州"},{"name":"宜宾"},{"name":"内江"},{"name":"资阳"},{"name":"乐山"},{"name":"眉山"},{"name":"凉山"},{"name":"雅安"},{"name":"甘孜"},{"name":"阿坝"},{"name":"德阳"},{"name":"广元"}]},{"name":"广东","sub":[{"name":"广州"},{"name":"韶关"},{"name":"惠州"},{"name":"梅州"},{"name":"汕头"},{"name":"深圳"},{"name":"珠海"},{"name":"佛山"},{"name":"肇庆"},{"name":"湛江"},{"name":"江门"},{"name":"河源"},{"name":"清远"},{"name":"云浮"},{"name":"潮州"},{"name":"东莞"},{"name":"中山"},{"name":"阳江"},{"name":"揭阳"},{"name":"茂名"},{"name":"汕尾"}]},{"name":"云南","sub":[{"name":"昆明"},{"name":"大理"},{"name":"红河"},{"name":"曲靖"},{"name":"保山"},{"name":"文山"},{"name":"玉溪"},{"name":"楚雄"},{"name":"普洱"},{"name":"昭通"},{"name":"临沧"},{"name":"怒江"},{"name":"迪庆"},{"name":"丽江"},{"name":"德宏"},{"name":"西双版纳"}]},{"name":"广西","sub":[{"name":"南宁"},{"name":"崇左"},{"name":"柳州"},{"name":"来宾"},{"name":"桂林"},{"name":"梧州"},{"name":"贺州"},{"name":"贵港"},{"name":"玉林"},{"name":"百色"},{"name":"钦州"},{"name":"河池"},{"name":"北海"},{"name":"防城港"}]},{"name":"海南","sub":[{"name":"海口"},{"name":"三亚"},{"name":"东方"},{"name":"临高"},{"name":"澄迈"},{"name":"儋州"},{"name":"昌江"},{"name":"白沙"},{"name":"琼中"},{"name":"定安"},{"name":"屯昌"},{"name":"琼海"},{"name":"文昌"},{"name":"保亭"},{"name":"万宁"},{"name":"陵水"},{"name":"西沙"},{"name":"南沙"},{"name":"乐东"},{"name":"五指山"},{"name":"中沙"}]},{"name":"香港","sub":[{"name":"香港"}]},{"name":"澳门","sub":[{"name":"澳门"}]},{"name":"台湾","sub":[{"name":"台北"},{"name":"高雄"},{"name":"台中"}]}];

}(Zepto);
// jshint ignore: end

/* jshint unused:false*/

+ function($) {
    "use strict";
    var format = function(data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
            var d = data[i];
            if(d.name === "请选择") continue;
            result.push(d.name);
        }
        if(result.length) return result;
        return [""];
    };

    var sub = function(data) {
        if(!data.sub) return [""];
        return format(data.sub);
    };

    var getCities = function(d) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === d) return sub(raw[i]);
        }
        return [""];
    };

    var getDistricts = function(p, c) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === p) {
                for(var j=0;j< raw[i].sub.length;j++) {
                    if(raw[i].sub[j].name === c) {
                        return sub(raw[i].sub[j]);
                    }
                }
            }
        }
        return [""];
    };

    var raw = $.smConfig.rawCitiesData;
    var provinces = raw.map(function(d) {
        return d.name;
    });
    var initCities = sub(raw[0]);
    var initDistricts = [""];

    var currentProvince = provinces[0];
    var currentCity = initCities[0];
    var currentDistrict = initDistricts[0];

    var t;
    var defaults = {

        cssClass: "city-picker",
        rotateEffect: false,  //为了性能

        onChange: function (picker, values, displayValues) {
            var newProvince = picker.cols[0].value;
            var newCity;
            if(newProvince !== currentProvince) {
                // 如果Province变化，节流以提高reRender性能
                clearTimeout(t);

                t = setTimeout(function(){
                    var newCities = getCities(newProvince);
                    newCity = newCities[0];
                    var newDistricts = getDistricts(newProvince, newCity);
                    picker.cols[1].replaceValues(newCities);
                    picker.cols[2].replaceValues(newDistricts);
                    currentProvince = newProvince;
                    currentCity = newCity;
                    picker.updateValue();
                }, 200);
                return;
            }
            newCity = picker.cols[1].value;
            if(newCity !== currentCity) {
                picker.cols[2].replaceValues(getDistricts(newProvince, newCity));
                currentCity = newCity;
                picker.updateValue();
            }
        },

        cols: [
        {
            textAlign: 'center',
            values: provinces,
            cssClass: "col-province"
        },
        {
            textAlign: 'center',
            values: initCities,
            cssClass: "col-city"
        },
        {
            textAlign: 'center',
            values: initDistricts,
            cssClass: "col-district"
        }
        ]
    };

    $.fn.cityPicker = function(params) {
        return this.each(function() {
            if(!this) return;
            var p = $.extend(defaults, params);
            //计算value
            if (p.value) {
                $(this).val(p.value.join(' '));
            } else {
                var val = $(this).val();
                val && (p.value = val.split(' '));
            }

            if (p.value) {
                //p.value = val.split(" ");
                if(p.value[0]) {
                    currentProvince = p.value[0];
                    p.cols[1].values = getCities(p.value[0]);
                }
                if(p.value[1]) {
                    currentCity = p.value[1];
                    p.cols[2].values = getDistricts(p.value[0], p.value[1]);
                } else {
                    p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0]);
                }
                !p.value[2] && (p.value[2] = '');
                currentDistrict = p.value[2];
            }
            $(this).picker(p);
        });
    };

}(Zepto);
