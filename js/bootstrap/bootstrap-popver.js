// JavaScript Document

//01.来自：www.tuicool.com/articles/6bErqq  网站

var Popover = function ( element, options ){} //构造器
Popover.prototype = {} // 构造器的原型
$.fn.popover = function ( option ){} //jQuery原型上的自定义方法
$.fn.popover.Constructor = Popover //重写jQuery原型方法popover的构造器名
$.fn.popover.defaults = {} // 默认参数



