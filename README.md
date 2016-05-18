# zdatepicker
Based on jquery mobile end date plugin
```javascript
//出生日期
$('#txt_Birthday').date({
    beginyear: 1980,                 //日期--年--份开始
    endyear: 2050,                   //日期--年--份结束
	  dateformat:'yyyy-MM-dd HH:mm:ss',         //日期格式           
	  defaultdate:'1990-01'            //默认显示的日期
}, function(selectionDate){
	$('#txt_Birthday').val(selectionDate);
},function(bo){

});
	
```
