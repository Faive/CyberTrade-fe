'user strict'
require('./index.css');
require('page/common/nav-simple/index.js');
var _ct = require('util/cybertrade.js');

$(function(){
	var type = _ct.getUrlParam('type') || 'default',
		$element = $('.' + type + '-success');
		//显示对应操作
		$element.show();

})