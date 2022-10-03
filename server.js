var express = require('express')
var bodyParser = require('body-parser')
var multiparty = require('connect-multiparty')
var cors = require('cors')

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

// getSchedule = require('./server/get_schedule.js')
// app.get('/getSchedule', getSchedule)

// saveSchedule = require('./server/save_schedule.js')
// app.post('/saveSchedule', saveSchedule)

// submitSchedule = require('./server/submit_schedule.js')
// app.post('/saveSchedule', submitSchedule)


let server = app.listen(3012,()=>{
    console.log('The server is listening on port : 3012')
})