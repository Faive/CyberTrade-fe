'user strict'
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _ct = require('util/cybertrade.js');
var _user = require('service/user-service.js');
var templateIndex  = require('./userInformation.string');
var formError = {
	show : function(errMsg){
			$('.error-item').show().find('.err-msg').text(errMsg);
		},
	hide : function(){
			$('.error-item').hide().find('.err-msg').text('');
		}
};
var page = {
	init : function(){
		navSide.init({
			name : 'user-center'
		});
		this.loadUserInfo();
		this.bindEvent();
	},

	bindEvent : function(){
		var _this = this;
		$(document).on('click','.user-info .btn-submit',function(){
			var userInfo = {
				phone : $.trim($('#phone').val()),
				email : $.trim($('#email').val()),
				question : $.trim($('#question').val()),
				answer : $.trim($('#answer').val())
			},
			validateResult = _this.validateInfo(userInfo);
			if(validateResult.success){
				_user.updateUserInfo(userInfo,
					function(res,msg){
						_ct.successTips(msg);
						window.location.href = './user-center.html';
					},
					function(errMsg){
						_ct.errorTips(errMsg);
					}
				);

			}
			else{
				_ct.errorTips(validateResult.msg);
			}
		});
		

	},

	loadUserInfo : function(){
		var userHtml = '';
		_user.getUserInfo(function(res){
			userHtml = _ct.renderHtml(templateIndex,res);
			$('.panel-body').html(userHtml);
		},
		function(errMsg){
			_ct.errorTips(errMsg);
		});
	},
	validateInfo : function(info){
		var result = {
			success : false,
			msg :''
		};

		if(!_ct.validate(info.phone,'phone')){
			result.msg = '电话号码不符合格式！';
			return result;
		}

		if(!_ct.validate(info.email,'email')){
			result.msg = '邮箱不符合格式！';
			return result;
		}

		if(!_ct.validate(info.question,'nonempty') || !_ct.validate(info.answer,'nonempty')){
			result.msg = '问题和密码都不能为空！';
			return result;
		}


		result.success = true;
		result.msg = '验证通过';
		return result;
	}

};

$(function(){
	page.init();
});