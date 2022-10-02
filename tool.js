token_list = {
	"student": {
		"id":"00128", 
		"role":"student"
	},
	"professor": {
		"id":"10101", 
		"role":"professor"
	},
	"registrar": {
		"id":"123",
		"role":"registrar"
	}
}

function get_role_info(role) {
	if (role == 2 || role == "student") {
		return ["student", "SID"]
	}
	if (role == 1 || role == "p") {
		return ["professor", "PID"]
	}
	if (role == 0 || role == "admin") {
		return ["registrar", "RID"]
	}
	return [null, null]
}

module.exports = {
	"token_list": token_list,
	"get_role_info": get_role_info
}