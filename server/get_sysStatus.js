var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
var fs = require('fs')

async function getSysStatus(req,res) {
    var data = req.body
    var token = req.headers.token
    var tmp = tool.token_analysis(token)
    if (typeof(tmp) == "string") {
        res.send({
            "message": "token错误",
            "code": 400 
        })
        return
    }
    var id = tmp[0], role = tmp[1], name = tmp[2], kid = tmp[3] 

    var ls = tool.get_sys_info()

    console.log(ls)
    res.send({
        "message": "",
        "code": 200,
        "data": {
        	"start_time": ls[1],
        	"end_time": ls[2],
        	"sys_name": ls[3], 
        	"semester": ls[0],
            "state": ls[4],
        }
    })

    res.end()
    return 
}

module.exports = getSysStatus