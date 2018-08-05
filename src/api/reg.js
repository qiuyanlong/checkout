/*
 * @Author: HW.Liang 
 * @Date: 2018-05-30 13:36:31 
 * @Last Modified by:   HW.Liang 
 * @Last Modified time: 2018-05-30 13:36:31 
 */
const regInfo={
    "name": "reg.js",
    "version": "1.0.0",
    "description": "",
    "author": "HW.liang"
}
const Reg = {
    isNull(code) { //空值
        return /\S/.test(code) ? false : true;
    },
    isNum(code) { //整数或者小数
        return /^[0-9]+\.{0,1}[0-9]{0,2}$/.test(code) ? true : false;
    },
    isPositiveInt(code) { //正整数
        return /^\+?[1-9][0-9]*$/.test(code) ? true : false;
    },
    isHanzi(code) { //汉字
        return /^[\u4e00-\u9fa5]{0,}$/.test(code) ? true : false;
    },
    isEmail(code) { //邮箱
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(code) ? true : false;
    },
    isMobile(code) { //手机号码
        return /^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(code) ? true : false;
    },
    IsURL(code) { //网址
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
        + "[a-z]{2,6})" // first level domain- .com or .museum 
        + "(:[0-9]{1,4})?" // 端口- :80 
        + "((/?)|" // a slash isn't required if there is no file name 
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        //re.test()
        if (re.test(code)) {
            return (true);
        } else {
            return (false);
        }
    },
    isZip(code) { //邮编
        return /^[1-9][0-9]{5}$/.test(code) ? true : false;
    },
    isImg(code) { //图片
        return /^.*[^a][^b][^c]\.(?:png|jpg|bmp|gif|jpeg)$/.test(code) ? true : false;
    },
    isHtmlTags(code) { //html标签
        return /<(.*)>(.*)<\/(.*)>|<(.*)\/>/.test(code) ? true : false;
    },
    isIdcardEasy(code){
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code) ? true : false;
    },
    isIdCard(gets) { // idCard
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;
    
        if (gets.length == 15) {
            return isValidityBrithBy15IdCard(gets);
        } else if (gets.length == 18) {
            var a_idCard = gets.split(""); // 得到身份证数组   
            if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
                return true;
            }
            return false;
        }
        return false;
    
        function isTrueValidateCodeBy18IdCard(a_idCard) {
            var sum = 0; // 声明加权求和变量   
            if (a_idCard[17].toLowerCase() == 'x') {
                a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
            }
            for (var i = 0; i < 17; i++) {
                sum += Wi[i] * a_idCard[i]; // 加权求和   
            }
            var valCodePosition = sum % 11; // 得到验证码所位置   
            if (a_idCard[17] == ValideCode[valCodePosition]) {
                return true;
            }
            return false;
        }
    
        function isValidityBrithBy18IdCard(idCard18) {
            var year = idCard18.substring(6, 10);
            var month = idCard18.substring(10, 12);
            var day = idCard18.substring(12, 14);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题   
            if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            }
            return true;
        }
        function isValidityBrithBy15IdCard(idCard15) {
            var year = idCard15.substring(6, 8);
            var month = idCard15.substring(8, 10);
            var day = idCard15.substring(10, 12);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
            if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            }
            return true;
        }
    },
}
export default Reg;