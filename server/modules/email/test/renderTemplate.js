var fs = require('fs');
var path = require('path');
var koa = require('koa');
var dot = require('dot');
var testData = require('./testData');
var app = new koa();

var fileName = process.argv[2];

if (!fileName) {
  throw Error('Need file name');
}

app.use(function *(){
  var dotTemplate = fs.readFileSync(path.resolve('../templates/' + fileName + '.dot'));
  var templateFun = dot.template(dotTemplate);
  this.body = templateFun(testData);
});

app.listen(3002, () => console.log('Server listening on 3002'));