export const calcDate = (date1, date2) => {
    var date3 = date2 - date1;

    var days = Math.floor(date3 / (24 * 3600 * 1000));

    var leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));

    var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    var leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
    var seconds = Math.round(date3 / 1000);
    return {
        leave1,
        leave2,
        leave3,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
};

/**
 * 日期格式化
 */
export function dateFormat(date) {
    let format = "yyyy-MM-dd hh:mm:ss";
    if (date !== "Invalid Date") {
        var o = {
            "M+": date.getMonth() + 1, // month
            "d+": date.getDate(), // day
            "h+": date.getHours(), // hour
            "m+": date.getMinutes(), // minute
            "s+": date.getSeconds(), // second
            "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
            S: date.getMilliseconds() // millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return format;
    }
    return "";
}

export function formatTime(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            var str = o[k] + "";
            fmt = fmt
                .replace(RegExp.$1, RegExp.$1.length === 1 ? str : "0" + str)
                .substr(str.length);
        }
    }
    return fmt;
}

export function fun_date(num) {
    var date1 = new Date();
    //今天时间
    var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
    console.log(time1);
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + num);
    //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    console.log(time2);
    return time2;
}
