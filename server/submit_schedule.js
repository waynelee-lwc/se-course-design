var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function submitSchedule(req,res){
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
    var sql = "", result = "", data = "", ls = tool.get_sys_info() 
    
    sql = mysql.format(" select * from schedule " + 
                        " join course_schedule on schedule.sche_id = course_schedule.sche_id" + 
                        " join course on course.cid = course_schedule.cid " + 
                        " join time_slot on course.tsid = time_slot.tsid " + 
                        " where sid = ? and course.semester = ?", [id, ls[0]])

    result = await query(sql)
        
    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }
    

    oL = []
    wL = []
    for (let x in result) {
        if(result[x].type != 0) continue
        if(result[x].state == 0) wL.push(result[x])
        if(result[x].state == 1) oL.push(result[x])
    }

    final_result = []
    fix_result = []
    for (let x in wL) {
        let check_result = tool.check_time(oL, [wL[x]])
        sql = mysql.format("select stu_num from course_professor_timeslot where cid = ? and semester = ?", [wL[x].cid, ls[0]])
        result = await query(sql)
        result = JSON.parse(JSON.stringify(result))
        if(result[0].stu_num >= 10) {
            fix_result.push(wL[x].cid)
            continue
        }
        if(!check_result.re) {
            final_result.push(check_result.rel)
        } else {
            oL.push(wL[x])
            sql = mysql.format("update course_schedule set state = ? where sche_id = ? and cid = ? and type = ? ", [1, wL[x].sche_id, wL[x].cid, wL[x].type])
            result = await query(sql)
        }
    }

    res.send({
        "message": "提交成功",
        "code": 200,
        "data": [final_result, fix_result]
    })
    res.end()
    return 
}
module.exports = submitSchedule