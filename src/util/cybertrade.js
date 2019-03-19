'use strict';
var conf = {
	serverHost	: ''
};

var Hogan = require('hogan');

var _ct = {
	request : function(param){
		var _this = this;
		$.ajax({
			type		: param.method 	|| 'get',
			url			: param.url		|| '',
			dataType	: param.type 	|| 'json',
			data 		: param.data 	|| '',
			success 	: function(res){
				//请求成功
				if(0 === res.status){
					typeof param.success === 'function' && param.success(res.data, res.msg); 
				}
				//没有登录状态 需要登录
				else if(10 === res.status){
					_this.doLogin();
				}

				//请求数据错误
				else if(1 === res.status){
					typeof param.error === 'function' && param.error(res.msg);
				}
				
			},
			error		: function(err){
				typeof param.error === 'function' && param.error(err.statusText);
			}
		});
	},

	//获取服务器地址
	getServerUrl : function(path){
		return conf.serverHost + path;
	},

	//获取url参数
	getUrlParam : function(name){
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var res = window.location.search.substr(1).match(reg);
		return res ? decodeURIComponent(res[2]) : null;
	},

	//渲染html模板
	renderHtml	: function(htmlTemplate, data){
		//htmlTemplate 模板
		var template = Hogan.compile(htmlTemplate),
			result = template.render(data);
		return result;
	},

	//成功提示
	successTips : function(message){
		alert(message || '操作成功');
	},

	//错误提示
	errorTips : function(message){
		alert(message || '出错啦');
	},

	//字段验证 判读是否为空 手机 邮箱等
	validate : function(value, type){
		var value = $.trim(value);

		//非空验证
		if('require' === type){
			return !!value;
		}

		//手机号验证
		if('phone' === type){
			return /^1\d{10}$/.test(value);
		}

		//邮箱格式验证
		if('email' === type){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		}
	},
	//强制登陆
	doLogin : function(){
		window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href);
	},

	//跳转主页
	goHome : function(){
		window.location.href = './index.html';
	}

};

module.exports = _ct;