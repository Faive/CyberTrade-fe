'use strict';
var _ct = require('util/cybertrade.js');

var _order = {

	//获取商品List
	getList : function(requestParam, resolve, reject){
        _ct.request({
            url     : _ct.getServerUrl('/order/list.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    createOrder : function(requestParam, resolve, reject){
        //shippingId
        _ct.request({
            url     : _ct.getServerUrl('/order/create.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },
}

module.exports = _order;