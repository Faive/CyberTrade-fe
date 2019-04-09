'use strict';
var _ct = require('util/cybertrade.js');

var _shippingAddress = {

	//获取收货地址List
	getList : function(requestParam, resolve, reject){
        //pageNum(默认1),pageSize(默认10)
        _ct.request({
            url     : _ct.getServerUrl('/shipping/list.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    detail : function(requestParam, resolve, reject){
        //shippingId
        _ct.request({
            url     : _ct.getServerUrl('/shipping/select.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    updateAddress : function(requestParam, resolve, reject){
        // id=1
        // receiverName=geely
        // receiverPhone=010
        // receiverMobile=18688888888
        // receiverProvince=北京
        // receiverCity=北京市
        // receiverAddress=中关村
        // receiverZip=100000
        _ct.request({
            url     : _ct.getServerUrl('/shipping/update.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    deleteAddress : function(requestParam, resolve, reject){
        //shippingId
        _ct.request({
            url     : _ct.getServerUrl('/shipping/del.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },

    addAddress : function(requestParam, resolve, reject){
        // 
        // receiverName=geely
        // receiverPhone=010
        // receiverMobile=18688888888
        // receiverProvince=北京
        // receiverCity=北京市
        // receiverAddress=中关村
        // receiverZip=100000
        _ct.request({
            url     : _ct.getServerUrl('/shipping/add.do'),
            data    : requestParam,
            method  : 'GET',
            success : resolve,
            error   : reject
        });
    },
}

module.exports = _shippingAddress;