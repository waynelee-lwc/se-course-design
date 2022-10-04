var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function addSchedule(req,res){
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
    
    var sql = mysql.format("insert into schedule(sid, semester) values (?,?)",[id, tool.sys_semester])
    var result = await query(sql)
    console.log(result)

    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    res.send({
        "message": "插入成功",
        "code":200
    })
    res.end()
    return 
}

module.exports = addSchedule