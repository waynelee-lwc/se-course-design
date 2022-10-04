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

    sql = mysql.format("select * from course_professor_timeslot where semester = ?", [ls[0]])
    result = await query(sql)
    result = JSON.parse(JSON.stringify(result))
    
    exL = []
    scheL = new Set([])
    for (let x in result) {
        if (result[x].pid == null) {
            // sql = mysql.format("delete from course_schedule where cid = ?", [result[x].cid])
            // _ = await query(sql)
            console.log(result[x].cid)
            continue
        }
        scheL.add(result[x].sche_id)
        exL.push(result[x])
    }

    for (let y in scheL) {
        oL = []
        wL = []
        ex_one = null
        ex_two = null
        for (let x in exL) {
            if(exL[x].sche_id == scheL[y]) {
                if(exL[x].type == 1) ex_one = exL[x]       
                else if(exL[x].type == 2) ex_two = exL[x]
                else if(exL[x].state == 0) wL.push(exL[x])
                else if(exL[x].state == 1) oL.push(exL[x])
            }
        }   
        for (let x in wL) {
            
        }
    }

    // 对每门课程检查是否有教授, 并且有3个学生
    // 
    return 
}

module.exports = closeRegister