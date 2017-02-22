$(function () {
	colorFormFields();
	inputHiddenText();
	if ( $.isFunction($.fn.datepicker) ) {
		showdatePicker();
	}

	submitFormOnEnter();

	$('a.loading').bind('click', function () {
		showPreloader();
	});
	iserverCounter();
	trTypesToggle();
	SMSBox();
	preventDoubleSubmit();
	billingDescriptorField();
	posFieldsPrepare();
	searchSelect('.jsSearchSelect');
	formatAmountFields();

	if( $.isFunction( $.fn.tooltip ) ) {
		$('[data-toggle="tooltip"]').tooltip();
	}

	if ($('.custom-section-map').length) {
		var $maps = $('.custom-section-map');
		var disableClass = 'custom-section-map-disabled';

		$maps.addClass(disableClass);
		$('.custom-section-map').on('click mouseleave', function(e) {
			if (e.type === 'click') {
				$(this).removeClass(disableClass);
			} else if (e.type === 'mouseleave') {
				$(this).addClass(disableClass);
			};
		});
	};

	if ($('.service-box').length) {
		var $allBoxes = $('.service-box');
		var focusState = 'service-box-focus';
		$(document).on('click', function(e) {
			var $currentBox = $(e.target).parents('.service-box-active');
			
			$allBoxes.removeClass(focusState);
			if ($currentBox.length) {
				$currentBox.addClass(focusState);
			} else {
				$currentBox.removeClass(focusState);
			};
		});
	};

	if ($('.service-box-image').length) {
		$(window).on('load resize', function() {
			fnDoResizeImage($('.service-box-image img'));
		});
	};
});

//На база на ratio-то на контейнера, разпъва снимката по височина или по ширина, центрира я и изрязва излишната част. За въпроси по функцията(трябва и css) Васил Стоилов :)
var fnDoResizeImage = function($element) {
	$element.each(function() {
		var $elementParent = $(this).parent();
		var elementRatio = $(this).width() / $(this).height();
		var elementParentRatio = $elementParent.width() / $elementParent.height();
		if (elementParentRatio < elementRatio) {
			$(this).removeClass('change-width').addClass('change-height');
		} else {
			$(this).removeClass('change-height').addClass('change-width');
		};
	});
};

//ползва се за криене или показване на <option> в селект и работи на IE: $('option selector').optVisible(true/false)
$.fn.optVisible = function (show) {
	if (show) {
		this.filter("span > option").unwrap();
	} else {
		this.filter(":not(span > option)").wrap("<span>").parent().hide();
	}
	return this;
}



function showPreloader() {
	$('.preloader').show();
}

function hidePreloader() {
	$('.preloader').hide();
}

function preventDoubleSubmit() {
	var forms = $('.preventDoubleSubmit');
	if (forms.length === 0) {
		return false;
	}

	forms.submit(function (e) {
		var $form = $(this);

		if ($form.data('submitted') === true) {
			e.preventDefault();
		} else {
			$form.data('submitted', true);
		}
	});
}

var disablePreloader = false;
$(document).ajaxComplete(function (event, XMLHttpRequest) {
	disablePreloader = false;
	if (XMLHttpRequest.responseText == 'Session expired' || XMLHttpRequest.responseText == '666') {
		window.location.href = U + 'login/err_key:session_expired';
	} else {

		if (XMLHttpRequest.responseText == '87') {  // If the user doesn`t have permission to this resource
			$('#errorPermissionPopup').modal();
			event.stopPropagation();
			event.preventDefault();
		}
	}
	hidePreloader();
	return false;
});

$(document).ajaxSend(function () {
	if (!disablePreloader) {
		showPreloader();
	}
	return false;
});

function colorFormFields() {
	if (typeof errorFields != 'undefined') {
		for (var i in errorFields) {
			if (typeof (errorFields[i]) != 'undefined' && errorFields[i] != '') {
				$('body ' + errorFormScope + '').find('[name="' + errorFields[i] + '"]:visible').addClass('alerted');
			}
		}
	}
}

