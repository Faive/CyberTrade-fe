'user strict'
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _ct = require('util/cybertrade.js');
var _user = require('service/user-service.js');
var templateIndex  = require('./userInformation.string');

var page = {
	init : function(){
		navSide.init({
			name : 'user-center'
		});
		this.loadUserInfo();
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
	}

};

$(function(){
	page.init();
});