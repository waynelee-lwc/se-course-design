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
    var sql = "", result = "",ls = tool.get_sys_info(), oL = "", wL = "", scheL = "", exL = ""

    // await query("start transaction;")

    sql = mysql.format("select * from course_professor_timeslot join course_schedule on course_schedule.cid = course_professor_timeslot.cid join schedule on schedule.sche_id = course_schedule.sche_id where schedule.semester = ?", [ls[0]])
    result = await query(sql)
    result = JSON.parse(JSON.stringify(result))
    
    // console.log(sql, result)
    exL = []
    scheL = new Set([])
    for (let x in result) {
        if (result[x].pid == null) {
            sql = mysql.format("delete from course_schedule where cid = ?", [result[x].cid])
            result = await query(sql)
            // console.log(result[x], result[x].cid)
            continue
        }
        scheL.add(result[x].sche_id)
        exL.push(result[x])
    }
    // console.log("scheL:", scheL)
    // console.log("exL:", exL)

    var final_result = []
    scheL = Array.from(scheL)

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
        
        if (ex_one != null) wL.push(ex_one)
        if (ex_two != null) wL.push(ex_two)
        
        // console.log("oL: ", oL, "wL: ", wL)

        for (let x in wL) {
            if(oL.length == 4) break
            sql = mysql.format("select stu_num from course_professor_timeslot where cid = ? and semester = ?", [wL[x].cid, ls[0]])
            result = await query(sql)
            result = JSON.parse(JSON.stringify(result))
            if(result[0].stu_num >= 10) continue

            let check_result = tool.check_time(oL, [wL[x]])
            if(check_result.re)  {
                oL.push(wL[x])
                sql = mysql.format("update course_schedule set state = ? where sche_id = ? and cid = ? and type = ? ", [1, wL[x].sche_id, wL[x].cid, wL[x].type])
                _ = await query(sql)
            }
            else {
                console.log(check_result.rel)
            }
        }
        for (let x in oL) {
            final_result.push(oL[x])
        }
    }

    // console.log("final_result", final_result)
    sql = mysql.format("select * from course_professor_timeslot where semester = ?", [ls[0]])
    result = await query(sql)
    result = JSON.parse(JSON.stringify(result))

    for (let x in result) {
        if (result[x].stu_num < 0) {
            sql = mysql.format("delete from course_schedule where cid = ?", [result[x].cid])
            let re = await query(sql)
            console.log(result[x].cid)
        }
    }

    if (final_result.length == 0) {
        res.send({
            "message": "关闭成功, oL.length = 0",
            "code":200
        })
        return 
    }
    sql = mysql.format("delete from student_course where semester = ? ", [ls[0]] )
    result = await query(sql)

    sql = mysql.format("insert into student_course (sid, cid, grades, semester) values " )
    for (let x in final_result) {
        if (x > 0) sql += " , "
        sql += mysql.format(" (?, ?, ?, ?) ", [final_result[x].sid, final_result[x].cid, 0, ls[0]])
    }
    // console.log(sql)
    result = await query(sql)
    result = JSON.parse(JSON.stringify(result))
    //更新bill表
    sql = mysql.format(`
        DELETE 
        FROM
            bills 
        WHERE
            semester = ?
    `,45)
    result = await query(sql)

    sql = mysql.format(`
        INSERT INTO bills SELECT
        sid,
        max( a.semester ) AS semester,
        sum( price ) AS tot_price,
        count( a.cid ) AS course_count,
        0 AS paid 
        FROM
            student_course a
            LEFT JOIN course b ON a.cid = b.cid 
        WHERE
            a.semester = ? 
        GROUP BY
            sid
    `,45)
    result = await query(sql)
    // await query("commit;")

    fs.writeFileSync('./sys_config.json', 
        JSON.stringify({"semester":"45", "start_time":"--", "end_time":"--", "sys_name":"welcome", "state": 0}))
    tool.sys_init()
    res.send({
        "message": "关闭成功",
        "code":200,
        "data": result
    })
    return 
}

module.exports = closeRegister