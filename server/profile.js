var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function profile(req,res){
    var data = req.body
    var token = req.headers.token
    console.log(token)
    var tmp = tool.token_analysis(token)
    var id = tmp[0], role = tmp[1], name = tmp[2], kid = tmp[3] 

    var sql = mysql.format('select * from ' +  role + ' where ' + kid + ' = ?', id)

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
            "name": result.name,
            "id": result.id,
            "role": role,
            "dept": result.dept,
            "birthday": result.birthday,
            "status": result.status,
            "ssn": result.ssn
    	}
    })
   	res.end()
    return 
}

module.exports = profile