function toggleTtransactionDetails() {
	var tdList = $('.toggleTtransactionDetails');
	var table = tdList.parents('table');

	if (tdList.length === 0) {
		return false;
	}
	var d = 'display_none';

	tdList.click(function () {
		var nextTr = $(this).parents('tr').next('tr');

		//Ако сме цъкнали на затворен елемент
		if (nextTr.hasClass('display_none')) {
			var opened = table.find('tr.row_details').not('.' + d);

			opened.addClass(d);
			nextTr.removeClass(d);

			$(this).find('.view').toggle();
			$(this).find('.hide').toggle();

			opened.prev().find('.view').toggle();
			opened.prev().find('.hide').toggle();

		} else {
			nextTr.addClass(d);

			$(this).find('.view').toggle();
			$(this).find('.hide').toggle();
		}
	});
}


function jsLang(section, key) {
	var res;
	var url = U + 'jsLang';
	var post = {
		section: section,
		tag: key
	}

	$.ajax({
		type: "POST",
		url: url,
		data: post,
		dataType: "text",
		async: false,
		success: function (result) {
			res = result;
		}
	});
	return res;
}


// за скриващия се текст вътре в полетата за юзер и парола в хедъра
function inputHiddenText() {
	$(".exampleText").focus(function (srcc)
	{
		if ($(this).val() == $(this)[0].title)
		{
			$(this).removeClass("exampleTextActive");
			$(this).val("");
		}
	});

	$(".exampleText").blur(function ()
	{
		if ($(this).val() == "")
		{
			$(this).addClass("exampleTextActive");
			$(this).val($(this)[0].title);
		}
	});

	$(".exampleText").blur();
}

function showdatePicker(options) {
	if (typeof (options) === 'undefined') {
		var options = {
			dateFormat: 'dd.mm.yy',
			selectWeek: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			changeMonth: true,
			changeYear: true,
			firstDay: 1
		};
	}

	var inputs = $('.date');
	if (inputs.length === 0) {
		return false;
	}

	inputs.datepicker('destroy');
	inputs.attr('readOnly', true);
	inputs.datepicker(options);

	inputs.each(function () {
		if ($(this).data('date_from')) {
			var d = $(this).data('date_from').split('.');
			$(this).datepicker("option", "minDate", new Date(parseInt(d[2], 10), parseInt(d[1], 10) - 1, parseInt(d[0], 10)));
		}
		if ($(this).data('date_to')) {
			var d = $(this).data('date_to').split('.');
			$(this).datepicker("option", "maxDate", new Date(parseInt(d[2], 10), parseInt(d[1], 10) - 1, parseInt(d[0], 10)));
		}
	});

	var date_from_field = $('.date_from');

	if (date_from_field.length > 0) {
		date_from_field.each(function () {
			var df_field = $(this);
			var t = df_field.prop('title');
			var date_to_field = $('.date_to[title=' + t + ']');
			if (date_to_field.length > 0) {
				correctDateTo(df_field, date_to_field);
				df_field.change(function () {
					correctDateTo(df_field, date_to_field);
				});
			}
		});
	}

	function correctDateTo(df_field, date_to_field) {
		var date = df_field.datepicker('getDate');
		var date_from = df_field.datepicker("getDate");
		if (date_from == null) {
			return false;
		}
		date_from.setDate(date_from.getDate());
		date_to_field.datepicker("option", "minDate", date_from);
	}
}


function blockUnblock(id, action, url) {

	var post = {
		card_id: id,
		action: action
	};

	$.post(url, post, function (res) {
		if (res == 'ok') {
			window.location.href = window.location.href;
			return false;
		} else {
			if (res == 'Session expired') {
				window.location.href = U + 'login/err_key:session_expired';
			} else {
				alert(res);
			}
		}
	});
}

