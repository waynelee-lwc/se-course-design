var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function setGrades(req,res){
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

    var sql = mysql.format("update student_course set grades = ? where sid = ? and cid = ? and semester = ? ", [data.grades, data.sid, data.cid, ls[0]])
    // console.log(sql)
    var result = await query(sql)
    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    result = JSON.parse(JSON.stringify(result))
    res.send({
        "message": "更新成功",
        "code":200,
        "data": result
    })
   	res.end()
    return 
}

module.exports = setGrades

