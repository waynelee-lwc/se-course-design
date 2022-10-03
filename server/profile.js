var mysql = require('mysql')
var query = require('../db.js')
var tool = require('../tool.js')
const random_string = require('string-random')

async function profile(req,res){
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
    var sql = mysql.format('select * from ' +  role + ' where ' + kid + ' = ?', id)

    var result = await query(sql)
    
    if(result.length == 0) {
    	res.send({
			"message": "用户不存在",
    		"code": 400	
    	})
        return 
    }
    
    result = result[0]
    res.send({
    	"message": "获取成功",
    	"code": 200,
    	"data": {
            "name": result.name,
            "id": tool.new_id(id),
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