function changePerm(mode, status) {
	$.post($.baseUrl + 'overview/changePerm', {mode: mode, status: status}, function (data) {

		if (data) {
			document.location = $.baseUrl + 'overview/status:updated';
		} else if (data == 'error') {
			document.location = $.baseUrl + 'overview/status:error';
		} else {
			document.location = $.baseUrl + 'overview/';
		}
	});
}

function showHide(obj) {
	$(obj).parents('td').find('a.show-hide').toggle();
	$(obj).parents('tr').next('tr').toggle();
	$(obj).parents('tr').toggleClass('border_b');
	$(obj).parents('tr').next('tr').toggleClass('border_b');
}

function changeLanguage(lang, url) {
	showPreloader();
	$.post($.baseUrl + 'changeLanguage', {lang: lang}, function (data) {
		document.location.href = url;
	});
}

function iserverCounter() {
	var timer = $('#iserverTimer');
	if (timer.length === 0) {
		return false;
	}
	var url = U + 'getLastRequestTime';

	var h, m, s, init_text, expired_text;

	$.post(url, {getTime: 'lastIserverRequest'}, function (ret) {
		h = ret.h;
		m = ret.m;
		s = ret.s;
		init_text = ret.init_text;
		expired_text = ret.expired_text;
		counter();
	}, 'json');

	setInterval(function () {
		requestCurrent();
	}, 25000);
	function requestCurrent() {
		disablePreloader = true;
		$.post(url, {getTime: 'lastIserverRequest'}, function (ret) {
			h = ret.h;
			m = ret.m;
			s = ret.s;
			init_text = ret.init_text;
		}, 'json');
	}
	function counter() {
		if (h == 0 && m == 0 && s == 0) {
			timer.html(expired_text);
			return false;
		}

		if (s <= 0) {
			s = 59;
			m -= 1;
		} else {
			s -= 1;
		}
		if (m < 0) {
			m = 59;
			h -= 1;
		}
		setTimeout(function () {
			counter();
		}, 1000);
		var hh = h > 9 ? h : '0' + h;
		var mm = m > 9 ? m : '0' + m;
		var ss = s > 9 ? s : '0' + s;
		if (h > 0) {
			var time = hh + ':' + mm + ':' + ss;
		} else if (m > 0) {
			var time = mm + ':' + ss;
		} else {
			var time = '00:' + ss;
		}

		//time = init_text + ': ' + time;
		timer.html(time);
	}
}


function hoursAndMins() {
	$('input.hh').keyup(function () {
		var v = $(this).val();
		if (v <= 0) {
			$(this).val('00');
		}
		if (v > 23) {
			$(this).val('23');
		}
	});

	$('input.mm').keyup(function () {
		var v = $(this).val();
		if (v < 0) {
			$(this).val('00');
		}
		if (v > 59) {
			$(this).val('59');
		}
	});
}

/**
 * Проверява дали стринг съдържа само разрешени символи
 */
function checkAllowed(string, cyr) {
	regc = cyr ? /[^а-яА-Яa-zA-Z0-9\/\-\?\(\)\.\+\s]+/ : /[^a-zA-Z0-9\/\-\?\(\)\.\+\s]+/;
	return !regc.test(string);
}


$(function () {
	accBox.init();
});
var accBox = {
	'init': function () {
		this.boxes = $('.accBox');
		if (this.boxes.length === 0) {
			return false;
		}

		this.visIndex = this.boxes.index(this.boxes.filter(':visible'));

		this.arrows = $('.accMove');
		this.arrLeft = this.arrows.filter('.arrow_left_ovrw');
		this.arrRight = this.arrows.filter('.arrow_right_ovrw');
		this.arrowsEvents();
	},
	'arrowsEvents': function () {
		if (this.boxes.length <= 1) {
			this.arrows.hide();
		}

		this.arrLeft.click(function (e) {
			e.preventDefault();
			if (accBox.visIndex < 1) {
				accBox.visIndex = accBox.boxes.length;
				//return false;
			}
			accBox.move('left');
		});

		this.arrRight.click(function (e) {
			e.preventDefault();
			if (accBox.visIndex >= accBox.boxes.length - 1) {
				accBox.visIndex = -1;
				//return false;
			}
			accBox.move('right');
		});
	},
	'move': function (direction) {
		switch (direction) {
			case 'left':
				this.visIndex--;
				break;
			case 'right':
				this.visIndex++;
				break;
		}

		//log(this.visIndex);
		this.boxes.hide();
		this.boxes.eq(this.visIndex).show();
	}
}


