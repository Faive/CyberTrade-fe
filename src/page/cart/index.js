'user strict'
require('./index.css');
var nav = require('page/common/nav/index.js');
require('page/common/header/index.js');
var _ct = require('util/cybertrade.js');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');
var cartTemplate = require('./cartTemplate.string');
var page = {
  data : {
    totalCount : 0,
    checkedProductId : '',
    cartInfo : '',
  },

	init : function(){
		this.loadCartInformation();
		this.bindEvent();
	},

	loadCartInformation : function(){
		var _this = this;

    _cart.getCartList(
      function(res){
        _this.data.cartInfo = res;
        _this.renderCartListHtml();
      },
      function(errMsg){

      });
	},

	bindEvent :function(){
		var _this = this;

        //全选和反全选
    $(document).on('click', '.cart-label .select-all',function(){
        if($(this).attr('checked') === 'checked'){
            _cart.unselectAllProduct(
              function(res){
                _this.data.cartInfo = res;
                _this.renderCartListHtml();
              },
              function(errMsg){
                _ct.errorTips(errMsg);
              }
            );
        }
        else {
            _cart.selectAllProduct(
              function(res){
                _this.data.cartInfo = res;
                _this.renderCartListHtml();
              },
              function(errMsg){
                _ct.errorTips(errMsg);
              }
            );
        }
    });
       
    //勾选和反勾选
    $(document).on('click', '.cell.select .select',function(){
      var productId = $(this).parents('.cart-table.list-item').data('productid');
      if($(this).attr('checked') === 'checked'){
            _cart.unselectProduct(productId,
              function(res){
                _this.data.cartInfo = res;
                _this.renderCartListHtml();
              },
              function(errMsg){
                _ct.errorTips(errMsg);
              }
            );
        }
        else {
            _cart.selectProduct(productId,
              function(res){
                _this.data.cartInfo = res;
                _this.renderCartListHtml();
              },
              function(errMsg){
                _ct.errorTips(errMsg);
              }
            );
        }
    });

    //数量加减
        $(document).on('click', '.btn-count', function(){
          var curCount = parseInt($(this).siblings('.count-input').val());
          var stock = $(this).siblings('.count-input').data('stock');
          var productId = $(this).parents('.cart-table.list-item').data('productid');
          var tempCount = 0;
          if($(this).hasClass('plus')){
            tempCount = curCount + 1;
          }
          else{
            tempCount = curCount - 1;
          }
          console.log('curCount :' + curCount + ',stock: '+ stock + ',tempCount: ' + tempCount );
          if((tempCount > 0 && tempCount <= stock)){
            //更新数据再加载
            _this.updateCartInfo(productId, tempCount);
            
          }else{
            _ct.errorTips('数量应大于0且小于库存数量');
          }
        });

        $(document).on('blur', '.count-input', function(){
          var curCount = parseInt($(this).val());
          var stock= $(this).data('stock');
          var productId = $(this).parents('.cart-table.list-item').data('productid');

          if((curCount > 0 && curCount <= stock)){
              //更新数据再加载
               _this.updateCartInfo(productId, curCount);
          }else{
            //不更新直接再加载数据
            _ct.errorTips('数量应大于0且小于库存数量');
            _this.renderCartListHtml();
          }
        });

        //删除单件
        $(document).on('click', '.link.delete', function(){
          var productId = $(this).parents('.cart-table.list-item').data('productid');
          if(window.confirm('确认要删除该件商品？')){
              _this.deleteProductInCart(productId);
          }
        });

        //删除多件
        $(document).on('click', '.link.delete-select-btn', function(){
          if(_this.data.checkedProductId === ''){
            _ct.errorTips('未选中任何商品！')
          }
          else{
            if(window.confirm('确认要删除选中商品？')){
              _this.deleteProductInCart(_this.data.checkedProductId);
            }            
          }
        });

         //去结算
        $(document).on('click', '.btn.submit', function(){
          if(_this.data.checkedProductId === '' || _this.data.totalCount <= 0){
            _ct.errorTips('未选中任何商品！')
          }
          else{
            //跳转订单页面
            window.location.href = './order-confirm.html';                    
          }
        });         
	},

  renderCartListHtml : function(){
    //预处理数据
      this.pretreatData();
      //渲染 
      var html = _ct.renderHtml(cartTemplate,this.data);
      $('.page-wrap.w').html(html);
      //更新导航栏购物车信息
      nav.loadCartCount();
  },
  updateCartInfo : function(_productId,_count){
    var _this = this;

      _cart.updateProduct({
        productId : _productId,
        count : _count
      },
      function(res){
        _this.data.cartInfo = res;
        _this.renderCartListHtml();
      },
      function(errMsg){
        _ct.errorTips(errMsg);
      });
  },

  deleteProductInCart : function(_productIds){
    var _this = this;

      _cart.deleteProduct(_productIds,
      function(res){
        _this.data.cartInfo = res;
        _this.renderCartListHtml();
      },
      function(errMsg){
        _ct.errorTips(errMsg);
      });
  },

  pretreatData : function(){
    var length = this.data.cartInfo.cartProductVoList.length;
    if(0 === length){
        this.data.cartInfo = '';
      }
    else{
        //计算选中件数和记录选中id
        this.data.totalCount = 0;
        this.data.checkedProductId = '';
        for (var i = 0; i < length; i++) {
          if(this.data.cartInfo.cartProductVoList[i].productChecked === 1){
              //计算选中件数
              this.data.totalCount = this.data.totalCount + this.data.cartInfo.cartProductVoList[i].quantity;
              //记录选中id
              this.data.checkedProductId = this.data.checkedProductId 
              + this.data.cartInfo.cartProductVoList[i].productId;
              this.data.checkedProductId = this.data.checkedProductId  + (i === length-1 ? '' : ',');
          }
        }
    }

  }  

 
};

$(function(){
	page.init();
});