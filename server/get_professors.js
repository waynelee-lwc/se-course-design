var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function getProfessors(req,res){
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

    var sql = mysql.format("select pid, name, birthday, ssn, status, dept from professor where 1=1 ")

    // console.log(data.id)
    if (data.id != undefined) {
        sql += mysql.format(" and pid = ? ", [Number(tool.old_pro_id(data.id))])
    }

    if (data.name != undefined) {
        sql += mysql.format(" and name like ? ", `%${data.name}%` )
    }

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
    for (x in result) {
        result[x].id = tool.new_pro_id(result[x].dept, result[x].pid)
    }
    res.send({
        "message": "查询成功",
        "code":200,
        "data": result
    })
   	res.end()
    return 
}

module.exports = getProfessors

