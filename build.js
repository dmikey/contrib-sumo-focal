#!/usr/local/bin/node
var fs = require('fs');
var requirejs = require('requirejs');
var lib_name = 'focal';

var config = {
    baseUrl: 'src',
    name: lib_name,
    out: 'dist/'+ lib_name + '-min.js'
};

requirejs.optimize(config, function (buildResponse) {

    fs.appendFile(config.out,[], function (err) {
      if (err) throw err;
      console.log(lib_name + ' has been built!');
    });
}, function(err) {
    console.log(err);
});