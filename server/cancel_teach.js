var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function cancel_teach(req,res) {
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
            "message": "您没有取消任教权限",
            "code": 400 
        })
        return
    }

    var sql = "", result = "", ls = tool.get_sys_info()  
    sql = mysql.format("delete from teach where pid = ? and cid = ? ", [id, data.cid])
    result = await query(sql)

    res.send({
        "message": "取消任教成功",
        "code":200
    })
    return 
}
module.exports = cancel_teach