function loadRefundPopup(trnref) {
	var url = $.baseUrl + '/transactions/loadRefundPopup';
	$.post(url, {trnref: trnref}, function (ret) {
		$('body').append(ret);
		$('#refundForm').modal();
	}, 'html');
}


function makeRefund() {
	var form = $('#refundForm');
	if (form.length === 0) {
		return false;
	}
	form.find('.alerted').removeClass('alerted');

	var url = $.baseUrl + '/transactions/makeRefund';
	$.post(url, form.serialize(), function (ret) {
		switch (ret.status) {
			case true:
				$('#refundForm').hide().remove();
				window.location.href = window.location;
				break;
			case false:
				if (ret.fields.length > 0) {
					for (i in ret.fields) {
						form.find('[name=' + ret.fields[i] + ']').addClass('alerted');
					}
				}

				var err = $('#refundForm').find('.errorBox');
				err.find('p').html(ret.mess);
				err.show();
				break;
		}
	}, 'json');
}

function loadReversalPopup(trnref) {
	var url = $.baseUrl + '/transactions/loadReversalPopup';
	$.post(url, {trnref: trnref}, function (ret) {
		$('body').append(ret);
		$('#reversalForm').modal();
	}, 'html');
}

function makeReversal() {
	var form = $('#reversalForm');
	if (form.length === 0) {
		return false;
	}

	showPreloader();

	form.find('.alerted').removeClass('alerted');
	var url = $.baseUrl + '/transactions/makeReversal';
	$.post(url, form.serialize(), function (ret) {
		hidePreloader();
		switch (ret.status) {
			case true:
				$('#formContentReversal').hide();
				$('#successContentReversal').show();
				break;
			case false:
				if (typeof (ret.fields) != 'undefined') {
					for (i in ret.fields) {
						form.find('[name=' + ret.fields[i] + ']').addClass('alerted');
					}
				}
				var err = $('#reversalForm').find('.errorBox');
				err.find('p').html(ret.mess);
				err.show();
				break;
		}
	}, 'json');
}

function loadMPOSResendPopup(trnref, sendType, sendTo, source) {
	var popup = $('#mposPopup');
	var radios = popup.find('input.resendType');
	var inputs = popup.find('input.recipientField');
	popup.find('.errorBox').hide();

	inputs.val('');
	$('#mposPopupTrnRef').val(trnref);
	$('#pageSource').val(source);
	switch (sendType) {
		case '0':
			radios.filter('[value=sms]').prop('checked', 'checked');
			inputs.filter('[name=sms]').val(sendTo);
			break;

		case '1':
			radios.filter('[value=email]').prop('checked', 'checked');
			inputs.filter('[name=email]').val(sendTo);
			break;

		default:
			radios.filter('[value=email]').prop('checked', 'checked');
			break;
	}

	changeResendField();
	popup.modal();
	popup.find('#formContent').show();
	popup.find('#successContent').hide();
}

function mPOSResendReceipt() {
	var popup = $('#mposPopup');
	var data = popup.serialize();
	var url = $.baseUrl + 'transactions/mposResendReceipt';
	var err = popup.find('.errorBox');
	err.hide();
	$.post(url, data, function (ret) {
		switch (ret.status) {
			case true:
                var $mposPopup = $('#mposPopup');

                $mposPopup.find('#formContent').hide();

                var to = $mposPopup.find('.recipientField:not(.inactive)').val();

				$mposPopup.find('#successContent').find('p span').html(to);
				$mposPopup.find('#successContent').show();
				break;
			case false:

				err.find('p').html(ret.mess);
				err.show();
				break;
		}
	}, 'json');
}

