'use strict';
var _ct = require('util/cybertrade.js');

var _order = {

	//获取订单List
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

    orderDetail : function(requestParam, resolve, reject){
        //orderNo
        _ct.request({
            url     : _ct.getServerUrl('/order/detail.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    cancelOrder : function(requestParam, resolve, reject){
        //orderNo
        _ct.request({
            url     : _ct.getServerUrl('/order/cancel.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    payOrder : function(requestParam, resolve, reject){
        //orderNo
        _ct.request({
            url     : _ct.getServerUrl('/order/pay.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    queryOrderStatus : function(requestParam, resolve, reject){
        //orderNo
        _ct.request({
            url     : _ct.getServerUrl('/order/query_order_pay_status.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },







}

module.exports = _order;