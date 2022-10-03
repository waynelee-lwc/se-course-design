var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function addProfessor(req,res){
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
    if (role != "registrar") {
        res.send({
            "message": "您没有管理权限",
            "code": 400 
        })
        return
    }
    
    
    var sql = mysql.format("insert into professor(name, dept, birthday, status, ssn, password) values (?,?,?,?,?,?)",[data.name, data.graduation_date, data.birthday, data.status, data.ssn, "123456"])
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
        "code": 200
    })
    res.end()
    return 
}

module.exports = addProfessor