var lib = {
	init: function() {
		//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
		Date.prototype.Format = function(fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		}
	},
	// $.extend();
	jQueryExtend: function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {}, // 默认第0个参数为目标参数
			i = 1, // i表示从第几个参数凯斯想目标参数进行合并，默认从第1个参数开始向第0个参数进行合并
			length = arguments.length,
			deep = false; // 默认为浅度拷贝

		// 判断第0个参数的类型，若第0个参数是boolean类型，则获取其为true还是false
		// 同时将第1个参数作为目标参数，i从当前目标参数的下一个
		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// 判断目标参数的类型，若目标参数既不是object类型，也不是function类型，则为目标参数重新赋值 
		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// 若目标参数后面没有参数了，如$.extend({_name:'wenzi'}), $.extend(true, {_name:'wenzi'})
		// 则目标参数即为jQuery本身，而target表示的参数不再为目标参数
		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		// 从第i个参数开始
		for (; i < length; i++) {
			// 获取第i个参数，且该参数不为null和undefind，在js中null和undefined，如果不区分类型，是相等的，null==undefined为true，
			// 因此可以用null来同时过滤掉null和undefind
			// 比如$.extend(target, {}, null);中的第2个参数null是不参与合并的
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// 使用for~in获取该参数中所有的字段
				// Extend the base object
				for (name in options) {
					src = target[name]; // 目标参数中name字段的值
					copy = options[name]; // 当前参数中name字段的值

					// 若参数中字段的值就是目标参数，停止赋值，进行下一个字段的赋值
					// 这是为了防止无限的循环嵌套，我们把这个称为，在下面进行比较详细的讲解
					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// 若deep为true，且当前参数中name字段的值存在且为object类型或Array类型，则进行深度赋值
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						// 若当前参数中name字段的值为Array类型
						// 判断目标参数中name字段的值是否存在，若存在则使用原来的，否则进行初始化
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							// 若原对象存在，则直接进行使用，而不是创建
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// 递归处理，此处为2.2
						// Never move original objects, clone them  
						target[name] = jQuery.extend(deep, clone, copy);

						// deep为false，则表示浅度拷贝，直接进行赋值
						// 若copy是简单的类型且存在值，则直接进行赋值
						// Don't bring in undefined values
					} else if (copy !== undefined) {
						// 若原对象存在name属性，则直接覆盖掉；若不存在，则创建新的属性
						target[name] = copy;
					}
				}
			}
		}

		// 返回修改后的目标参数
		// Return the modified object
		return target;
	},

}
lib.init();