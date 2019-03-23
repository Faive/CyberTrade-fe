'user strict'
require('./index.css');
require('page/common/nav-simple/index.js');
var _ct = require('util/cybertrade.js');
var _user = require('service/user-service.js');
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
		this.bindEvent();
	},

	bindEvent : function(){
		var _this = this;
		//点击登录按钮则提交
		$('#submit').click(function(){
			_this.submit();	
		});

		//按下回车也提交
		$('.user-content').keyup(function(e){
			if(e.keyCode === 13){
				_this.submit();
			}
		});
	},

	//表单提交
	submit : function(){
		var formData = {
			username : $.trim($('#username').val()),
			password : $.trim($('#password').val())
		},
			//表单验证结果
			validateResult = this.formValidate(formData);
		if(validateResult.status){
			var _this = this;
			//登录
			_user.login(formData, 
				function(res){
					window.location.href = _ct.getUrlParam('redirect') || './index.html';				
				},
				function(errMsg){
					formError.show(errMsg);
				}
			);

		}
		else{
			//错误提示
			formError.show(validateResult.msg);
		}

	},

	//非空验证
	formValidate : function(formData){
		var result = {
			status : false,
			msg : '' 
		};
		if(!_ct.validate(formData.username, 'nonempty')){
			result.msg = '用户名不能为空';
			return result;
		}
		if(!_ct.validate(formData.password, 'nonempty')){
			result.msg = '密码不能为空';
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