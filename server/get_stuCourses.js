var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function getStuCourses(req,res){
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
    var sql = mysql.format(`select * 
                from (select cid, count(sche_id) as stu_num 
                from course_schedule 
                where state = 1 
                group by cid) as tmp 
                join course on course.cid = tmp.cid
                join time_slot on time_slot.tsid = course.tsid 
                left join (select cid as teach_cid , pid from teach ) as tt on tt.teach_cid = course.cid 
                left join (select name as professor_name, pid from professor) as professor on professor.pid = tt.pid`)

    var result = await query(sql)
    // console.log(sql, '\n', result)

    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    result = JSON.parse(JSON.stringify(result))
    for (let x in result) {
        if (result[x].stu_num == null) 
            result[x].stu_num = 0
    }
    res.send({
        "message": "查询成功",
        "code": 200,
        "data": result
    })
    res.end()
    return 
}
module.exports = getStuCourses