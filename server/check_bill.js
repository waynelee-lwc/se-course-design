var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
var fs = require('fs')

async function checkBill(req,res) {
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

    sql = mysql.format("select * from bills where sid = ?",id)
    let result = await query(sql)
    
    res.send({
        "message": "",
        "code": 200,
        "data":result
    })
    res.end()
}

module.exports = checkBill