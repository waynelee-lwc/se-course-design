var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function getSchedule(req,res){
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

    console.log(tmp)
    var id = tmp[0], role = tmp[1], name = tmp[2], kid = tmp[3] 
    var sql = mysql.format("select count(*) from schedule where schedule.sid = ? ", [id])
    var result = await query(sql)
    
    console.log(sql)
    console.log(result)

    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400,
            "data": null, 
        })
        return
    }

    result = JSON.parse(JSON.stringify(result))
    if (result[0]["count(*)"] == 0) {
        res.send({
            "message": "不存在schedule",
            "code": 400,
            "data": null, 
        })
        return
    }

    sql = mysql.format("select * " + 
        " from course join course_schedule on course.cid = course_schedule.cid " + 
                    " join time_slot on course.tsid = time_slot.tsid " +
                    " join schedule on schedule.sche_id = course_schedule.sche_id " + 
        " where schedule.sid = ? ", [id])
    result = await query(sql)
    // console.log(sql)
    // console.log(result)

    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    result = JSON.parse(JSON.stringify(result))
    res.send({
        "message": "获取成功",
        "code": 200,
        "data": result
    })
    res.end()
    return 
}
module.exports = getSchedule