var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function submitSchedule(req,res){
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

    var courseList = data.course_list
    var id = tmp[0], role = tmp[1], name = tmp[2], kid = tmp[3] 
    var sql = "", result = "", data = "", ls = tool.get_sys_info() 
    
    sql = mysql.format("select * from course_schedule_timeslot where sid = ? and semester = ? ", [id, ls[0]])
    result = await query(sql)
    result = JSON.parse(JSON.stringify(result))
    
    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }
    
    res.send({
        "message": "提交成功",
        "code": 200,
        "data": result
    })
    res.end()
    return 
}
module.exports = submitSchedule