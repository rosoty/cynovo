function validateForm(fields, mess, id) {

	if (fields == '') {
		return false;
	}
	var err = false;
	var arr = fields.split(';');

	for (i = 0; i <= (arr.length - 1); i++) {
		if (arr[i] != '' && arr[i] != undefined) {
			if (
					$('[name=' + arr[i] + ']').val() == '' ||
					$('[name=' + arr[i] + ']').val() == 0 ||
					$('[name=' + arr[i] + ']').val() == null
					) {
				$('[name=' + arr[i] + ']').css({"background": "#fcc"})
				err = true;
			} else {
				$('[name=' + arr[i] + ']').css({"background": "#fff"})
			}
		}
	}

	if (err) {
		$('#' + id).html(mess);
		return false;
	} else {
		return true;
	}
}


function goback() {
	history.go(-1);
	return false;
}

function submitFormPost(l) {
	var result = true;
	if ($(l).parents('form').length == 0) {
		return false;
	}
	if ($(l).parents('form').attr('onsubmit') != undefined) {
		var ons = $(l).parents('form').attr('onsubmit');
		ons = ons.replace('return ', '');
		result = eval(ons);
	}
	if (result == true) {
		$(l).parents('form').submit();
	}
}

function jform() {
	if ($('form.jform').length == 0) {
		return false;
	}
	$('form.jform').submit(function (e) {
		e.preventDefault();
		var url = '';
		$(this).find("input,textarea,select,hidden").each(function (i, el) {
			if (el.name != '') {
				url += '/' + el.name + ':' + $(el).val();
			}
		});
		url = $(this).attr('action') + url;
		location.replace(url);
	});
}

function submitForm(formId) {
	if ($('form#' + formId).length == 0) {
		return false;
	}

	var url = '';
	$('form#' + formId).find("input,textarea,select,hidden").each(function (i, el) {
		if (el.name != '') {
			url += '/' + el.name + ':' + $(el).val();
		}
	});
	url = $('form#' + formId).attr('action') + url;
	location.replace(url);
	return false;
}

function viewMess(mess) {
	mess = '<div id="modalInfo" class="modalClose">' + mess + '</div>';
	openModal(mess);
}

function openModal(mess) {
	$(function () {
		$.modalManual({
			'content': mess
		});
	});
}

function closeModal() {
	$.modalRemove();
}

function clearForm(formObj) {
	formObj.find('input[type=text],input[type=password]').each(function () {
		var attr = $(this).attr('readonly');
		if ((typeof (attr) === 'undefined' || attr === false || $(this).hasClass('toClear') === true) && ($(this).hasClass('skipClear') == false))
		{
			$(this).prop("value", '');
		}
	});

	formObj.find('textarea:not([readonly=readonly])').val('');
	formObj.find('select option').removeProp('selected');
	formObj.find('input[type=checkbox]').not('.skipClear').prop('checked', false);
	formObj.find('input[type=radio]').not('.skipClear').prop('checked', false);
}

