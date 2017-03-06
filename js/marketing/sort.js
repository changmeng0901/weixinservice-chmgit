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

	//默认第一个字母(但不一定是A哦)为选中状态
	$('.sort_letter').each(function(index, elem) {
		var aa = $('.sort_letter').eq(0).attr('nindex');	
		$('.initials li').eq(aa).addClass('cur').siblings().removeClass('cur')
	});
	//当滚动条滚动时，sort_letter滚到设定区域内，右侧字母和目前的LETTER的索引值相对应，并且为选中状态
    $('.sort_box').scroll(function(){  //滚动条滚动事件
		var aTtlH3 = $('.sort_letter');
		var scrollT = $('.sort_box').scrollTop();
		var aItem = $('.initials li');
		
		$('.sort_letter').each(function(index, elem) {
			//var letter = $(elem).text();
			//var LetterTop = $('#'+letter).position().top;
			var search_h = $('.serach_box').height()-2;
			var crop_sort_box_h = $('.crop_sort_box').height();
			//if(aTtlH3.eq(index).offset().top<scrollT && aTtlH3.eq(index+1).offset().top>scrollT){
			if(aTtlH3.eq(index).offset().top<scrollT+search_h && aTtlH3.eq(index+1).offset().top>scrollT+search_h){
				//console.log(search_h)
				var aa = aTtlH3.eq(index).attr('nindex');
				$('.initials li').eq(aa).addClass('cur').siblings().removeClass('cur')
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
                $('#A').attr('nindex',0);
                break;
            case "B":
                $('#B').after(SortList.eq(i));
                $('#B').attr('nindex',1);
                break;
            case "C":
                $('#C').after(SortList.eq(i));
                $('#C').attr('nindex',2);
                break;
            case "D":
                $('#D').after(SortList.eq(i));
                $('#D').attr('nindex',3);
                break;
            case "E":
                $('#E').after(SortList.eq(i));
                $('#E').attr('nindex',4);
                break;
            case "F":
                $('#F').after(SortList.eq(i));
                $('#F').attr('nindex',5);
                break;
            case "G":
                $('#G').after(SortList.eq(i));
                $('#G').attr('nindex',6);
                break;
            case "H":
                $('#H').after(SortList.eq(i));
                $('#H').attr('nindex',7);
                break;
            case "I":
                $('#I').after(SortList.eq(i));
                $('#I').attr('nindex',8);
                break;
            case "J":
                $('#J').after(SortList.eq(i));
                $('#J').attr('nindex',9);
                break;
            case "K":
                $('#K').after(SortList.eq(i));
                $('#K').attr('nindex',10);
                break;
            case "L":
                $('#L').after(SortList.eq(i));
                $('#L').attr('nindex',11);
                break;
            case "M":
                $('#M').after(SortList.eq(i));
                $('#M').attr('nindex',12);
                break;
            case "N":
                $('#N').after(SortList.eq(i));
                $('#N').attr('nindex',13);
                break;
            case "O":
                $('#O').after(SortList.eq(i));
                $('#O').attr('nindex',14);
                break;
            case "P":
                $('#P').after(SortList.eq(i));
                $('#P').attr('nindex',15);
                break;
            case "Q":
                $('#Q').after(SortList.eq(i));
                $('#Q').attr('nindex',16);
                break;
            case "R":
                $('#R').after(SortList.eq(i));
                $('#R').attr('nindex',17);
                break;
            case "S":
                $('#S').after(SortList.eq(i));
                $('#S').attr('nindex',18);
                break;
            case "T":
                $('#T').after(SortList.eq(i));
                $('#T').attr('nindex',19);
                break;
            case "U":
                $('#U').after(SortList.eq(i));
                $('#U').attr('nindex',20);
                break;
            case "V":
                $('#V').after(SortList.eq(i));
                $('#V').attr('nindex',21);
                break;
            case "W":
                $('#W').after(SortList.eq(i));
                $('#W').attr('nindex',22);
                break;
            case "X":
                $('#X').after(SortList.eq(i));
                $('#X').attr('nindex',23);
                break;
            case "Y":
                $('#Y').after(SortList.eq(i));
                $('#Y').attr('nindex',24);
                break;
            case "Z":
                $('#Z').after(SortList.eq(i));
                $('#Z').attr('nindex',25);
                break;
            default:
                $('#default').after(SortList.eq(i));
                break;
        }
    };
}