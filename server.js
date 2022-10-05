var express = require('express')
var bodyParser = require('body-parser')
var multiparty = require('connect-multiparty')
var cors = require('cors')
var tool = require('./tool.js')
const checkBill = require('./server/check_bill.js')

let app = express()
app.use(cors())
app.use('/',express.static('./static'))

//处理 x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended:true
}));

//处理 application/json
app.use(bodyParser.json())

//处理 mutipart/form-data
app.use(multiparty())

app.get('/hello',(req,res)=>{
    res.end('hello world')
})

// 登录接口
login = require('./server/login.js')
app.post('/login', login)

profile = require('./server/profile.js')
app.get('/profile', profile)

addStudent = require('./server/add_student.js')
app.post('/addStudent', addStudent)

addProfessor = require('./server/add_professor.js')
app.post('/addProfessor', addProfessor)

updateStudent = require('./server/update_student.js')
app.post('/updateStudent', updateStudent)

updateProfessor = require('./server/update_professor.js')
app.post('/updateProfessor', updateProfessor)

deleteStudent = require('./server/delete_student.js')
app.post('/deleteStudent', deleteStudent)

deleteProfessor = require('./server/delete_professor.js')
app.post('/deleteProfessor', deleteProfessor)

getStudents = require('./server/get_students.js')
app.get('/studentList', getStudents)

getProfessors = require('./server/get_professors.js')
app.get('/professorList', getProfessors)

addSchedule = require('./server/add_schedule.js')
app.post('/addSchedule', addSchedule)

getSchedule = require('./server/get_schedule.js')
app.get('/getSchedule', getSchedule)

saveSchedule = require('./server/save_schedule.js')
app.post('/saveSchedule', saveSchedule)

deleteSchedule = require('./server/delete_schedule.js')
app.post('/deleteSchedule', deleteSchedule)

submitSchedule = require('./server/submit_schedule.js')
app.post('/submitSchedule', submitSchedule)

getStuCourses = require('./server/get_stuCourses.js')
app.get('/getStuCourses', getStuCourses) 

getProCourses = require('./server/get_proCourses.js')
app.get('/getProCourses', getProCourses) 

selectedProCourses = require('./server/selected_proCourses.js')
app.get('/selectedProCourses', selectedProCourses)

courseStudentList = require('./server/courseStudentList.js')
app.get('/courseStudentList', courseStudentList)

getGrades = require('./server/get_grades.js')
app.get('/getGrades', getGrades)

setGrades = require('./server/set_grades.js')
app.post('/setGrades', setGrades)

openRegister = require('./server/open_register.js')
app.post('/openRegister', openRegister)

getSysStatus = require('./server/get_sysStatus.js')
app.get('/getSysStatus', getSysStatus)

closeRegister = require('./server/close_register.js')
app.post('/closeRegister', closeRegister)

teach = require('./server/teach.js')
app.post('/teach', teach)

tool.sys_init()

let server = app.listen(3012,()=>{
    console.log('The server is listening on port : 3012')
})

//账单系统
let bill = express()
bill.use(cors())
bill.use('/',express.static('./static'))

//处理 x-www-form-urlencoded
bill.use(bodyParser.urlencoded({
    extended:true
}));

//处理 application/json
bill.use(bodyParser.json())

//处理 mutipart/form-data
bill.use(multiparty())

bill.get('/checkBill',require('./server/check_bill.js'))

bill.post('/payBill',require('./server/pay_bill.js'))

let server2 = bill.listen(3013,()=>{
    console.log('The bill system is listening on port : 3013')
})


