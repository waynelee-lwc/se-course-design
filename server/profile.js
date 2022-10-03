var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function profile(req,res){
    var data = req.body
    var token = req.headers.token
    
    var id, role, name, kid= tool.token_analysis(token)

    var sql = mysql.format('select * from ' +  role + ' where ' + kid + ' = ?', id)
    console.log(sql)

    var result = await query(sql)
    var resp = {
    	"message": "",
    	"code": 200	
    }
    
    if(result.length == 0) {
    	res.send({
			"message": "用户不存在",
    		"code": 400	
    	})
        return 
    }
    
    result = result[0]
    console.log(result)
    
    res.send({
    	"message": "获取成功",
    	"code": 200,
    	"data": {
    		"token": token,
    	}
    })
   	res.end()
    return 
}

module.exports = profile