var fs = require('fs')
var mysql = require('mysql')
var db_config_path = './db_config.json'
var db_config_data = fs.readFileSync(db_config_path)
db_config_data = JSON.parse(db_config_data)
const pool = mysql.createPool(db_config_data)

async function query(sql, values) {
	console.log("sql: ", sql)
  	// 返回一个 Promise
 	return new Promise(( resolve, reject ) => {
		pool.getConnection(function(err, connection) {
	    	if (err) {
				reject(err)
	    	} else {
 	    	 	connection.query(sql, values, (err, rows) => {
	        	if (err) {
	        	  	resolve({status: 0, msg: err.sqlMessage})	        	
	        	  } else {
	        	  	resolve(rows)
	        	}
        	// 结束会话
        	connection.release()
	        })
	      }
	    })
	  })
}
module.exports = query