//自由驱动工作室
//作者：林鑫
$(function(){
        var Initials=$('.initials');
        var LetterBox=$('#letter');
//      Initials.find('ul').append('<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li><li>#</li>');
Initials.find('ul').append('<li id="A">A</li><li id="B">B</li><li id="C">C</li><li id="D">D</li><li id="E">E</li><li id="F">F</li><li id="G">G</li><li id="H">H</li><li id="I">I</li><li id="J">J</li><li id="K">K</li><li id="L">L</li><li id="M">M</li><li id="N">N</li><li id="O">O</li><li id="P">P</li><li id="Q">Q</li><li id="R">R</li><li id="S">S</li><li id="T">T</li><li id="U">U</li><li id="V">V</li><li id="W">W</li><li id="X">X</li><li id="Y">Y</li><li id="Z">Z</li>');
        initials();

        $(".initials ul li").click(function(){
            var _this=$(this);
            var LetterHtml=_this.html();
            LetterBox.html(LetterHtml).fadeIn();

            Initials.css('background','rgba(145,145,145,0.6)');
            
            setTimeout(function(){
                Initials.css('background','rgba(145,145,145,0)');
                LetterBox.fadeOut();
            },1000);

            var _index = _this.index();
            var search_h = $('.serach_box').outerHeight();
            if(_index==0){
                //$('html,body').animate({scrollTop: '0px'}, 300);//点击第一个滚到顶部
                $('.sort_box').animate({scrollTop: '0px'}, 300);
            }else if(_index==27){
                var DefaultTop=$('#default').position().top;
               // $('html,body').animate({scrollTop: DefaultTop+'px'}, 300);//点击最后一个滚到#号
               $('.sort_box').animate({scrollTop: DefaultTop+'px'}, 300);
            }else{
                var letter = _this.text();
                if($('#'+letter).length>0){
                    var LetterTop = $('#'+letter).position().top;
                    //$('html,body').animate({scrollTop: LetterTop-45+'px'}, 300);
                    $('.sort_box').animate({scrollTop: LetterTop-search_h+'px'}, 300);
                }
            }
        })

	    
    $('.sort_box').scroll(function(){  //滚动条滚动事件
		var aTtlH3 = $('.sort_letter');
		var scrollT = $('.sort_box').scrollTop();
		var aItem = $('.initials li');
		var oSideWap =$('.side-catalog');
		
		$('.sort_letter').each(function(index, elem) {
           if(aTtlH3.eq(index).offset().top<scrollT+100 && aTtlH3.eq(index+1).offset().top>scrollT+100){	
				//aItem.eq(index).attr('id',aTtlH3.eq(index).html()).addClass('cur').siblings().removeClass('cur');
				if(aa='A'){
					aItem.eq(0).addClass('cur').siblings().removeClass('cur');
				}else if(aa='B'){
					aItem.eq(1).addClass('cur').siblings().removeClass('cur');
				}else if(aa='C'){
					aItem.eq(2).addClass('cur').siblings().removeClass('cur');
				}else if(aa='D'){
					aItem.eq(3).addClass('cur').siblings().removeClass('cur');
				}else if(aa='E'){
					aItem.eq(4).addClass('cur').siblings().removeClass('cur');
				}else if(aa='F'){
					aItem.eq(5).addClass('cur').siblings().removeClass('cur');
				}else if(aa='G'){
					aItem.eq(6).addClass('cur').siblings().removeClass('cur');
				}else if(aa='H'){
					aItem.eq(7).addClass('cur').siblings().removeClass('cur');
				}else if(aa='I'){
					aItem.eq(8).addClass('cur').siblings().removeClass('cur');
				}else if(aa='J'){
					aItem.eq(9).addClass('cur').siblings().removeClass('cur');
				}else if(aa='K'){
					aItem.eq(10).addClass('cur').siblings().removeClass('cur');
				}else if(aa='L'){
					aItem.eq(11).addClass('cur').siblings().removeClass('cur');
				}else if(aa='M'){
					aItem.eq(12).addClass('cur').siblings().removeClass('cur');
				}else if(aa='N'){
					aItem.eq(13).addClass('cur').siblings().removeClass('cur');
				}else if(aa='O'){
					aItem.eq(14).addClass('cur').siblings().removeClass('cur');
				}else if(aa='P'){
					aItem.eq(15).addClass('cur').siblings().removeClass('cur');
				}else if(aa='Q'){
					aItem.eq(16).addClass('cur').siblings().removeClass('cur');
				}else if(aa='R'){
					aItem.eq(17).addClass('cur').siblings().removeClass('cur');
				}else if(aa='S'){
					aItem.eq(18).addClass('cur').siblings().removeClass('cur');
				}else if(aa='T'){
					aItem.eq(19).addClass('cur').siblings().removeClass('cur');
				}else if(aa='U'){
					aItem.eq(20).addClass('cur').siblings().removeClass('cur');
				}else if(aa='V'){
					aItem.eq(21).addClass('cur').siblings().removeClass('cur');
				}else if(aa='W'){
					aItem.eq(22).addClass('cur').siblings().removeClass('cur');
				}else if(aa='X'){
					aItem.eq(23).addClass('cur').siblings().removeClass('cur');
				}else if(aa='Y'){
					aItem.eq(24).addClass('cur').siblings().removeClass('cur');
				}else if(aa='Z'){
					aItem.eq(25).addClass('cur').siblings().removeClass('cur');
				}
			}else{
				//aItem.eq(index).removeClass('cur');
				//if(aTtlH3.eq(4).offset().top<scrollT+100){
					//aItem.eq(4).find('.point').addClass('cur');	
				//}
			}
			
		});
	});
})

