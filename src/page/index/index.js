'use strict';
require('page/common/header/index.js');
require('page/common/nav/index.js');
var navSide = require('page/common/nav-side/index.js');
require('./index.css');
var _ct = require('util/cybertrade.js');

navSide.init({
	name : 'user-center'
});