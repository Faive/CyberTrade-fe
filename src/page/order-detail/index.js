'user strict'
require('./index.css');
require('page/common/nav/index.js');
require('page/common/nav-simple/index.js');
var _ct = require('util/cybertrade.js');
var _order = require('service/order-service.js');
var orderInfoTemplate = require('./orderInfoTemplate.string');
var productListTemplate = require('./productListTemplate.string');



var page = {
  data : {
    orderNo : _ct.getUrlParam('orderNo') || '',
    toPay : _ct.getUrlParam('toPay') || false,
    orderInfo : ''
  },

	init : function(){
    this.loadOrderInfo();
    this.bindEvent();
	},

	

  loadOrderInfo : function(){
    var _this = this;
    _order.orderDetail({
      orderNo : _this.data.orderNo
    },
      function(res){
        _this.data.orderInfo = res;
        _this.renderOrderInfoHtml();
        _this.renderProductListHtml();
        if(_this.data.toPay){
          _this.loadPayment();
        }
      },
      function(errMsg){
        _ct.errorTips(errMsg);
      });

  },

  loadPayment : function(){
    var _this = this;
    if(_this.data.orderInfo.status === 10){
      _this.hideOpera();
      $('.body .payment').css('visibility', 'visible');
      _order.payOrder({
        orderNo : _this.data.orderNo
      },function(res){
        $('.qrcode-img .qrcode').attr('src',res.qrUrl);
        // $('.qrcode-img .qrcode').attr('src','../../src/image/success.png');

        //调用轮询函数
        _this.checkOrderStatus();

      },function(errMsg){

      });
    }

  },


	bindEvent :function(){
		var _this = this;
    //支付按钮
    $(document).on('click', '.info .opera-part .btn.pay', function(){
      _this.loadPayment();
      _this.hideOpera();    
    });

    //取消订单
    $(document).on('click', '.info .opera-part .btn.cancel-order', function(){
      if(window.confirm("是否取消该订单？")){
        _order.cancelOrder({
          orderNo : _this.data.orderNo
        },function(res){
          _this.loadOrderInfo();

        },function(errMsg){
          _ct.errorTips(errMsg);
        });
      }   
    });

    //取消支付
    $(document).on('click', '.payment .opera .cancel-pay', function(){
      //隐藏支付模块
      _this.hidePayment();
      //重载订单信息
      _this.loadOrderInfo();
      //终止轮询函数
      window.clearInterval(_this.checkStatusTimer); 
    });

	},
  renderOrderInfoHtml : function(){
    var _this = this;
    var html = _ct.renderHtml(orderInfoTemplate,_this.data.orderInfo);
    $('.info-part').html(html);
    if(_this.data.orderInfo.status === 10){
      _this.showOpera();
    }
  },

  renderProductListHtml : function(){
    var html = _ct.renderHtml(productListTemplate,this.data.orderInfo);
    $('.frame.product .body').html(html);

  },
  checkOrderStatus : function(){
    var _this = this;
    _this.checkStatusTimer = window.setInterval(function(){
      _order.queryOrderStatus({
        orderNo : _this.data.orderNo
      },function(res){
         if(res == true){
          $('.qrcode-img .qrcode').attr('src','../../src/image/success.png');
          $('.payment .note').html('支付成功！');
          setTimeout(function(){
            _this.hidePayment();
          },3e3);
          _this.loadOrderInfo();
           window.clearInterval(_this.checkStatusTimer); 

         }
        
      },function(errMsg){

      });
    }
      ,5e3);
    
  },
  hideOpera : function(){
    $('.opera-part').css('visibility', 'hidden');
  },
  showOpera : function(){
    $('.opera-part').css('visibility', 'visible');
  },

  hidePayment : function(){
    $('.body .payment').css('visibility', 'hidden');

  }



 
};

$(function(){
	page.init();
});