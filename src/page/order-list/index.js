'user strict'
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _order = require('service/order-service.js');
var _ct = require('util/cybertrade.js');
var Pagination = require('util/pagination/index.js');
var orderListTemplate  = require('./orderListTemplate.string');

var page = {
	data : {
		orderList : {},
		requestPageParams : {
			pageNum : 1,
			pageSize : 6
		}
 
	},
	init : function(){
		navSide.init({
			name : 'order-list'
		});
		this.loadOrderList();
		this.bindEvent();
		
	},
	bindEvent : function(){
		$(document).on('click','.label.delete',function(){
			if(window.confirm('确认要删除该订单？')){
				
			}
		});
	},
	loadOrderList : function(){
		var _this = this;
		_order.getList(_this.data.requestPageParams,
		function(res){
			_this.data.orderList = res;
			_this.renderOrderListHtml();
			_this.loadPagination({
				hasPreviousPage : res.hasPreviousPage,
				prePage : res.prePage,

				pageNum : res.pageNum,
				navigatepageNums : res.navigatepageNums,

				hasNextPage : res.hasNextPage,
				nextPage : res.nextPage,

				pages : res.pages,
			});
		},
		function(errMsg){

		});

	},

	loadPagination : function(pageInfo){
		var _this = this;
		_this.pagination ? '' : (_this.pagination = new Pagination());
		_this.pagination.render($.extend(
			{},
			pageInfo,
			{
				container : $('.panel-body .pagination-con'),
				onSelectPage : function(pageNum){
					_this.data.requestPageParams.pageNum = pageNum;
					_this.loadOrderList();
				}
			})
		);

	},

	renderOrderListHtml : function(){
		console.log(this.data.orderList);
		var html = _ct.renderHtml(orderListTemplate,this.data.orderList);
		$('.panel-body .order-con').html(html);
	},



};

$(function(){
	page.init();
});