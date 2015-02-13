'use strict';
exports.name = 'count';
exports.usage = '<command> [options]';
exports.desc = '代码统计';
exports.register = function(commander){
    commander.action(function(){
        var child_process = require('child_process'),
            fs = require("fs"),
            xlsx = require('node-xlsx');
        var args = Array.prototype.slice.call(arguments);
        var options = args.pop();
        var cmd = args.shift();
        var ret = child_process.exec("tch release --lint --clean",function(err,stdout,stderr){
            var _index = stdout.indexOf("{"),
                _data = stdout.substr(_index),
                data = _data.replace(/\'/g,"\"").replace(/count:/g,'"count":').replace(/list:/g,'"list":');
            var json = eval('('+data+')');
            var authorArr = [["作者","错误数量"]],arr = [],
                xlsxArr = [];
            for(var i in json){
                var item = json[i];
                var _list = item.list,
                    _xArr = [["相关内容","错误原因","文件路径","行号","错误代码"]];
                for(var n = 0,nLen = _list.length -1; n<=nLen;n++){
                    var _lArr = decodeURIComponent(_list[n]).split("|");
                    _xArr.push(_lArr);
                }
                xlsxArr.push({
                    "name": item.author,
                    data : _xArr
                })
                authorArr.push([item.author,item.count]);
                //authorArr.push(item);

            }
            var _default = [
                {name: "作者", data: authorArr}
            ];
            var buffer = xlsx.build(_default.concat(xlsxArr)); // returns a buffer

            var d = new Date(),
                year = d.getFullYear(),
                month = d.getMonth()+ 1,
                date = d.getDate()+1;

            fs.writeFile(year+"-"+month+"-"+date+"前端规范检查.xlsx",buffer);
            fis.log.notice("已生成规范检查数据");
            fis.log.notice("文件名称为:"+year+"-"+month+"-"+date+"前端规范检查.xlsx");
        });
    });
}