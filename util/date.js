//获取时间
var now ; //当前日期
var nowDayOfWeek; //今天本周的第几天
var nowDay; //当前日
var nowMonth; //当前月
var nowYear; //当前年
var lastMonthDate; //上月日期
var lastYear;
var lastMonth;

function getData(){
	//获取时间
	now = new Date(); //当前日期
    console.log(now)
	nowDayOfWeek = now.getDay(); //今天本周的第几天
	nowDay = now.getDate(); //当前日
	nowMonth = now.getMonth(); //当前月
	nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	lastMonthDate = new Date(); //上月日期
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
	lastYear = lastMonthDate.getYear();
	lastMonth = lastMonthDate.getMonth();
}
//格式化日期：yyyy-MM-dd
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth()+1;
    var myweekday = date.getDate();

    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }
    return (myyear+"-"+mymonth + "-" + myweekday);
}

//获得某月的天数
function getMonthDays(myMonth){
	getData();
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    return days;
}

//获得本季度的开始月份
function getQuarterStartMonth(){
    var quarterStartMonth = 0;
    if(nowMonth<3){
        quarterStartMonth = 0;
    }
    if(2<nowMonth && nowMonth<6){
        quarterStartMonth = 3;
    }
    if(5<nowMonth && nowMonth<9){
        quarterStartMonth = 6;
    }
    if(nowMonth>8){
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获得本周的开始日期
function getWeekStartDate() {
	getData();
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek +1);
    return formatDate(weekStartDate);
}

//获得本周的结束日期
function getWeekEndDate() {
	getData();
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    return formatDate(weekEndDate);
}

//获得本月的开始日期
function getMonthStartDate(){
	getData();
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}

//获得本月的结束日期
function getMonthEndDate(){
	getData();
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}

//获得上月开始时间
function getLastMonthStartDate(){
	getData();
    if(nowMonth === 0){
        nowYear -= 1;
    }
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}

//获得上月结束时间
function getLastMonthEndDate(){
	getData();
    if(nowMonth === 0){
        nowYear -= 1;
    }
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

//获得本季度的开始日期
function getQuarterStartDate(){
	getData();
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return formatDate(quarterStartDate);
}

//获得本季度的结束日期
function getQuarterEndDate(){
	getData();
    var quarterEndMonth = getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate);
}

//获得本年的开始日期
function getYearStartDate(){
	getData();
    var monthStartDate = new Date(nowYear, 0, 1);
    return formatDate(monthStartDate);
}

//获得本年的结束日期
function getYearEndDate(){
	getData();
    var monthEndDate = new Date(nowYear, 11, 31);
    return formatDate(monthEndDate);
}
//获得上一年的开始日期
function getLastYearStartDate(){
	getData();
    var monthStartDate = new Date(nowYear - 1, 0, 1);
    return formatDate(monthStartDate);
}

//获得上一年的结束日期
function getLastYearEndDate(){
	getData();
    var monthEndDate = new Date(nowYear - 1, 11, 31);
    return formatDate(monthEndDate);
}
module.exports = {
	formatDate,
	getMonthDays,
	getQuarterStartMonth,
	getWeekStartDate,
	getWeekEndDate,
	getMonthStartDate,
	getMonthEndDate,
	getLastMonthStartDate,
	getLastMonthEndDate,
	getQuarterStartDate,
	getQuarterEndDate,
	getYearStartDate,
	getYearEndDate,
	getLastYearStartDate,
	getLastYearEndDate
};