function loadTopupResendPopup(trnref, sendTo, source, el) {
    var popup = $(el).closest('td').find('#topupPopup');
    var inputs = popup.find('input.recipientField');
	
    popup.find('.errorBox').hide();

	popup.find('#topupPopupTrnRef').val(trnref);
	popup.find('#pageSource').val(source);
	
    popup.modal();
    popup.find('#formContent').show();
    popup.find('#successContent').hide();
}

function topupResendReceipt(origin) {
    if (origin.attr('id') == 'topupPopup') {
        var popup = origin;
    } else {
        var popup = origin.closest('#topupPopup');
    }
	var data = popup.serialize();
	var url = $.baseUrl + 'transactions/topupResendReceipt';
	var err = popup.find('.errorBox');
	err.hide();
	$.post(url, data, function (ret) {
		switch (ret.status) {
			case true:
                popup.find('#formContent').hide();
                var to = popup.find('.recipientField:not(.inactive)').val();
                popup.find('#successContent').find('p span').html(to);
                popup.find('#successContent').show();
				break;
			case false:
				err.find('p').html(ret.mess);
				err.show();
				break;
		}
	}, 'json');
}

function toggleCheckoutLogos(size) {
	$('#coLogo').attr('src', '');
	$('#coLogo').attr('src', $.domain + 'img/account/checkout/' + size + '.png');
	var sizes = size.split('x');
	$('#htmlCode').val('<img width="' + sizes[0] + '" height="' + sizes[1] + '" src="' + $.domain + 'img/account/checkout/' + size + '.png' + '" />');
}

function sendSms() {

	$('.ul_fields .sms').hide();

	var url = U + '/activation_tag/resendSms';

	$.post(url, function (response) {

		if (response.status) {

			$('.ul_fields .sms.green').show();
		} else {

			$('.ul_fields .sms.wait span').text(response.secs);
			$('.ul_fields .sms.wait').show();
		}

	}, 'json');

	return false;
}

var checked_radio;
$(document).ready(function () {
	if ($('input[name="primary"]:checked').length != 0) {
		checked_radio = $('input[name="primary"]:checked');
	}

	//user rights
	$('.ur_disabled').each(function () {

		$(this).removeAttr('onclick');
		$(this).unbind('click');
	});

	$('a.ur_disabled').click(function (e) {
		e.preventDefault();
	});

	//new window for agreement
	$('.newWindow').click(function (event) {

		var windowWidth = 400;
		if ($(this).data('width')) {
			var windowWidth = parseInt($(this).data('width'));
		}

		var windowHeight = 800;
		if ($(this).data('height')) {
			var windowHeight = parseInt($(this).data('height'));
		}

		var windowLeft = parseInt(($(window).width() / 2) - (windowWidth / 2));
		var windowTop = parseInt(($(window).height() / 2) - (windowHeight / 2));

		var windowSize = "width=" + windowWidth + ",height=" + windowHeight + ",left=" + windowLeft + ",top=" + windowTop + ",screenX=" + windowLeft + ",screenY=" + windowTop + ",scrollbars=yes,resizable=yes";

		var url = $(this).attr("href");
		var windowName = "popUp";//$(this).attr("name");

		window.open(url, windowName, windowSize);

		event.preventDefault();
		return false;
	});
});

function showPermissionError(el, event) {
	if (typeof event !== 'undefined') {
		stopEvent(event);
	}

	if (typeof el !== 'undefined') {
		$(el).unbind('click');
	}

	if ($('input[name="primary"]:checked').length != 0) {
		$(checked_radio).prop('checked', true);
	}

	$('#errorPermissionPopup').modal();

	return false;
}

// ** END PopUp for user permission **