function initials() {//公众号排序
    var SortList=$(".sort_list");
    var SortBox=$(".sort_box");
    SortList.sort(asc_sort).appendTo('.sort_box');//按首字母排序
    function asc_sort(a, b) {
        return makePy($(b).find('.num_name').text().charAt(0))[0].toUpperCase() < makePy($(a).find('.num_name').text().charAt(0))[0].toUpperCase() ? 1 : -1;
    }

    var initials = [];
    var num=0;
    SortList.each(function(i) {
        var initial = makePy($(this).find('.num_name').text().charAt(0))[0].toUpperCase();
        if(initial>='A'&&initial<='Z'){
            if (initials.indexOf(initial) === -1)
                initials.push(initial);
        }else{
            num++;
        }
        
    });

    $.each(initials, function(index, value) {//添加首字母标签
        SortBox.append('<div class="sort_letter" id="'+ value +'">' + value + '</div>');
    });
    if(num!=0){SortBox.append('<div class="sort_letter" id="default">#</div>');}

    for (var i =0;i<SortList.length;i++) {//插入到对应的首字母后面
        var letter=makePy(SortList.eq(i).find('.num_name').text().charAt(0))[0].toUpperCase();
        switch(letter){
            case "A":
                $('#A').after(SortList.eq(i));
                break;
            case "B":
                $('#B').after(SortList.eq(i));
                break;
            case "C":
                $('#C').after(SortList.eq(i));
                break;
            case "D":
                $('#D').after(SortList.eq(i));
                break;
            case "E":
                $('#E').after(SortList.eq(i));
                break;
            case "F":
                $('#F').after(SortList.eq(i));
                break;
            case "G":
                $('#G').after(SortList.eq(i));
                break;
            case "H":
                $('#H').after(SortList.eq(i));
                break;
            case "I":
                $('#I').after(SortList.eq(i));
                break;
            case "J":
                $('#J').after(SortList.eq(i));
                break;
            case "K":
                $('#K').after(SortList.eq(i));
                break;
            case "L":
                $('#L').after(SortList.eq(i));
                break;
            case "M":
                $('#M').after(SortList.eq(i));
                break;
            case "O":
                $('#O').after(SortList.eq(i));
                break;
            case "P":
                $('#P').after(SortList.eq(i));
                break;
            case "Q":
                $('#Q').after(SortList.eq(i));
                break;
            case "R":
                $('#R').after(SortList.eq(i));
                break;
            case "S":
                $('#S').after(SortList.eq(i));
                break;
            case "T":
                $('#T').after(SortList.eq(i));
                break;
            case "U":
                $('#U').after(SortList.eq(i));
                break;
            case "V":
                $('#V').after(SortList.eq(i));
                break;
            case "W":
                $('#W').after(SortList.eq(i));
                break;
            case "X":
                $('#X').after(SortList.eq(i));
                break;
            case "Y":
                $('#Y').after(SortList.eq(i));
                break;
            case "Z":
                $('#Z').after(SortList.eq(i));
                break;
            default:
                $('#default').after(SortList.eq(i));
                break;
        }
    };
}