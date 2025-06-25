'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = require('express');
var cors_1 = require('cors');
var fs_1 = require('fs');
var path_1 = require('path');
var app = (0, express_1.default)();
var PORT = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var dataFile = path_1.default.join(__dirname, '../data.json');
var readData = function () {
  var raw = fs_1.default.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
};
var writeData = function (data) {
  fs_1.default.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
};
app.get('/api/business-leads', function (req, res) {
  var customers = readData();
  res.json(customers);
});
app.post('/api/business-leads/batch', function (req, res) {
  var customers = readData();
  var newCustomers = req.body.map(function (item) {
    return __assign(__assign({}, item), { id: Date.now().toString() + Math.random().toString().slice(2, 5) });
  });
  var updated = __spreadArray(__spreadArray([], customers, true), newCustomers, true);
  writeData(updated);
  res.status(201).json(newCustomers);
});

app.put('/api/business-leads/:id', function (req, res) {
  var customers = readData();
  var id = req.params.id;
  var index = customers.findIndex(function (c) {
    return c.id === id;
  });
  if (index !== -1) {
    customers[index] = __assign(__assign(__assign({}, customers[index]), req.body), {
      updatedAt: new Date().toISOString(),
    });
    writeData(customers);
    res.json(customers[index]);
  } else {
    res.status(404).json({ message: 'Không tìm thấy khách hàng' });
  }
});
app.delete('/api/business-leads/:id', function (req, res) {
  var customers = readData();
  var id = req.params.id;
  customers = customers.filter(function (c) {
    return c.id !== id;
  });
  writeData(customers);
  res.json({ message: 'Đã xoá thành công' });
});
app.listen(PORT, function () {
  console.log('\u2705 Server is running at http://localhost:'.concat(PORT));
});
