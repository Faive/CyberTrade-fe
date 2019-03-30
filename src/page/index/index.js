'use strict';
require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
require('util/unslider/index.js');

var _ct = require('util/cybertrade.js');
var _product = require('service/product-service.js');
var navSide = require('page/common/nav-side/index.js');
var templateBanner = require('./banner.string');


var page = {
	init : function () {
		// body...
		navSide.init({
			name : 'user-center'
		});

		var bannerHtml = _ct.renderHtml(templateBanner);
		$('.banner-con').html(bannerHtml);
		var $slider = $('.banner').unslider({
			// speed: 500,               //  The speed to animate each slide (in milliseconds)
			// delay: 3000,              //  The delay between slide animations (in milliseconds)
			// complete: function() {},  //  A function that gets called after every slide animation
			// keys: true,               //  Enable keyboard (left, right) arrow shortcuts
			// dots: true,               //  Display dot navigation
			// fluid: false              //  Support responsive design. May break non-responsive designs
			dots: true,
		});
		
		$('.banner-con .banner-arrow').click(function(){
			var forward = $(this).hasClass('pre') ? 'prev' : 'next';
			$slider.data('unslider')[forward]();
		});

		$('.loading').hide();

		this.laodNewGoodsList();
	},

	laodNewGoodsList : function(){

		/*todo */ 
		//_product.getNewGoods();
		_product.getDetail(
			{
				productId : 28
			},
			function(res){
				for (var i = 1; i <=5; i++) {
					$('.new-goods-item.item-' + i).find('.link').attr('href', './product-detail.html?productId=' + res.id)
					.find('.loading').hide()
					.siblings('.goods-image').show().attr('src', res.imageHost + res.mainImage)
					.siblings('.description').text(res.name)
					.siblings('.price-item').find('.price').text(res.price);
				}
			},
			function(errMsg){
				$('.new-goods-item').find('.description').text('加载失败');
			}
		);
		/*todo */
	}
}

$(function(){
	page.init();
});
