'user strict'
require('./index.css');
var nav = require('page/common/nav/index.js');
require('page/common/header/index.js');
var _ct = require('util/cybertrade.js');
var _product = require('service/product-service.js');
var templateList = require('./templateList.string');
var Pagination = require('util/pagination/index.js');

var page = {
	data : {
		listParam : { 
			keyword : _ct.getUrlParam('keyword') || '',
			categoryId : _ct.getUrlParam('categoryId') || '',
			pageNum : _ct.getUrlParam('pageNum') || 1,
			pageSize : _ct.getUrlParam('pageSize') || 10,
			orderBy : _ct.getUrlParam('orderBy') || 'default'
		}
	},
	init : function(){
		nav.init();
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		this.loadList();
	},
	bindEvent :function(){
		var _this = this;
        // 排序的点击事件
        $('.sort-item').click(function(){
            var this_item = $(this);
            _this.data.listParam.pageNum = 1;
            // 点击默认排序
            if(this_item.data('type') === 'default'){
                // 已经是active样式 不刷新
                if(this_item.hasClass('active')) {
                    return;
                }
                else{
                    this_item.addClass('active').siblings('.sort-item').removeClass('active').removeClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'default';
                }
            }
            // 点击价格排序
            else if(this_item.data('type') === 'price'){
                // active class 的处理
                this_item.addClass('active').siblings('.sort-item').removeClass('active');
                // 升序、降序的处理
                if(this_item.hasClass('asc')){
                	this_item.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'price_desc';
                   
                }else{
                     this_item.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'price_asc';
                }
            }
            // 重新加载列表
            _this.loadList();
        });

        //分页按钮
        $('.label-item').click(function(){
        	var this_item = $(this);
        	console.log("???????");
        	if(!(this_item.hasClass('isSelected') || this_item.hasClass('isSelected'))){
        		_this.data.listParam.pageNum = this_item.data('value');
        		_this.loadList();
        	}
        });
	},

	loadList : function(){
		var _this = this;
		var listHtml = '';
		var requestParam = this.data.listParam;
		_product.getList(requestParam,
			function(res){
				listHtml = _ct.renderHtml(templateList,{
					list : res.list
				});

				$('.product-list').html(listHtml);
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
				_ct.errorTips(errMsg);
			}
		);
	},

	//加载分页信息
	loadPagination : function(pageInfo){
		var _this = this;
		_this.pagination ? '' : (_this.pagination = new Pagination());
		_this.pagination.render($.extend(
			{},
			pageInfo,
			{
				container : $('.pagination'),
				onSelectPage : function(pageNum){
					_this.data.listParam.pageNum = pageNum;
					_this.loadList();
				}
			}));
	}
};

$(function(){
	page.init();
});