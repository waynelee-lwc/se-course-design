var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function saveSchedule(req,res){
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
    var sql = mysql.format("", [id])

    var result = await query(sql)
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
        "message": "保存成功",
        "code": 200,
        "data": result
    })
    res.end()
    return 
}
module.exports = saveSchedule