'user strict'
require('./index.css');
require('page/common/nav/index.js');
var navSide = require('page/common/nav-side/index.js');
var _ct = require('util/cybertrade.js');
var _user = require('service/user-service.js');
var page = {
	init : function(){
		navSide.init({
			name : 'pass-update'
		});
		this.bindEvent();
	},

	bindEvent : function(){
		var _this = this;
		$('#submit').click(function(){
			_this.updatePass();
		});
	},

	updatePass : function(){
		var passwordOld = $.trim($('#password').val());
		var passwordNew = $.trim($('#passwordNew').val());
		var passwordConfirm = $.trim($('#passwordConfirm').val());
		var validateResult = this.dataValidate(passwordOld,passwordNew,passwordConfirm);

		if(validateResult.status){
			_user.updatePassword(
				{
					passwordOld : passwordOld,
					passwordNew : passwordNew
				},
				function(res,msg){
					_ct.successTips(msg);
					_ct.goHome();
				},
				function(errMsg){
					_ct.errorTips(errMsg);
				}
			);
		}
		else{
			_ct.errorTips(validateResult.msg);
		}
	},

	dataValidate : function(passwordOld,passwordNew,passwordConfirm){
		var result = {
			status : false,
			msg : '' 
		};
		if(!_ct.validate(passwordOld, 'nonempty') || passwordOld.length < 6){
			result.msg = '原密码位数不能小于6位';
			return result;
		}

		if(!_ct.validate(passwordNew, 'nonempty') || passwordNew.length < 6){
			result.msg = '新密码位数不能小于6位';
			return result;
		}

		if(passwordNew === passwordOld){
			result.msg = '新旧密码不可相同';
			return result;
		}

		if(passwordNew != passwordConfirm){
			result.msg = '两次输入的密码不一致';
			return result;
		}

		result.status = true;
		result.msg = '验证通过';
		return result;
	},


};

$(function(){
	page.init();
});