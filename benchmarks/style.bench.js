const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

"use strict";

global.path_to_app = "./";
global.base_dir = __dirname+'/../src';
global.user_data_dir = './data';

process.env.NODE_ENV = 'test';

const path = require('path');
const state = require('../src/server/lib/state');
const widgets = require('../src/server/lib/widgets');
const style = require('../src/server/lib/style');
const fs = require('fs');

suite.add('Render styles with caching', function(deferred) {
  style.render_file(
    path.join(base_dir, "/assets/stylus/global.styl"), state.get().style
  ).then((css) => {
    deferred.resolve();
  });
}, {'defer': true});

suite.add('Render styles without caching', function(deferred) {
  style.render_file(
    path.join(base_dir, "/assets/stylus/global.styl"), state.get().style, true
  ).then((css) => {
    deferred.resolve();
  });
}, {'defer': true});

suite.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run();
