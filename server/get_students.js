var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function getStudents(req,res){
    var data = req.query
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

    var sql = mysql.format("select sid, name, birthday, ssn, status, dept from student where 1=1 ")

    // console.log(data.id)
    
    if (data.id != undefined) {
        sql += mysql.format(" and sid = ? ", [Number(tool.old_stu_id(data.id))])
    }

    if (data.name != undefined) {
        sql += mysql.format(" and name like ? ", `%${data.name}%` )
    }

    var result = await query(sql)
    // console.log(sql, "\n", result)

    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    result = JSON.parse(JSON.stringify(result)); 
    for (x in result) {
        result[x].id = tool.new_stu_id(result[x].sid)
        result[x].graduation_date = result[x].dept
    }
    res.send({
        "message": "查询成功",
        "code":200,
        "data": result
    })
   	res.end()
    return 
}

module.exports = getStudents

