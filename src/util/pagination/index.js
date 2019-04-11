'use strict';
require('./index.css');
var _ct = require('util/cybertrade.js');
var templatePagination = require('./templatePagination.string');

var Pagination = function(){
	var _this = this;
	_this.defalutOption = {
		container : null,
		pageNum : 1,
		pageRange : 2,
		onSelectPage : null //回调函数
	};

	$(document).on('click', '.label-item',function(){
		var this_item = $(this);
		if(!(this_item.hasClass('isSelected') || this_item.hasClass('disabled'))){
			typeof _this.option.onSelectPage === 'function' ? 
				_this.option.onSelectPage(this_item.data('value')) : null;
        }
	});
}

Pagination.prototype.render = function(userOption) {
	// body...
	//合并option
	this.option = $.extend({}, this.defalutOption,userOption);
	if(!(this.option.container instanceof jQuery)){
		console.warn('valid container!');	
		return;
	}

	//只有一页 就不显示
	// if(this.option.pages <= 1){
	// 	return;
	// }

	//渲染
	this.option.container.html(this.getPaginationHtml());
};

Pagination.prototype.getPaginationHtml = function(){
	var html = '',
		option = this.option,
		pageData = [];
	//起始标签编号
	var startNum = option.pageNum - option.pageRange > 0 ? option.pageNum - option.pageRange : 1;
	//结束标签编号
	var endNum = option.pageNum + option.pageRange < option.pages ? option.pageNum + option.pageRange : option.pages;
	pageData.push({
		label : '<<',
		value : option.prePage,
		disabled : !option.hasPreviousPage
	});

	for (var i = startNum; i <= endNum; i++) {
		pageData.push({
			label : i,
			value : i,
			isSelected : (i === option.pageNum)
		});
	}

	pageData.push({
		label : '>>',
		value : option.nextPage,
		disabled : !option.hasNextPage
	});

	html = _ct.renderHtml(templatePagination,{
		pageData : pageData,
		pageNum : option.pageNum,
		pages : option.pages
	});
	return html;
};

module.exports = Pagination;