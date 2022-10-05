var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function courseStudentList(req,res){

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

    var ls = tool.get_sys_info()
    
    var sql = mysql.format('select student.sid, grades, name from student_course join student on student.sid = student_course.sid where cid = ? and semester = ? ', [data.id, ls[0]])
    var result = await query(sql)
    console.log(sql)
    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    result = JSON.parse(JSON.stringify(result))
    res.send({
        "message": "查询成功",
        "code":200,
        "data": result
    })
   	res.end()
    return 
}

module.exports = courseStudentList