function stopEvent(e) {

	if (!e) {
		var e = window.event;
	}
	//e.cancelBubble is supported by IE -
	// this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = false;

	//e.stopPropagation works only in Firefox.
	if (e.stopPropagation) {
		e.stopPropagation();
	}
	if (e.preventDefault) {
		e.preventDefault();
	}


	return false;
}

function changeLocation(currentIso, newIso) {
	if (newIso != '' && newIso != currentIso) {
		window.location.href = window.location.href.replace($.domain, $.domain + newIso + '/');
	}
}


function trTypesToggle() {
	//$('.trTypes').slideToggle();
	var button = $('#trTypesToggle');

	if (button.length === 0) {
		return false;
	}

	var trTypes = $('.trTypes');
	var inputs = $('.trTypes ul input');
	var selectOpt = button.find('select option:first');
	var allCh = $('#deselect_all');

	button.bind('click', function () {
		if (trTypes.not(':visible')) {

            trTypes.show();
            var parentRow = $('.with_menu>.row');
            var parentRowHeight = trTypes.offset().top - parentRow.offset().top + trTypes.height() + 10;
            if (parentRow.height() < parentRowHeight) {
                parentRow.height(parentRowHeight);
            }

			var out = false;
			trTypes.parent().hover(function () {
				out = false;
			}, function () {
				out = true;
			});
			$(document).unbind('click');
			$(document).bind('click', function () {
				if (out) {
					trTypes.hide();
                    $('.with_menu>.row').height("auto");
				}
			});

		} else {
			$(document).unbind('click');
		}
	});

	inputs.change(function () {
		calcChecked();
	});

	allCh.change(function () {
		if ($(this).is(':checked')) {
			inputs.attr('checked', $(this).attr('checked'));
		} else {
			inputs.removeAttr('checked');
		}
		calcChecked();
	});

	function calcChecked() {
		var e = selectOpt.html().split(' ');
		selectOpt.html(inputs.filter(':checked').length + ' ' + e[1]);
	}
}

function resendSms(method) {
	$('.newSmsWait').hide();
	$('.smsSent').hide();
	var data = {};
	data.phone_code = $('input[name=user_phone_code]').val();
	data.phone = $('input[name=user_phone]').val();
	var url = U + '' + method + '/resendSms';
	$.post(url, data, function (ret) {
		switch (ret.status) {
			case true:
				//$('.newSmsWait').show();
				$('.smsSent').show();
				// countDownRenew();
				break;
			case false:
				$('.newSmsWait').show();
				$('.seconds').html(ret.secs)

				return false;
				break;
		}
	}, 'json');
}

function hideNINByCountry(countryObj, NinObj) {
	if (countryObj.val() == 'deu') {
		NinObj.hide();
	} else {
		NinObj.show();
	}
}


/**
 * Използва се, когато има select с държави и поле за телефон.
 * Слага се в onchange на select-а.
 * @param ob select-а
 * @param codes масив с кодове от тип arr[iso] = nnn
 * @param target полето, чието съдържание ще се замени с кода на държавата.
 */
function countryCodeChange(ob, codes, target) {
	var o = $(ob);
	target.val('+' + codes[o.val()])
}

function loadTariffPopup(tariffCode, limitCode) {
	var url = $.domain + $.language + '/account/popupTariff';
	var data = {
		tariff_code: tariffCode,
		limit_code: limitCode
	};

	$.post(url, data, function (html) {
		$('body').append(html);
		$('#jsTariffPopupContent').modal();
	});
}

function showError(error, cont, isSuccess) {
	isSuccess = isSuccess || 0;
	if (!error) {
		return;
	}
	cont = !cont ? $('body') : cont;
	cont.find('#comp_error #err_text').html(error);
	cont.find('#comp_error').show();

	if (isSuccess) {
		cont.find('#comp_error').removeClass('info_error').addClass('info_success');
	} else {
		cont.find('#comp_error').removeClass('info_success').addClass('info_error');
	}
}


function hideError(cont) {
	cont = !cont ? $('body') : cont;
	cont.find('#comp_error .errorMessages').html('');
	cont.find('#comp_error').hide();
}

