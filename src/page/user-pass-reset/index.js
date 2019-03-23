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
	data : {
		username : '',
		question : '',
		answer : '',
		token : ''

	},
	init : function(){
		this.onLoad();
		this.bindEvent();
	},

	onLoad : function(){
		this.loadUsernameInput();
	},

	bindEvent : function(){
		var _this = this;
		//绑定输入用户名下一步按钮
		$('#submit-username').click(function(){
			var username = 	$.trim($('#username').val());
			if(username){
				_user.getQuestion(username,
					function(res){
						_this.data.username = username;
						_this.data.question = res;
						_this.loadAnswerInput();
					},
					function(errMsg){
						formError.show(errMsg);
					});
			}
			else{
				formError.show("请输入用户名");
			}
		});

		//绑定输入答案下一步按钮
		$('#submit-answer').click(function(){
			var answer = 	$.trim($('#answer').val());
			if(answer){
				_user.checkAnswer(
					{
						username : _this.data.username,
						question : _this.data.question,
						answer : answer,
					},
					function(res){
						_this.data.answer = answer;
						_this.data.token = res;
						_this.loadPasswordInput();
					},
					function(errMsg){
						formError.show(errMsg);
					}
				);
			}
			else{
				formError.show("请输入问题答案");
			}
		});
		
		//绑定输入新密码下一步按钮
		$('#submit-password').click(function(){
			var password = 	$.trim($('#password').val());
			if(password && password.length >= 6){
				console.log(password);
				_user.resetPassword(
					{
						username : _this.data.username,
						newPassword : password,
						forgetToken : _this.data.token
					},
					function(res){
						window.location.href='./result.html?type=passreset';
					},
					function(errMsg){
						formError.show(errMsg);
					}
				);
			}
			else{
				formError.show("密码不能少于6位");
			}
		});
	},
	//加载用户名输入框
	loadUsernameInput : function(){
		$('.step-username').show();
	},

	//加载密保问题的答案输入框
	loadAnswerInput : function(){
		formError.hide();
		$('.step-username').hide()
		.siblings('.step-answer').show()
		.find('.question').text(this.data.question);
	},

	//加载新密码输入框
	loadPasswordInput : function(){
		formError.hide();
		$('.step-answer').hide()
		$('.step-password').show();
	},

};

$(function(){
	page.init();
});