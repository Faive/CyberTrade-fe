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
		//异步验证用户名是否已存在
		$('#username').blur(function(){
			var username = $.trim($(this).val());
			if(!username){
				formError.hide();
				return;
			}
			console.log(username);
			_user.checkUsername(username,
				function(res){
					formError.hide();
				},
				function(msg){
					formError.show(msg);
				}
			);

		});

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
			password : $.trim($('#password').val()),
			passwordConfirm : $.trim($('#confirm-password').val()),
			email : $.trim($('#email').val()),
			phone : $.trim($('#phone').val()),
			question : $.trim($('#question').val()),
			answer : $.trim($('#answer').val())
		},
			//表单验证结果
			validateResult = this.formValidate(formData);
		if(validateResult.status){
			//注册
			_user.register(formData, 
				function(res){
					window.location.href ='./result.html?type=register';				
				},
				function(errMsg){
console.log(errMsg);
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
		if(formData.password.length < 6){
			result.msg = '密码位数不能小于6位';
			return result;
		}
		if(formData.password !== formData.passwordConfirm){
			result.msg = '两次输入的密码不一致';
			return result;
		}
		if(!_ct.validate(formData.email, 'email')){
			result.msg = '邮箱格式不正确';
			return result;
		}
		if(!_ct.validate(formData.phone, 'phone')){
			result.msg = '手机号格式不正确';
			return result;
		}

		if(!_ct.validate(formData.question, 'nonempty')){
			result.msg = '密保问题不能为空';
			return result;
		}
		if(!_ct.validate(formData.answer, 'nonempty')){
			result.msg = '密保问题答案不能为空';
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