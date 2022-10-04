var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
var fs = require('fs')

async function closeRegister(req,res) {
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
    var sql = "", result = "",ls = tool.get_sys_info() 

    // 检查是否在注册
    // res.send({
    //     "message": "关闭失败",
    //     "code":200
    // })

    sql = mysql.format("select * from course_professor_timeslot where semester = ? ", [ls[0]])
    result = await query(sql)


    // 对每门课程检查是否有教授, 并且有3个学生
    // 
    return 
}

module.exports = closeRegister