'user strict'
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _ct = require('util/cybertrade.js');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');
var templateIndex = require('./index.string')

var page = {
	data : {
		productId : _ct.getUrlParam('productId') || '',
	},

	init : function(){
		this.loadProductDetail();
		this.bindEvent();
		
	},

	loadProductDetail : function(){
		var _this = this;
		var html = '';
		if (!_this.data.productId) {
			_ct.goHome();
		}
		_product.getDetail(_this.data,
        	function(res){
        		_this.data = res;
        		res.subImages = res.subImages.split(',');
        		html = _ct.renderHtml(templateIndex, res);
        		$('.page-wrap.w').html(html);
        	},
        	function(errMsg){
        		$('.page-wrap.w').html('<p class="error-tips">找不到此商品~</p>');
        	}
        );

	},

	bindEvent :function(){
		var _this = this;
       	
       	//子图预览
       	$(document).on('mouseenter', '.sub-img-item', function(){
       		var subImageUrl = $(this).find('.sub-img').attr('src');
       		$('.main-img-con .main-img').attr('src',subImageUrl);
       	});  

       	//数量加减
       	$(document).on('click', '.btn-count', function(){
       		var curCount = parseInt($('.count').val());
       		var tempCount = 0;
       		if($(this).hasClass('plus')){
       			tempCount = curCount + 1;
       		}
       		else{
       			tempCount = curCount - 1;
       		}
       		if(_this.countCheck(tempCount)){
       			$('.count').val(tempCount);
       		}else{
       			_ct.errorTips('数量应大于0且小于库存数量');
       		}
       	});

       	$(document).on('blur', '.count', function(){
       		var curCount = parseInt($('.count').val());
       		if(!_this.countCheck(curCount)){
       			_ct.errorTips('数量应大于0且小于库存数量');
       			$('.count').val(1);
       		}
       	});

       	$(document).on('click', '.btn.addToCart',function(){
       		_cart.addToCart({
       			productId : _this.data.id,
       			count : parseInt($('.count').val())
       		},
       		function(res){
       			window.location.href = './result.html?type=addToCart';
       		},
       		function(errMsg){
       			_ct.errorTips(errMsg);
       		});
       	});  
	},

	countCheck : function(tempCount){
		return (tempCount > 0 && tempCount <= this.data.stock);
	},
};

$(function(){
	page.init();
});