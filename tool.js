token_list = {
	"student": {
		"id": 0, 
		"role":"student",
		"name":"student"
	},
	"professor": {
		"id": 99990000, 
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
var start_time = ""
var end_time = ""
var sys_name = ""
var sys_state = 0

function sys_init() {
	var fs = require('fs')
	var sys_config_path = './sys_config.json'
	var sys_config_data = fs.readFileSync(sys_config_path)
	sys_config_data = JSON.parse(sys_config_data)

	sys_semester = sys_config_data.semester
	start_time = sys_config_data.start_time
	end_time = sys_config_data.end_time
	sys_name = sys_config_data.sys_name	
	sys_state = sys_config_data.state	
}

function get_sys_info() {
	return [sys_semester, start_time, end_time, sys_name, sys_state]
}

function check_time(selectList, nowList) {
	function check(a, b) {
		a = parseInt(Number(a), 2)
		b = parseInt(Number(b), 2)
		return a & b
	}
	function check_single(a, b) {
		if(check(a.monday, b.monday) > 0) return false
		if(check(a.tuesday, b.tuesday) > 0) return false
		if(check(a.wednesday, b.wednesday) > 0) return false
		if(check(a.thursday, b.thursday) > 0) return false
		if(check(a.friday, b.friday) > 0) return false
		if(check(a.saturday, b.saturday) > 0) return false
		if(check(a.sunday, b.sunday) > 0) return false
		return true
	}
	rel = []
	for (x in selectList) {
		for (y in nowList) {
			if(check_single(selectList[x], nowList[y]) == false) 
				rel.push([selectList[x].cid, nowList[y].cid])
		}
	}
	console.log(rel)
	if (rel.length > 0) return {"re": false, "rel": rel}
	return {"re": true, "rel": []}
}

function sys_if() {
	return sys_state
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
	"start_time": start_time,
	"end_time": end_time,
	"sys_name": sys_name,
	"get_sys_info": get_sys_info,
	"check_time": check_time,
	"sys_if": sys_if,
}