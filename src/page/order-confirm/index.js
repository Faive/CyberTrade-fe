'user strict'
require('./index.css');
require('page/common/nav/index.js');
require('page/common/nav-simple/index.js');
var _ct = require('util/cybertrade.js');
var _order = require('service/order-service.js');
var _shippingAddress = require('service/shippingAddress-service.js');
var _cart =  require('service/cart-service.js');
var _popPanel = require('./popPanel.js');
var addressTemplate = require('./shippingAddressTemplate.string');
var productListTemplate = require('./productListTemplate.string');
var submitInfoTemplate = require('./submitInfoTemplate.string');

var page = {
  Data : {
    shippingAddress : '',
    productList : '',
    submitInfo : {
      totalCount : 0,
      totalPrice : 0,
      selectedShippingAddress : '',
    }
  },

	init : function(){
		this.loadShippingAddress();
    this.loadProductList();
		this.bindEvent();
	},

	loadShippingAddress : function(){
		var _this = this;
    $('.frame.address .body').html('<div class="loading"></div>');
    _shippingAddress.getList({
      pageNum : 1,
      pageSize : 20 

    },
    function(res){
      _this.Data.shippingAddress = res;
      _this.renderShippingAddressHtml();

    },
    function(errMsg){
      _ct.errorTips(errMsg);
    });
	},
  loadProductList : function(){
    var _this = this;
    $('.frame.product .body').html('<div class="loading"></div>');
    _cart.getCartList(
    function(res){
      _this.Data.productList = res;
      _this.renderProductListHtml();
      _this.loadSubmitInfo();

    },
    function(errMsg){
      _ct.errorTips(errMsg);
    });

  },

  loadSubmitInfo : function(){
    this.pretreatData();
    var html = _ct.renderHtml( submitInfoTemplate,this.Data.submitInfo);
    $('.submit-con').html(html);
  },


	bindEvent :function(){
		var _this = this;

    //选择收货地址
        $(document).on('click', '.address-item-selectable .address-item', function(){
          $(this).addClass('selected').siblings('.address-item.selected').removeClass('selected');
          var shippingId = $(this).data('shippingid');
          var receiveName = $(this).find('.main-info').text();
          var receiveAddress = $(this).find('.detail').text();
          _this.Data.submitInfo.selectedShippingAddress = {
            shippingId : shippingId,
            receiveName : receiveName,
            receiveAddress : receiveAddress
          }
          _this.loadSubmitInfo();

        });

      //添加收货地址
        $(document).on('click', '.address-item.add', function(){
          _popPanel.show({
            updateTag : false,
            onSuccess : function(){
              _this.loadShippingAddress();
            }
          });
          

        });

      //编辑收货地址
        $(document).on('click', '.adress-edit', function(e){
          e.stopPropagation();
          var _shippingId = $(this).parents('.address-item').data('shippingid');
          _shippingAddress.detail({
            shippingId : _shippingId
            },
            function(res){
              _popPanel.show({
              updateTag : true,
              addressData : res,
              onSuccess : function(){
                _this.loadShippingAddress();
              }
              });
            },
            function(errMsg){
              _ct.errorTips(errMsg);
            }
          );
        });

         //删除收货地址
        $(document).on('click', '.address-delete', function(){
          var _shippingId = $(this).parents('.address-item').data('shippingid');
          if(window.confirm('确认要删除该地址？')){
            _shippingAddress.deleteAddress({
              shippingId : _shippingId
            },
            function(res){
              _this.loadShippingAddress();
              _this.Data.submitInfo.selectedShippingAddress = '';
              _this.loadSubmitInfo();
            },
            function(errMsg){
              _ct.errorTips(errMsg);
            });  
          }
        });

      //提交订单
        $(document).on('click', '.submit-con .btn', function(){
          var shippingId = _this.Data.submitInfo.selectedShippingAddress.shippingId;
          if(shippingId){
            _order.createOrder({
              shippingId : shippingId
            },
            function(res){
              window.location.href =  './order-detail.html?orderNo=' + res.orderNo + '&toPay=true';
            },
            function(errMsg){
              _ct.errorTips(errMsg);
            });

          }else{
            _ct.errorTips("请在上方选择收货地址!");
          }
        });

    


    
	},

  
  renderShippingAddressHtml : function(){
    var html = _ct.renderHtml( addressTemplate,this.Data.shippingAddress);
    $('.frame.address .body').html(html);
  },
  renderProductListHtml : function(){
    var html = _ct.renderHtml( productListTemplate,this.Data.productList);
    $('.frame.product .body').html(html);
  },

  pretreatData : function(){
    //获得总价格
    this.Data.submitInfo.totalPrice = this.Data.productList.cartTotalPrice;
    //计算总件数

    var length = this.Data.productList.cartProductVoList.length;
    if(0 === length){
        
      }
    else{
        //计算选中件数
        this.Data.submitInfo.totalCount = 0;
        for (var i = 0; i < length; i++) {
          if(this.Data.productList.cartProductVoList[i].productChecked === 1){
              //计算选中件数
              this.Data.submitInfo.totalCount = this.Data.submitInfo.totalCount + this.Data.productList.cartProductVoList[i].quantity;            
          }
        }
    }

  }  

 
};

$(function(){
	page.init();
});