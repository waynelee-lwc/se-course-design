token_list = {
	"student": {
		"id": 0, 
		"role":"student",
		"name":"student"
	},
	"professor": {
		"id": 0, 
		"role":"professor",
		"name":"professor"
	},
	"registrar": {
		"id": 0,
		"role":"registrar",
		"name":"registrar"
	},
	"I0JRXQ82Cn3py612": {
		"id": 1,
		"role": "student",
		"name": "stu1"
	},
	"student3": {
		"id": 21190000,
		"role": "student",
		"name": "stu1"
	}
}

function get_role_info(role) {
	if (role == 2 || role == "student") {
		return ["student", "sid"]
	}
	if (role == 1 || role == "professor") {
		return ["professor", "pid"]
	}
	if (role == 0 || role == "registrar") {
		return ["registrar", "rid"]
	}
	return [null, null]
}

function token_analysis(token) {
	let data = token_list[token]
	if (data == undefined) {
		return "failed"
	}
	let tmp = get_role_info(data.role)
	let kid = tmp[1]
	return [data.id, data.role, data.name, kid]
}

function new_stu_id(id) {
	return "CS" + id.toString().padStart(8, '0') 
}

function new_pro_id(dept, id) {
	return dept + id.toString().padStart(8, '0')
}

function old_stu_id(id) {
	let len = id.length
	return Number(id.substring(2, len)) 
}

// console.log(old_stu_id("CS21191511"))

function old_pro_id(id) {
	let len = id.length
	return Number(id.substring(len-8, len)) 	
}

var sys_semester = 45

function sys_init() {
	var fs = require('fs')
	var sys_config_path = './sys_config.json'
	var sys_config_data = fs.readFileSync(sys_config_path)
	sys_config_data = JSON.parse(sys_config_data)

	sys_semester = sys_config_data.semester
}

module.exports = {
	"token_list": token_list,
	"get_role_info": get_role_info,
	"token_analysis": token_analysis,
	"new_stu_id": new_stu_id,
	"new_pro_id": new_pro_id,
	"old_stu_id": old_stu_id,
	"old_pro_id": old_pro_id,
	"sys_semester": sys_semester,
	"sys_init": sys_init,
}