function serialize(mixed_value) {
	var _getType = function (inp) {
		var type = typeof inp, match;
		var key;
		if (type == 'object' && !inp) {
			return 'null';
		}
		if (type == "object") {
			if (!inp.constructor) {
				return 'object';
			}
			var cons = inp.constructor.toString();
			match = cons.match(/(\w+)\(/);
			if (match) {
				cons = match[1].toLowerCase();
			}
			var types = ["boolean", "number", "string", "array"];
			for (key in types) {
				if (cons == types[key]) {
					type = types[key];
					break;
				}
			}
		}
		return type;
	};
	var type = _getType(mixed_value);
	var val, ktype = '';

	switch (type) {
		case "function":
			val = "";
			break;
		case "boolean":
			val = "b:" + (mixed_value ? "1" : "0");
			break;
		case "number":
			val = (Math.round(mixed_value) == mixed_value ? "i" : "d") + ":" + mixed_value;
			break;
		case "string":
			mixed_value = this.utf8_encode(mixed_value);
			val = "s:" + encodeURIComponent(mixed_value).replace(/%../g, 'x').length + ":\"" + mixed_value + "\"";
			break;
		case "array":
		case "object":
			val = "a";
			/*
			 if (type == "object") {
			 var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
			 if (objname == undefined) {
			 return;
			 }
			 objname[1] = this.serialize(objname[1]);
			 val = "O" + objname[1].substring(1, objname[1].length - 1);
			 }
			 */
			var count = 0;
			var vals = "";
			var okey;
			var key;
			for (key in mixed_value) {
				ktype = _getType(mixed_value[key]);
				if (ktype == "function") {
					continue;
				}

				okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
				vals += this.serialize(okey) +
						this.serialize(mixed_value[key]);
				count++;
			}
			val += ":" + count + ":{" + vals + "}";
			break;
		case "undefined": // Fall-through
		default: // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
			val = "N";
			break;
	}
	if (type != "object" && type != "array") {
		val += ";";
	}
	return val;
}



function unserialize(data) {
	var that = this;
	var utf8Overhead = function (chr) {
		// http://phpjs.org/functions/unserialize:571#comment_95906
		var code = chr.charCodeAt(0);
		if (code < 0x0080) {
			return 0;
		}
		if (code < 0x0800) {
			return 1;
		}
		return 2;
	};


	var error = function (type, msg, filename, line) {
		throw new that.window[type](msg, filename, line);
	};
	var read_until = function (data, offset, stopchr) {
		var buf = [];
		var chr = data.slice(offset, offset + 1);
		var i = 2;
		while (chr != stopchr) {
			if ((i + offset) > data.length) {
				error('Error', 'Invalid');
			}
			buf.push(chr);
			chr = data.slice(offset + (i - 1), offset + i);
			i += 1;
		}
		return [buf.length, buf.join('')];
	};
	var read_chrs = function (data, offset, length) {
		var buf;

		buf = [];
		for (var i = 0; i < length; i++) {
			var chr = data.slice(offset + (i - 1), offset + i);
			buf.push(chr);
			length -= utf8Overhead(chr);
		}
		return [buf.length, buf.join('')];
	};
	var _unserialize = function (data, offset) {
		var readdata;
		var readData;
		var chrs = 0;
		var ccount;
		var stringlength;
		var keyandchrs;
		var keys;

		if (!offset) {
			offset = 0;
		}
		var dtype = (data.slice(offset, offset + 1)).toLowerCase();

		var dataoffset = offset + 2;
		var typeconvert = function (x) {
			return x;
		};

		switch (dtype) {
			case 'i':
				typeconvert = function (x) {
					return parseInt(x, 10);
				};
				readData = read_until(data, dataoffset, ';');
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 1;
				break;
			case 'b':
				typeconvert = function (x) {
					return parseInt(x, 10) !== 0;
				};
				readData = read_until(data, dataoffset, ';');
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 1;
				break;
			case 'd':
				typeconvert = function (x) {
					return parseFloat(x);
				};
				readData = read_until(data, dataoffset, ';');
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 1;
				break;
			case 'n':
				readdata = null;
				break;
			case 's':
				ccount = read_until(data, dataoffset, ':');
				chrs = ccount[0];
				stringlength = ccount[1];
				dataoffset += chrs + 2;

				readData = read_chrs(data, dataoffset + 1, parseInt(stringlength, 10));
				chrs = readData[0];
				readdata = readData[1];
				dataoffset += chrs + 2;
				if (chrs != parseInt(stringlength, 10) && chrs != readdata.length) {
					error('SyntaxError', 'String length mismatch');
				}

				readdata = that._decode(readdata);
				break;
			case 'a':
				readdata = {};

				keyandchrs = read_until(data, dataoffset, ':');
				chrs = keyandchrs[0];
				keys = keyandchrs[1];
				dataoffset += chrs + 2;

				for (var i = 0; i < parseInt(keys, 10); i++) {
					var kprops = _unserialize(data, dataoffset);
					var kchrs = kprops[1];
					var key = kprops[2];
					dataoffset += kchrs;

					var vprops = _unserialize(data, dataoffset);
					var vchrs = vprops[1];
					var value = vprops[2];
					dataoffset += vchrs;

					readdata[key] = value;
				}

				dataoffset += 1;
				break;
			default:
				error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
				break;
		}
		return [dtype, dataoffset - offset, typeconvert(readdata)];
	};

	return _unserialize((data + ''), 0)[2];
}


function utf8_encode(string) {
	string = string.replace(/\r\n/g, "\n");
	var utftext = "";
	var start, end;

	start = end = 0;
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		var enc = null;

		if (c < 128) {
			end++;
		} else if ((c > 127) && (c < 2048)) {
			enc = String.fromCharCode((c >> 6) | 192) + String.fromCharCode((c & 63) | 128);
		} else {
			enc = String.fromCharCode((c >> 12) | 224) + String.fromCharCode(((c >> 6) & 63) | 128) + String.fromCharCode((c & 63) | 128);
		}
		if (enc != null) {
			if (end > start) {
				utftext += string.substring(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.substring(start, string.length);
	}

	return utftext;
}

function utf8_decode(str_data) {
	var tmp_arr = [],
			i = 0,
			ac = 0,
			c1 = 0,
			c2 = 0,
			c3 = 0;

	str_data += '';

	while (i < str_data.length) {
		c1 = str_data.charCodeAt(i);
		if (c1 < 128) {
			tmp_arr[ac++] = String.fromCharCode(c1);
			i++;
		} else if (c1 > 191 && c1 < 224) {
			c2 = str_data.charCodeAt(i + 1);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = str_data.charCodeAt(i + 1);
			c3 = str_data.charCodeAt(i + 2);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}

	return tmp_arr.join('');
}

function base64_encode(data) {

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = ac = 0, enc = "", tmp_arr = [];
	data = utf8_encode(data);

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	switch (data.length % 3) {
		case 1:
			enc = enc.slice(0, -2) + '==';
			break;
		case 2:
			enc = enc.slice(0, -1) + '=';
			break;
	}

	return enc;
}

function base64_decode(data) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			dec = "",
			tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);

	dec = tmp_arr.join('');
	dec = this.utf8_decode(dec);

	return dec;
}

function is_int(value) {
	if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
}


function log(text) {
	console.log(text);
}

function loading(action) {
	if (action) {
		$('#loading').fadeIn(500);
	} else {
		$('#loading').fadeOut(500);
	}
}

function isNumeric(obj) {
	if (!obj.value)
		return;
	obj.value = obj.value.replace(/(?!^-)[^0-9.]/g, "").replace(/,/g, '.');
	return true;
}

function isIntInput(obj) {
	if (!obj.value)
		return;
	obj.value = obj.value.replace(/[^0-9]/g, "");
	return true;
}

function isLatinNumbersSpaces(obj) {
	if (!obj.value) {
		return;
	}
	obj.value = obj.value.replace(/[^A-Za-z0-9 ]/g, "");
	return true;
}

function filterIbanField(obj) {
	//слагам таймаут защото ако се вика с onpaste евент не може да вземе велюто веднага
	setTimeout(function () {
		var sText = obj.value;
		//var newVal = sText.replace(/[^0-9A-Z\.]/gi,"");
		var newVal = sText.replace(/ /g, "");
		if (sText != newVal) {
			obj.value = newVal;
			return false;
		}
		return true;
	}, 50);
}

function isEmail(obj) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (reg.test(obj.value) == false) {
		obj.value = '';
		return false;
	}
}

function isMinute(obj) {
	var sText = obj.value * 1;
	if (sText > 59) {
		obj.value = 59;
	}
	if (sText < 0) {
		obj.value = 0;
	}
	return false;
}

function isHour(obj) {
	var sText = obj.value * 1;
	if (sText > 23) {
		obj.value = 23;
	}
	if (sText < 0) {
		obj.value = 0;
	}
	return false;
}

function ltrim(str) {
	if (!str) {
		return str;
	}
	for (var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++)
		return str.substring(k, str.length);
}
function rtrim(str) {
	if (!str) {
		return str;
	}
	for (var j = str.length - 1; j >= 0 && isWhitespace(str.charAt(j)); j--)
		return str.substring(0, j + 1);
}
function trim(str) {
	return ltrim(rtrim(str));
}
function isWhitespace(charToCheck) {
	var whitespaceChars = " \t\n\r\f";
	return (whitespaceChars.indexOf(charToCheck) != -1);
}

function isLetters(obj) {
	var sText = obj.value;
	var newVal = sText.replace(/[0-9\@\&\^\%\$\#\*(\)\_\-\+\{\}\?\>\<\!\~\|\=]/gi, "");
	if (sText != newVal) {
		obj.value = newVal;
		return false;
	}
	return true;
}

function isLatinLetters(obj) {
	var sText = obj.value;
	//obj.value = sText.replace(/[^a-zA-Z]/g, '');
	var newVal = sText.replace(/[^a-zA-Z]/g, '');
	if (sText != newVal) {
		obj.value = newVal;
		return false;
	}
	return true;
}

function isCyrilic(obj) {
	var letters = new Array('-', ' ', ',', '.', '"', 'а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ь', 'ю', 'я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ь', 'Ю', 'Я', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
	var sText = obj.value;
	var newVal = '';
	for (i = 0; i < sText.length; i++) {
		if (in_array(sText[i], letters)) {
			newVal += sText[i];
		}
	}
	if (sText != newVal) {
		obj.value = newVal;
		return false;
	}
	return true;
}

function isPhone(obj) {
	var sText = obj.value;
	var newVal = sText.replace(/[^0-9\+]/gi, "");
	if (newVal.length > 1) {
		newVal = newVal.substr(0, 1) + newVal.substr(1, newVal.length - 1).replace(/[\+]/, "");
	}

	var firstSimbol = newVal.charAt(0);
	if (firstSimbol != '+') {
		newVal = '+' + newVal;
	}

	if (sText != newVal) {
		obj.value = newVal;
		return false;
	}
    
    if (newVal.length <= 1) {
        return false;
    }

	return true;
}

/*
 function scrollTo(obj) {
 if(typeof(obj.offset()) == 'undefined'){
 return;
 }
 
 var top = obj.offset().top;
 $('html,body').animate({scrollTop: top}, 1000);
 }
 */

function getWeekNumber(d) {
	d = new Date(d);
	d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	var yearStart = new Date(d.getFullYear(), 0, 1);
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function uniqid() {
	var retId = '';
	var formatSeed = function (seed, reqWidth) {
		seed = parseInt(seed, 10).toString(16); // to hex str
		if (reqWidth < seed.length) { // so long we split
			return seed.slice(seed.length - reqWidth);
		}
		if (reqWidth > seed.length) { // so short we pad
			return Array(1 + (reqWidth - seed.length)).join('0') + seed;
		}
		return seed;
	};
	if (!this.php_js) {
		this.php_js = {};
	}
	if (!this.php_js.uniqidSeed) {
		this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
	}
	this.php_js.uniqidSeed++;
	retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
	retId += formatSeed(this.php_js.uniqidSeed, 5);
	return retId;
}

function transform2Up(obj) {
	obj.value = obj.value.toUpperCase();
}

function in_array(needle, haystack, argStrict) {
	var key = '',
			strict = !!argStrict;
	if (strict) {
		for (key in haystack) {
			if (haystack[key] === needle) {
				return true;
			}
		}
	} else {
		for (key in haystack) {
			if (haystack[key] == needle) {
				return true;
			}
		}
	}
	return false;
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}
//

function toggleInfo() {
	if (!$("#infoDropDown").is(":hidden")) {
		$("#infoArrow").removeClass('up_icon');
		$("#infoArrow").addClass('down_icon');
	} else {
		$("#infoArrow").removeClass('down_icon');
		$("#infoArrow").addClass('up_icon');
	}
	$("#infoDropDown").toggle()
}

/* accounts box */
function accBoxToggleHiddenRows() {
	/* ako sa pokazani */
	if ($('.accBox li.hidden:visible').length > 0) {
		$('.accBox li.hidden').slideUp();

		$('.accBox .linkHide').hide();
		$('.accBox .linkShow').show();
	} else {
		$('.accBox .hidden').slideDown();

		$('.accBox .linkShow').hide();
		$('.accBox .linkHide').show();

	}
}

/**
 * Валидира emboss име
 * @param str името, което ще се валидира
 * @param maxLength максимална дължина
 * @returns {Boolean}
 */
function validEmbossName(str, maxLength) {
	maxLength = maxLength || 25;
	var r = new RegExp(/^[a-zA-Z \.,-`]*$/); // разрешени малки букви, за да не се налага да се пише с caps
	var d = new RegExp(/[0-9]+/);
	return r.test(str) && !d.test(str) && str.length <= maxLength;
}

function number_format(number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + Math.round(n * k) / k;
			};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

function nf($num) {
	return number_format($num.toString().replace(',', '.'), 2, '.', ' ');
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}


function nf2num(str) {
	var newStr = '';
	var l = str.length;
	for (i = 0; i < str.length; i++) {
		if (isNumber(str[i]) || str[i] == '.') {
			newStr += '' + str[i];
		}
	}
	return parseFloat(newStr);
}


function htmlspecialchars(string, quote_style, charset, double_encode) {
	var optTemp = 0,
			i = 0,
			noquotes = false;
	if (typeof quote_style === 'undefined' || quote_style === null) {
		quote_style = 2;
	}
	string = string.toString();
	if (double_encode !== false) { // Put this first to avoid double-encoding
		string = string.replace(/&/g, '&amp;');
	}
	string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

	var OPTS = {
		'ENT_NOQUOTES': 0,
		'ENT_HTML_QUOTE_SINGLE': 1,
		'ENT_HTML_QUOTE_DOUBLE': 2,
		'ENT_COMPAT': 2,
		'ENT_QUOTES': 3,
		'ENT_IGNORE': 4
	};
	if (quote_style === 0) {
		noquotes = true;
	}
	if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
		quote_style = [].concat(quote_style);
		for (i = 0; i < quote_style.length; i++) {
			// Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
			if (OPTS[quote_style[i]] === 0) {
				noquotes = true;
			}
			else if (OPTS[quote_style[i]]) {
				optTemp = optTemp | OPTS[quote_style[i]];
			}
		}
		quote_style = optTemp;
	}
	if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
		string = string.replace(/'/g, '&#039;');
	}
	if (!noquotes) {
		string = string.replace(/"/g, '&quot;');
	}

	return string;
}

function htmlspecialchars_decode(string, quote_style) {
	var optTemp = 0,
			i = 0,
			noquotes = false;
	if (typeof quote_style === 'undefined') {
		quote_style = 2;
	}
	string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	var OPTS = {
		'ENT_NOQUOTES': 0,
		'ENT_HTML_QUOTE_SINGLE': 1,
		'ENT_HTML_QUOTE_DOUBLE': 2,
		'ENT_COMPAT': 2,
		'ENT_QUOTES': 3,
		'ENT_IGNORE': 4
	};
	if (quote_style === 0) {
		noquotes = true;
	}
	if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
		quote_style = [].concat(quote_style);
		for (i = 0; i < quote_style.length; i++) {
			// Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
			if (OPTS[quote_style[i]] === 0) {
				noquotes = true;
			} else if (OPTS[quote_style[i]]) {
				optTemp = optTemp | OPTS[quote_style[i]];
			}
		}
		quote_style = optTemp;
	}
	if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
		string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
		// string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
	}
	if (!noquotes) {
		string = string.replace(/&quot;/g, '"');
	}
	// Put this in last place to avoid escape being double-decoded
	string = string.replace(/&amp;/g, '&');

	return string;
}



function esc(str) {
	return htmlspecialchars(str, 3);
}

function unesc(str) {
	if (str + '' == '') {
		return false;
	}
	str = htmlspecialchars_decode(str, 3);
	return htmlspecialchars_decode(str, 3).replace("&apos;", "'");
}

/**
 * obj - jquery object
 */
function preventSelection(obj) {
	obj
			.attr('unselectable', 'on')
			.css('UserSelect', 'none')
			.css('MozUserSelect', 'none');
}

function str_pad(input, pad_length, pad_string, pad_type) {
	//  discuss at: http://phpjs.org/functions/str_pad/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Michael White (http://getsprink.com)
	//    input by: Marco van Oort
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
	//   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
	//   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
	//   returns 2: '------Kevin van Zonneveld-----'

	var half = '',
			pad_to_go;

	var str_pad_repeater = function (s, len) {
		var collect = '',
				i;

		while (collect.length < len) {
			collect += s;
		}
		collect = collect.substr(0, len);

		return collect;
	};

	input += '';
	pad_string = pad_string !== undefined ? pad_string : ' ';

	if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
		pad_type = 'STR_PAD_RIGHT';
	}
	if ((pad_to_go = pad_length - input.length) > 0) {
		if (pad_type === 'STR_PAD_LEFT') {
			input = str_pad_repeater(pad_string, pad_to_go) + input;
		} else if (pad_type === 'STR_PAD_RIGHT') {
			input = input + str_pad_repeater(pad_string, pad_to_go);
		} else if (pad_type === 'STR_PAD_BOTH') {
			half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
			input = half + input + half;
			input = input.substr(0, pad_length);
		}
	}

	return input;
}

var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};


function submitFormOnEnter() {
	var forms = $('form');
	if (forms.length === 0) {
		return;
	}
	forms.find('input')
			.data('preventSubmit', false)
			.keydown(function (e) {

				if ($(this).parents('form').hasClass('disableSubmitFormOnEnterJs')) {
					return;
				}

				var key = (e.keyCode ? e.keyCode : e.which);
				switch (key) {
					case 13:
						if (!$(this).data('preventSubmit') && $(this).is('input')) {
							$(this).parents('form').submit();
							e.preventDefault();
						}
						$(this).data('preventSubmit', false);
						break;
					case 40:
					case 38:
					case 34:
					case 33:
						$(this).data('preventSubmit', true);
						break;
					default:
						$(this).data('preventSubmit', false);
						break;
				}
			});
}

function SMSBox() {
	if ($('.jsSMSBox').length === 0) {
		return false;
	}

	$('.jsSMSBox').each(function () {
		var box = $(this);

		var counter = box.find('.seconds');
		var smsSent = box.find('.smsSent');
		var newSmsWait = box.find('.newSmsWait');
		var newSms = box.find('.newSms');
		var smsNotSent = box.find('.smsNotSent');
		var smsSending = box.find('.smsSending');

		newSmsWait.show();

		var resendLink = newSms.find('a');

		smsSent.hide();
		newSmsWait.show();
		newSms.hide();
		waitCounter(counter.html());

		resendLink.click(function () {
			var url = $(this).attr('href');

			smsSending.show();

			newSms.hide();
			smsNotSent.hide();
			newSmsWait.hide();
			smsSent.hide();

			$.post(url, function (ret) {
				smsSending.hide();

				if (ret.status) {
					smsSent.show();
					newSmsWait.show();

					counter.html(ret.seconds);
					waitCounter(ret.seconds);
				} else {
					smsNotSent.show();
					newSms.show();
				}
			}, 'json');
		});

		function waitCounter(secs) {
			if (secs > 0) {
				setTimeout(function () {
					counter.html(secs);
					secs--;
					waitCounter(secs);
				}, 1000);
			} else {
				newSmsWait.hide();
				newSms.show();
				smsSent.hide();
			}
		}

	});

}

function billingDescriptorField() {
	var inputs = $('.jsBillingDescriptor');
	if (inputs.length === 0) {
		return false;
	}

	inputs.css({"text-transform": "uppercase"});
	inputs.bind("blur change keyup", function () {
		if ($(this).val().indexOf('MYPOS  *') != 0) {
			$(this).val('MYPOS  *');
		}
		$(this).val($(this).val().toUpperCase().replace(/[^A-Z0-9\* \.,-]/g, ""));
	});
}


function posFieldsPrepare() {
	return false;
	var fields = $('.jsPOSFieldPrepare');
	if (fields.length === 0) {
		return false;
	}

	fields.bind('keyup blur', function () {
		$(this).val($(this).val().replace("\\", "/"));
	});
}

function toggle_rates_rows() {
	$('table.exchange_rates_new').find('tr').slice(11).toggle();
}

function ucfirst(str) {
	//  discuss at: http://phpjs.org/functions/ucfirst/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	// improved by: Brett Zamir (http://brett-zamir.me)
	//   example 1: ucfirst('kevin van zonneveld');
	//   returns 1: 'Kevin van zonneveld'

	str += '';
	var f = str.charAt(0)
			.toUpperCase();
	return f + str.substr(1);
}

function ord(string) {
	//  discuss at: http://phpjs.org/functions/ord/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	// improved by: Brett Zamir (http://brett-zamir.me)
	//    input by: incidence
	//   example 1: ord('K');
	//   returns 1: 75
	//   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
	//   returns 2: 65536

	var str = string + '',
			code = str.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
		var hi = code;
		if (str.length === 1) {
			return code; // This is just a high surrogate with no following low surrogate, so we return its value;
			// we could also throw an error as it is not a complete character, but someone may want to know
		}
		var low = str.charCodeAt(1);
		return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	}
	if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
		return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
		// we could also throw an error as it is not a complete character, but someone may want to know
	}
	return code;
}

function isEven(n) {
	return isNumber(n) && (n % 2 == 0);
}

function isOdd(n) {
	return isNumber(n) && (Math.abs(n) % 2 == 1);
}


function toggleOtpMethod(otpMethod) {
	var avlTypes = {
		'000': 'NONE',
		'001': 'SMS',
		'002': 'GK'
	}
	otpMethod = !avlTypes[otpMethod] ? avlTypes['001'] : avlTypes[otpMethod];
	$('.jsOTPMethod').hide().filter('.jsOTPMethod' + otpMethod).show();
}

/*
 * Валидира позволените символи за детайли на къмпани/аутлет
 */
function isValidCompanyField(obj) {
	var sText = obj.value;
	var newVal = '';
	for (var i = 0; i < sText.length; i++) {
		if (ord(sText.charAt(i)) >= 32 && ord(sText.charAt(i)) <= 126) {
			newVal += sText.charAt(i);
		}
	}
	obj.value = newVal;
	return true;
}