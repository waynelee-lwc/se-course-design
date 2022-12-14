var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function saveSchedule(req,res){
    if (tool.sys_if() == 0) {
        res.send({
            "message": "未开放注册",
            "code": 400 
        })
        return
    }
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
    var sql = ""
    var result = ""
    
    sql = mysql.format("select * from schedule where sid = ? ", [id])
    result = await query(sql)
    // console.log(sql, '\n', result)

    result = JSON.parse(JSON.stringify(result))
    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }
    var sche_id = result[0].sche_id

    if (result.length > 0) {
        sql = mysql.format("delete from course_schedule where sche_id = ? ", [result[0].sche_id])
        result = await query(sql)
        console.log(sql, '\n', result)
    }
    // console.log(courseList)

    if (courseList.length == 0 ) {
        res.send({
            "message": "保存成功",
            "code": 200,
            "data": result
        })  
        return 
    }

    sql = "insert into course_schedule(sche_id, cid, state, type ) values "
    for (let x in courseList) {
        if (x > 0) {
            sql += " , "
        } 
        sql += mysql.format("(?,?,?,?) \n ", [sche_id, courseList[x].cid, courseList[x].state, courseList[x].type])
    } 

    // console.log(sql)
    result = await query(sql)

    result = JSON.parse(JSON.stringify(result))
    res.send({
        "message": "保存成功",
        "code": 200,
        "data": result
    })
    res.end()
    return 
}
module.exports = saveSchedule