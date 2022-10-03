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

let server = app.listen(3012,()=>{
    console.log('The server is listening on port : 3012')
})

