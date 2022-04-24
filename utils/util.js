/**
 * 数据处理
 * @author LAN
 * @version 1.0.0
 **/
const utils = {
	// 自定义
	text2Color(text, opacity) {
		let rgbaColor = "rgba(25, 190, 107, " + opacity + ")";
		if (text == "success") {
			opacity = opacity || 1;
			rgbaColor = "rgba(25, 190, 107, " + opacity + ")";
		} else if (text == "warning") {
			opacity = opacity || 1;
			rgbaColor = "rgba(255, 121, 0, " + opacity + ")";
		} else if (text == "gray") {
			opacity = opacity || 0.7;
			rgbaColor = "rgba(0, 0, 0, " + opacity + ")";
		} else if (text == "danger") {
			opacity = opacity || 1;
			rgbaColor = "rgba(0, 129, 255, " + opacity + ")"
		} else if (text = "primary") {
			opacity = opacity || 1;
			rgbaColor = "rgba(235, 9, 9, " + opacity + ")"
		}
		return rgbaColor
	},
	moneyTran(n) {
		if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
			return "数据非法";
		var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
		n += "00";

		var p = n.indexOf('.');
		if (p >= 0)
			n = n.substring(0, p) + n.substr(p + 1, 2);
		unit = unit.substr(unit.length - n.length);
		for (var i = 0; i < n.length; i++)
			str += '零一二三四五六七八九十'.charAt(n.charAt(i)) + unit.charAt(i);
		return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
	},
	numTran(num) {
		return ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][num]
	},
	role2Text(role) {
		let auth = {
			"guest": {
				code: 10,
				text: "游客"
			}, "member": {
				code: 20,
				text: "会员用户"
			}, "staff_member": {
				code: 30,
				text: "普通职员"
			}, 'manager': {
				code: 35,
				text: "店长"
			}, 'boss': {
				code: 35,
				text: "管理员"
			}, "admin": {
				code: 40,
				text: "超级管理员"
			}
		}
		console.log(role)
		return auth[role].text
	},
	role2Code(role) {
		let auth = {
			"guest": {
				code: 10,
				text: "游客"
			}, "member": {
				code: 20,
				text: "会员用户"
			}, "staff_member": {
				code: 30,
				text: "普通职员"
			}, 'manager': {
				code: 35,
				text: "店长"
			}, 'boss': {
				code: 35,
				text: "管理员"
			}, "admin": {
				code: 40,
				text: "超级管理员"
			}
		}
		return auth[role].code
	}

}

export default utils