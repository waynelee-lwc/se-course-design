var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function getGrades(req,res){
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

    var sql = mysql.format(" SELECT tmp.cid,    dept,   grades,     name,   professor_name  FROM    student_course  JOIN course ON course.cid = student_course.cid  JOIN ( SELECT cid, NAME AS professor_name FROM teach JOIN professor ON professor.pid = teach.pid ) AS tmp ON tmp.cid = student_course.cid where sid = ? and course.semester = ? ", [id, tool.sys_semester])
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
        "message": "查询成功",
        "code":200,
        "data": result
    })
   	res.end()
    return 
}

module.exports = getGrades