function searchSelect(selector) {
	var selects = $(selector);
	if (selects.length === 0) {
		return false;
	}

	var options = {
		disable_search_threshold: 10,
		disable_search_in_optgroup: true
	}

	selects.each(function () {
		$(this).on('chosen:ready', function () {
			if (in_array($(this).attr('name'), errorFields)) {
				$(this).parent().find('a.chosen-single').addClass('alerted');
			}
		})
				.chosen(options);
	});
}

/**
 *
 * @param field
 * @param type
 */
function togglePasswordField(field, type) {
	var clone = $(field[0].outerHTML);
	var new_type = type ? type : (field.attr('type') == 'password' ? 'text' : 'password')

	clone.attr('type', new_type)
			.attr('value', field.attr('value'));

	field.after(clone).remove();
}

function formatAmountFields() {
	if ($('.jsAmount').length === 0) {
		return;
	}
	$('.jsAmount').keypress(function (e) {
		var key_codes = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
		if (!($.inArray(e.which, key_codes) >= 0)) {
			e.preventDefault();
		}
	});
}

function updateAddAccName(select) {
	var option = $(select).find('option:selected'),
			val = option.val(),
			currency = val.length > 1 ? option.html() + ' ' : '',
			field = $('#currName');
	if(currency){
		field.val(currency + field.data('default'));
	}else{
		field.val('');
	}
	
}


function showHideNewAccFields(select) {
	var option = $(select).find('option:selected'),
			val = option.val(),
			newAccFields = $('.jsUseNewAccFields')
			;
	if (val == -1) {
		newAccFields.show();
	} else {
		newAccFields.hide();
	}
}

//function for spinner input 
// example use $("input[name='demo1']").Spinner({ step: 5, max: 10, min: 0 });
(function ($) {

	$.fn.Spinner = function (options) {

		var defaults = {
			min: 0,
			max: 100,
			step: 1,
			startDelay: 450,
			delay: 50
		};

		var self = this;
		var up = $(this).parent('.spinner').find('.btn:first-of-type');
		var down = $(this).parent('.spinner').find('.btn:last-of-type');


		// Merge defaults and options, without modifying defaults
		var settings = $.extend({}, defaults, options);

		var min = parseInt(settings.min, 10);
		var max = parseInt(settings.max, 10);
		var step = parseInt(settings.step, 10);
		var value = parseInt(self.val(), 10);

		var start = true;
		var timeoutID;
		var delay = parseInt(settings.delay, 10);
		var startDelay = parseInt(settings.startDelay, 10);

		function init() {

			value = parseInt(($.isNumeric(self.val())) ? self.val() : 0, 10);

			if (value < min) {
				self.val(min);
			}

			if (value > max) {
				self.val(max);
			}
		}

		function increase() {

			if (value + step > max) {
				return
			}

			self.val(parseInt(self.val(), 10) + step);
			value = parseInt(self.val(), 10);

			self.change();

			startTimer(increase);
		}

		function decrease() {

			if (value - step < min) {
				return
			}

			self.val(parseInt(self.val(), 10) - step);
			value = parseInt(self.val(), 10);

			self.change();

			startTimer(decrease);
		}

		function clearTimer() {
			window.clearTimeout(timeoutID);
			start = true;
		}

		function startTimer(callback) {

			var currentDelay = (start) ? startDelay : delay;
			timeoutID = window.setTimeout(callback, currentDelay);
			start = false;
		}

		$(up).mouseup(clearTimer);
		$(up).mousedown(increase);

		$(down).mouseup(clearTimer);
		$(down).mousedown(decrease);

		$(self).change(function () {

			init();
		});

		init();

	};

})(jQuery);


function autoSelectSingleOptionSelect(selectsNames) {
	var allSelects = $('select');
	if (typeof (selectsNames) == 'undefined' || selectsNames == [] || selectsNames == '') {

	} else {

	}
}