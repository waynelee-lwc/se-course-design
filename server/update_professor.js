var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
async function update_professor(req,res) {
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
    if (role != "registrar") {
        res.send({
            "message": "您没有管理权限",
            "code": 400 
        })
        return
    }
    
    var sql = mysql.format("update professor set name = ?, dept = ?, birthday = ?, status = ?, ssn = ? where pid = ?",
        [data.name, data.dept, data.birthday, data.status, data.ssn, tool.old_pro_id(data.id)])


    var result = await query(sql)
    if (result.status == 0) {
        res.send({
            "message": result.msg,
            "code": 400 
        })
        return
    }

    res.send({
        "message": "修改成功",
        "code":200
    })

    res.end()
    return 
}
module.exports = update_professor
