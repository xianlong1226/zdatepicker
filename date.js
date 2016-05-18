!(function($) {
    $.fn.date = function(options, Ycallback, Ncallback) {
        //插件默认选项
        var that = $(this);
        var docType = $(this).is('input');
        var nowdate = new Date();
        var indexY = 1,
            indexM = 1,
            indexD = 1;
        var indexH = 1,
            indexI = 1,
            indexS = 1;
        var initY,initM,initD,initH,initI,initS;
        var yearScroll = null,
            monthScroll = null,
            dayScroll = null;
        var HourScroll = null,
            MinuteScroll = null,
            SecondScroll = null;
        $.fn.date.defaultOptions = {
                beginyear: 1960, //日期--年--份开始
                endyear: 2050, //日期--年--份结束
                beginmonth: 1, //日期--月--份结束
                endmonth: 12, //日期--月--份结束
                beginday: 1, //日期--日--份结束
                endday: 31, //日期--日--份结束
                beginhour: 1,
                endhour: 24,
                beginminute: 00,
                endminute: 59,
                beginsecond:00,
                endsecond:59,
                mode: null, //操作模式（滑动模式）
                event: "click", //打开日期插件默认方式为点击后后弹出日期 
                show: true,
                dateformat:'yyyy-MM-dd HH:mm:ss',
                defaultdate:''
            }
            
        //用户选项覆盖插件默认选项   
        var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
        
        if (!opts.show) {
            that.unbind('click');
        } else {
            //绑定事件（默认事件为获取焦点）
            that.bind(opts.event, function() {

                resetInitDate();//初始化时间
                createUL(); //动态生成控件显示的日期
                init_iScrll(); //初始化日期滑动事件
                
                //显示控件
                show(opts.dateformat);
                
                that.blur();
                
                refreshDate();
                
                refreshTime();
                
                bindButton();
                setPostion();
            })
        };
        
        function show(dateformat) {
            switch(dateformat){
                case "yyyy":
                    $('#monthwrapper').hide();
                    $('#daywrapper').hide();
                    $('#Hourwrapper').hide();
                    $('#Minutewrapper').hide();
                    $('#Secondwrapper').hide();
                    break;
                case "yyyy-MM":
                    $('#daywrapper').hide();
                    $('#Hourwrapper').hide();
                    $('#Minutewrapper').hide();
                    $('#Secondwrapper').hide();
                    break;
                case "yyyy-MM-dd":
                    $('#Hourwrapper').hide();
                    $('#Minutewrapper').hide();
                    $('#Secondwrapper').hide();
                    break;
                case "yyyy-MM-dd HH":
                    $('#Minutewrapper').hide();
                    $('#Secondwrapper').hide();
                    break;
                case "yyyy-MM-dd HH:mm":
                    $('#Secondwrapper').hide();
                    break;
                case "yyyy-MM-dd HH:mm:ss":
                    break;
            }
            $("#datePage").show();
            $("#dateshadow").show();
        }

        function refreshDate() {
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();

            yearScroll.scrollTo(0, initY * 40, 100, true);
            monthScroll.scrollTo(0, initM * 40, 100, true);
            dayScroll.scrollTo(0, initD * 40, 100, true);
        }

        function refreshTime() {
            HourScroll.refresh();
            MinuteScroll.refresh();
            SecondScroll.refresh();

            HourScroll.scrollTo(0, initH * 40, 100, true);
            MinuteScroll.scrollTo(0, initI * 40, 100, true);
            SecondScroll.scrollTo(0,initS*40,100,true);
        }

        function resetIndex() {
            indexY = 1;
            indexM = 1;
            indexD = 1;
        }

        function resetInitDate() {

            var value=that.val()||opts.defaultdate;
            var d=new Date();
            if($.trim(value)!=''){
                var year=parseInt(value.substr(0, 4));
                if(!year){
                    year=d.getFullYear();
                }
                var month=parseInt(value.substr(5, 2));
                if(!month){
                    month=d.getMonth()+1;
                }
                var day=parseInt(value.substr(8, 2));
                if(!day){
                    day=d.getDate();
                }
                var hour=parseInt(value.substr(11,2));
                if(!hour){
                    hour=d.getHours();
                }
                var minute=parseInt(value.substr(14,2));
                if(!minute){
                    minute=d.getMinutes();
                }
                var second=parseInt(value.substr(17,2));
                if(!second){
                    second=d.getSeconds();
                }
            }else{
                var year=d.getFullYear();
                var month=d.getMonth()+1;
                var day=d.getDate();
                var hour=d.getHours();
                var minute=d.getMinutes();
                var second=d.getSeconds();
            }

            initY = year-parseInt(opts.beginyear);
            initM = month-opts.beginmonth;
            initD = day-opts.beginday;
            initH = hour-opts.beginhour;
            initI = minute-opts.beginminute;
            initS = second-opts.beginsecond;

            opts.endday = checkdays(year, month);
        }

        function bindButton() {
            //resetIndex();
            $("#dateconfirm").unbind('click').click(function() {
                var datestr ='';
                
                var year=$("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                var month=$("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1);
                var day=$("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
                var h=$("#Hourwrapper ul li:eq(" + indexH + ")").html().substr(0, $("#Minutewrapper ul li:eq(" + indexH + ")").html().length - 1);
                var mi=$("#Minutewrapper ul li:eq(" + indexI + ")").html().substr(0, $("#Minutewrapper ul li:eq(" + indexI + ")").html().length - 1);
                var s=$("#Secondwrapper ul li:eq(" + indexS + ")").html().substr(0, $("#Secondwrapper ul li:eq(" + indexS + ")").html().length - 1);;
                
                if(!opts.dateformat){
                    opts.dateformat='yyyy-MM-dd HH:mm:ss';
                }
                switch(opts.dateformat){
                    case "yyyy":
                        datestr+=year;
                        break;
                    case "yyyy-MM":
                        datestr+=year+'-'+month;
                        break;
                    case "yyyy-MM-dd":
                        datestr+=year+'-'+month+'-'+day;
                        break;
                    case "yyyy-MM-dd HH":
                        datestr+=year+'-'+month+'-'+day+' '+h;
                        break;
                    case "yyyy-MM-dd HH:mm":
                        datestr+=year+'-'+month+'-'+day+' '+h+':'+mi;
                        break;
                    case "yyyy-MM-dd HH:mm:ss":
                        datestr+=year+'-'+month+'-'+day+' '+h+':'+mi+':'+s;
                        break;
                }
                
                if (Ycallback === undefined) {
                    if (docType) { that.val(datestr); } else { that.html(datestr); }
                } else {
                    Ycallback(datestr);
                }
                $('#datePlugin').remove();
            });
            $("#datecancle").click(function() {
                $('#datePlugin').remove();
                Ncallback(false);
            });
        }

        //日期滑动
        function init_iScrll() {
            var strY = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
            var strM = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1);
            yearScroll = new iScroll("yearwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function() {
                    indexY = (this.y / 40) * (-1) + 1;
                    strY = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                    opts.endday = checkdays(strY, strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                }
            });
            monthScroll = new iScroll("monthwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function() {
                    indexM = (this.y / 40) * (-1) + 1;
                    strM = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1)
                    opts.endday = checkdays(strY, strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                }
            });
            dayScroll = new iScroll("daywrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function() {
                    indexD = (this.y / 40) * (-1) + 1;
                }
            });
            HourScroll = new iScroll("Hourwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function() {
                    indexH = Math.round((this.y / 40) * (-1)) + 1;
                    HourScroll.refresh();
                }
            });
            MinuteScroll = new iScroll("Minutewrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function() {
                    indexI = Math.round((this.y / 40) * (-1)) + 1;
                    HourScroll.refresh();
                }
            });
            SecondScroll = new iScroll("Secondwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function() {
                    indexS = Math.round((this.y / 40) * (-1))+1;
                    HourScroll.refresh();
                }
            });
        }

        function checkdays(year, month) {
            var new_year = year; //取当前的年份        
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）        
            if (month > 12) //如果当前大于12月，则年份转到下一年        
            {
                new_month -= 12; //月份减        
                new_year++; //年份增        
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天        
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期    
        }

        function createUL() {
            CreateDateUI();
            $("#yearwrapper ul").html(createYEAR_UL());
            $("#monthwrapper ul").html(createMONTH_UL());
            $("#daywrapper ul").html(createDAY_UL());
            
            $("#Hourwrapper ul").html(createHOURS_UL());
            $("#Minutewrapper ul").html(createMINUTE_UL());
            $("#Secondwrapper ul").html(createSECOND_UL());
        }

        function CreateDateUI() {
            var str = '' +
                '<div id="dateshadow"></div>' +
                '<div id="datePage" class="page">' +
                '<section>' +
                '<div id="datetitle"><h1>请选择日期</h1></div>' +
                '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>' +
                '<div id="datescroll">' +
                '<div id="yearwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="monthwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="daywrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="Hourwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="Minutewrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="Secondwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '</div>' +
                '</section>' +
                '<footer id="dateFooter">' +
                '<div id="setcancle">' +
                '<ul>' +
                '<li id="dateconfirm">确定</li>' +
                '<li id="datecancle">取消</li>' +
                '</ul>' +
                '</div>' +
                '</footer>' +
                '</div>'
                //$("#datePlugin").html(str);
            var div = document.createElement('div');
            div.id = "datePlugin";
            div.innerHTML = str;
            document.body.appendChild(div);

        }

        //创建 --年-- 列表
        function createYEAR_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginyear; i <= opts.endyear; i++) {
                str += '<li>' + i + '年</li>';
            }
            return str + "<li>&nbsp;</li>";
        }
        //创建 --月-- 列表
        function createMONTH_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                str += '<li>' + i + '月</li>';
            }
            return str + "<li>&nbsp;</li>";
        }
        //创建 --日-- 列表
        function createDAY_UL() {
            $("#daywrapper ul").html("");
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginday; i <= opts.endday; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                str += '<li>' + i + '日</li>';
            }
            return str + "<li>&nbsp;</li>";
        }
        //创建 --时-- 列表
        function createHOURS_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginhour; i <= opts.endhour; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                str += '<li>' + i + '时</li>';
            }
            return str + "<li>&nbsp;</li>";
        }
        //创建 --分-- 列表
        function createMINUTE_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginminute; i <= opts.endminute; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                str += '<li>' + i + '分</li>';
            }
            return str + "<li>&nbsp;</li>";
        }
        //创建 --秒-- 列表
        function createSECOND_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginsecond; i <= opts.endsecond; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                str += '<li>' + i + '秒</li>';
            }
            return str + "<li>&nbsp;</li>";
        }
        
        //设置控件位置
        function setPostion(){

            var div=$("#datePlugin").get(0);
            div.children[0].style.height = document.body.scrollHeight + 'px';
            div.children[1].style.top = ($(window).height() - $('#datePage').height()) / 2 + document.body.scrollTop + 'px';

        }
        
    }
})(jQuery);
