var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function teach(req,res) {
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
            "message": "token 错误",
            "code": 400 
        })
        return
    }
    var id = tmp[0], role = tmp[1], name = tmp[2], kid = tmp[3] 
        if (role != "professor") {
        res.send({
            "message": "您没有教课权限",
            "code": 400 
        })
        return
    }

    var sql = "", result = "", ls = tool.get_sys_info()  

    sql = mysql.format("select * from course_professor_timeslot where pid = ? and semester = ? ", [id, ls[0]])
    result = await query(sql)
    // console.log(sql + '\n' + result)
    if (result.status == 0) { 
        res.send({ "message": result.msg, "code": 400}); 
        return;
    }
    
    selectList = JSON.parse(JSON.stringify(result))

    sql = mysql.format("select * from course_professor_timeslot where cid = ? and semester = ? ", [data.id, ls[0]])
    result = await query(sql)
    // console.log(sql + '\n' + result)
    
    result = JSON.parse(JSON.stringify(result))
    now_course = result[0]

    check_result = tool.check_time(selectList, [now_course])
    
    if (!check_result.re) {
        res.send({
            "message": "任教失败，时间冲突",
            "code": 400,
            "data": check_result.rel
        })
        return 
    }

    sql = mysql.format("insert into teach(pid, cid) values (?, ?)", [id, data.id])
    result = await query(sql)

    res.send({
        "message": "任教成功",
        "code":200
    })
    return 
}
module.exports = teach
