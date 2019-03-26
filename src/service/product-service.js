'use strict';
var _ct = require('util/cybertrade.js');

var _product = {

	//获取商品List
	getList : function(requestParam, resolve, reject){
		/*
			requestParam = {
				categoryId :
				keyword :
				pageNum(default=1) :
				pageSize(default=10) :
				orderBy(default=""):排序参数：例如price_desc，price_asc
			}
		*/
        _ct.request({
            url     : _ct.getServerUrl('/product/list.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    //获取商品详情
    getDetail : function(data, resolve, reject){
		/*
			data = {
				productId : '商品id'
			}
		*/
        _ct.request({
            url     : _ct.getServerUrl('/product/detail.do'),
            data    : data,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    //获取最新上架5件商品
    getNewGoods : function(resolve, reject){
        _ct.request({
            url     : _ct.getServerUrl('/product/new_goods.do'),
            data    : '',
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    }

}

module.exports = _product;