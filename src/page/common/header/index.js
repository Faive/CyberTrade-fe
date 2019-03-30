'use strict';
require('./index.css');

var _ct		= require('util/cybertrade.js');

// 通用页面头部
var header = {
    init : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad :function(){
    	var keyword = _ct.getUrlParam('keyword');
    
    	if(keyword){
    		//回填搜索框
    		$('#search-input').val(keyword);
    	}
    },
    bindEvent : function(){
    	var _this = this;
        $('.header .logo').click(function(){
            _ct.goHome();
        });
    	//点击搜索按钮后提交搜索
    	$('#search-btn').click(function(){
    		_this.searchSubmit();
    	});

    	//输入回车后提交搜索
    	$('#search-input').keyup(function(e){
    		//13是回车键的键值
    		if (e.keyCode === 13) {
    			_this.searchSubmit();
    		}
    	});
	},
	//搜索提交
	searchSubmit : function(){
		var keyword = $.trim($('#search-input').val());
		
		if(keyword){
			//keyword不爲空
			window.location.href = './product-list.html?keyword=' + keyword;
		}
		else{
			//keyword爲空
			_ct.goHome();
		}
	}
}
module.exports = header.init();