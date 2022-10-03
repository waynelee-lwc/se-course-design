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
	}
}

function get_role_info(role) {
	if (role == 2 || role == "student") {
		return ["student", "SID"]
	}
	if (role == 1 || role == "professor") {
		return ["professor", "PID"]
	}
	if (role == 0 || role == "registrar") {
		return ["registrar", "RID"]
	}
	return [null, null]
}

function token_analysis(token) {
	let data = token_list[token]
	let _, kid = get_role_info(data.role)
	return data.id, data.role, data.name, kid
}

module.exports = {
	"token_list": token_list,
	"get_role_info": get_role_info,
	"token_analysis": token_analysis
}