var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
var fs = require('fs')

async function openRegister(req,res) {
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
    fs.writeFileSync('../sys_config.json', 
        JSON.stringify({"semester": data.semester, "start_time": data.start_time, "end_time": data.end_time, "sys_name": data.sys_name, "state": data.state})
        )
    
    tool.sys_init()
    res.send({
        "message": "修改系统成功",
        "code":200
    })

    res.end()
    return 
}

module.exports = openRegister