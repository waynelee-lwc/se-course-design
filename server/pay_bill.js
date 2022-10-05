var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
var fs = require('fs')

async function payBill(req,res) {
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

    sql = mysql.format("update bills set paid = 1 where sid = ?",id)
    let result = await query(sql)

    console.log(result)
    res.send({
        "message": "",
        "code": 200,
        "data":result
    })
    res.end()
}

module.exports = payBill