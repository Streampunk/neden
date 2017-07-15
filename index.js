/* Copyright 2017 Streampunk Media Ltd.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var uuid = require('uuid');

var is = (f, ...x) => {
  var id = uuid.v4();
  var v = undefined;
  var deps = {};
  var dpnd = [];
  var fn = undefined;
  var ob = function (z, ...p) {
    if (z && typeof z === 'function') {
      dpnd.forEach(d => { delete d.deps[id]; });
      dpnd.length = 0;
      p.forEach(q => dpnd.push(q));
      fn = () => {
        console.log('Evaluating ', z.toString())
        v = z.apply(null, p.map(z => z()));
        Object.keys(deps).forEach(x => { deps[x](); });
      };
      fn();
      p.forEach(y => { y.deps[id] = fn; });
    } else if (z) {
      dpnd.forEach(d => { delete d.deps[id]; });
      dpnd.length = 0;
      v = z;
      Object.keys(deps).forEach(x => { deps[x](); });
    }
    return v;
  }
  if (f && x) {
    var appy = [f];
    x.forEach(e => { appy.push(e); });
    ob.apply(null, appy);
  } else if (f) {
    ob(f);
  }
  ob.deps = deps;
  ob.dpnd = dpnd;
  ob.fn = fn;
  return ob;
};

module.exports = is;
