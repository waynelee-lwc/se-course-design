document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
    // console.log("当前尺寸为：" + window.innerWidth);
    document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}
let address = 'http://www.wayne-lee.cn:3012'


$(document).ready(()=>{
    let token = JSON.parse(localStorage.getItem('pro-token'))
    if(!token){
        alert('please login!')
        location.href('/index.html')
    }

    
    //system status
    systemStatus()

    //init schedule sheet
    initCurrTable()
    initHistoryTable()
    refreshView()

    //profile
    setProfile()

    //courseTaken
    courseTaken()

    //courseAvailableList
    courseAvailableList()

    // //选课列表
    // reloadTakable()
    // //历史任课
    // loadSchedule()
    // //登分列表
    // loadScoreList()
    // //学期列表
    // loadSemesters()
})


let sysstat = {}
function systemStatus(){
    $.ajax({
        url:`${address}/getSysStatus`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        success:(res)=>{
            console.log(res)
            if(res.code == 200){
                $('.registration').empty()
                $('.registration').append($(`
                <ul>
                    <li class="userinfo-item">Registration &nbsp;&nbsp; <br><b>${res.data.sys_name}</b></li>
                    <li class="userinfo-item">Begin &nbsp;&nbsp;<b>${res.data.start_time}</b></li>
                    <li class="userinfo-item">End &nbsp;&nbsp;<b>${res.data.end_time}</b></li>
                    <li class="userinfo-item">State &nbsp;&nbsp;<b>${res.data.state == 0 ? 'Off' : 'On'}</b></li>
                </ul>
                `))
                sysstat = res.data
            }
        }
    })
}

let availableCourseList = []
function courseAvailableList(){
    $.ajax({
        url:`${address}/getProCourses`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        success:(res)=>{
            if(res.code == 200){
                availableCourseList = []
                $('.section-table tbody').empty()
                let list = res.data
                for(let item of list){
                    availableCourseList.push(item)
                    $('.section-table tbody').append($(`
                        <tr id="course-entry-${item.cid}" class="course-entry">
                            <td>${item.cid}</td>
                            <td>${item.name}</td>
                            <td>${item.dept}</td>
                            <td>${item.professor_name == null ? 'no professor' : item.professor_name}</td>
                            <td>${item.credit}</td>
                            <td>${10 - item.stu_num}</td>
                            <td>10</td>
                            <td>${item.price}$</td>
                            <td>${item.professor_name == null ? 'Teachable' : 'Unteachable'}</td>
                            <td><button id="course-teach-${item.cid}" class="btn btn-success course-teach" ${item.professor_name == null && sysstat.state == 1 ? '' : 'disabled'}>Teach</button></td>
                        </tr>
                    `))
                }
                $('.course-teach').click(teachCourse)

                $('.course-entry').on('mouseover',function(){
                    let id = $(this).attr('id').split('-')[2]

                    for(let item of availableCourseList){
                        if(item.cid == id){
                            setCurrTable(parseSchedule(item))
                        }
                    }
                    refreshView()
                })
                $('.course-entry').on('mouseout',function(){
                    let id = $(this).attr('id').split('-')[2]

                    for(let item of availableCourseList){
                        if(item.cid == id){
                            unsetCurrTable(parseSchedule(item))
                        }
                    }
                    refreshView()
                })

            }else{
                // alert(`get course list failed! ${res.message}`)
            }
        }
    })
}

function teachCourse(){
    let id = $(this).attr('id').split('-')[2]
    if(!confirm(`sure to teach the course ${id}?`)){
        return
    }
    $.ajax({
        url:`${address}/teach`,
        type:'post',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        data:{
            id:id
        },
        success:(res)=>{
            if(res.code == 200){
                alert('successfully!')

                courseAvailableList()
                courseTaken()
            }else{
                alert(`failed ${res.message}`)
            }
        }
    })
}

let selectedCourse = []
function courseTaken(){
    $.ajax({
        url:`${address}/selectedProCourses`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        success:(res)=>{
            if(res.code == 200){
                let list = res.data
                initCurrTable()
                initHistoryTable()
                $('.score-table tbody').empty()
                selectedCourse = []
                for(let item of list){
                    setHistoryTable(parseSchedule(item))
                    selectedCourse.push(item)

                    $('.score-table tbody').append($(`
                        <tr>
                            <td>${item.cid}</td>
                            <td>${item.name}</td>
                            <td>${item.dept}</td>
                            <td>${item.price}$</td>
                            <td>${item.credit}</td>
                            <td>${item.stu_num_accepted}</td>
                            <td>Available</td>
                            <td><button ${(sysstat.state == 1) ? '' : 'disabled'} class="btn btn-warning course-cancel" id="course-cancel-${item.cid}">Cancel</button></td>
                            <td><button ${(sysstat.state == 0) ? '' : 'disabled'} class="btn btn-success course-grade" id="course-grade-${item.cid}">Set Grades</button></td>
                        </tr>
                    `))
                }
                refreshView()
                $('.course-grade').click(courseSetGrade)
                $('.course-cancel').click(courseCancel)
            }else{
                // alert(`load selected courses failed! ${res.message}`)
            }
        }
    })
}

function courseCancel(){
    let id = $(this).attr('id').split('-')[2]
    id = Number.parseInt(id)
    if(!confirm(`sure to cancel this course? ${id}`)){
        return
    }

    $.ajax({
        url:`${address}/cancelTeach`,
        type:'post',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        data:{
            cid:id
        },
        success:(res)=>{
            if(res.code == 200){
                alert('successfully!')
                courseTaken()
            }else{
                alert(`failed! ${res.message}`)
            }
        }
    })        
}

function courseSetGrade(){
    let id = $(this).attr('id').split('-')[2]
    id = Number.parseInt(id)

    $.ajax({
        url:`${address}/courseStudentList`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        data:{
            id:id
        },
        success:(res)=>{
            if(res.code == 200){
                $('.grade-table tbody').empty()

                for(let item of res.data){
                    // console.log(item)
                    $('.grade-table tbody').append($(`
                    <tr>
                        <td>${item.sid}</td>
                        <td>${item.name}</td>
                        <td><input type="number" value="${item.grades}" id="stu-grade-${item.sid}"></td>
                        <td><button class="btn btn-primary submit-grade" id="submit-grade-${item.sid}-${id}">update</button></td>
                    </tr>
                    `))
                }

                $('.submit-grade').click(submitGrade)
                showGrade()
            }else{
                alert(`fetch student list failed! ${res.message}`)
            }
        }

    })


}

function submitGrade(){
    let id = $(this).attr('id').split('-')[2]
    let cid = $(this).attr('id').split('-')[3]
    let val = $(`#stu-grade-${id}`).val()

    if(val < 0 || val > 100){
        alert('invaild grade!',val)
        return
    }
    $.ajax({
        url:`${address}/setGrades`,
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        type:'post',
        data:{
            sid:id,
            cid:cid,
            grades:val
        },
        success:(res)=>{
            if(res.code == 200){
                alert('successfully!')
                
                $.ajax({
                    url:`${address}/courseStudentList`,
                    type:'get',
                    headers:{
                        'token':JSON.parse(localStorage.getItem('pro-token')),
                    },
                    data:{
                        id:cid
                    },
                    success:(res)=>{
                        if(res.code == 200){
                            $('.grade-table tbody').empty()
            
                            for(let item of res.data){
                                $('.grade-table tbody').append($(`
                                <tr>
                                    <td>${item.sid}</td>
                                    <td>${item.name}</td>
                                    <td><input type="number" value="${item.grades}" id="stu-grade-${item.sid}"></td>
                                    <td><button class="btn btn-primary submit-grade" id="submit-grade-${item.sid}-${id}">update</button></td>
                                </tr>
                                `))
                            }
            
                            $('.submit-grade').click(submitGrade)
                            showGrade()
                        }else{
                            alert(`fetch student list failed! ${res.message}`)
                        }
                    }
            
                })

            }else{
                alert(`failed! ${res.message}`)
            }
        }
    })
}

function setProfile(){
    $.ajax({
        url:`${address}/profile`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('pro-token')),
        },
        success:function(res){
            if(res.code != 200){
                alert(`please login!`)
                location.href = '/index.html'
            }
            user = res.data
            $('.userinfo ul').empty()
            $('.userinfo ul').append($(`
                <li class="userinfo-item">ID &nbsp;&nbsp;<b>${user.id}</b></li>
                <li class="userinfo-item">Name &nbsp;&nbsp;<b>${user.name}</b></li>
                <li class="userinfo-item">BirthDay&nbsp;&nbsp;<b>${user.birthday}</b></li>
                <li class="userinfo-item">Graduation&nbsp;&nbsp;<b>${user.dept}</b></li>
                <li class="userinfo-item">SSN&nbsp;&nbsp;<b>${user.ssn}</b></li>
            `))
        }
    })
}

$('.cross').click(hideShadow)

let scoreList = []
function loadScoreList(){
    $.ajax({
        url:`${address}/teacher/get_score_list`,
        type:'get',
        headers:{
            token:JSON.parse(localStorage.getItem('pro-token'))
            // token:'teacher'
        },
        success:function(res){
            console.log(res)
            if(res.code != 200){
                alert(res.message)
            }else{
                scoreList = res.data
                $('.score-table tbody').empty()
                for(let idx in res.data){
                    sec = res.data[idx]
                    $('.score-table tbody').append(
                        $(`
                        <tr>
                            <td>${sec.course_id}</td>
                            <td>${sec.sec_id}</td>
                            <td>${sec.title}</td>
                            <td>${sec.course_type}</td>
                            <td>${sec.dept_name}</td>
                            <td>${sec.credits}</td>
                            <td>${sec.year} ${sec.semester}</td>
                            <td>${sec.status == 4 ? '可登分' : '已结束'}</td>
                            <td><button class="btn btn-${sec.status == 4 ? 'success' : 'danger'} set-grade" id="${idx}-${sec.sec_id}">${sec.status == 4 ? '登分' : '查分'}</button></td>
                        </tr>
                        `)
                    )
                }
                $('.set-grade').click(setGrade)
            }
        }
    })
}

function setGrade(){
    let id = $(this).attr('id')
    let idx = id.split('-')[0]
    let sec_id = id.split('-')[1]
    let sec = scoreList[idx]

    $('.grade-title').empty()
    $('.grade-title').append($(`
        <div class="name">${sec.title}</div>
        <div class="type">${sec.course_type}</div>
        <div class="dept">${sec.dept_name}</div>
        <div class="semester">${sec.year} ${sec.semester}</div>
    `))

    $('.grade-panel').empty()
    $('.grade-panel').append($(`
        <div class="building">教学楼:<b>${sec.building}</b></div>
        <div class="classroom">教室:<b>${sec.room_number}</b></div>
    `))

    loadGradeList(sec,sec_id)
}

function loadGradeList(sec,sec_id){
    $.ajax({
        url:`${address}/teacher/take_score_list`,
        type:'get',
        headers:{
            token:JSON.parse(localStorage.getItem('pro-token'))
            // token:'teacher'
        },
        data:{
            sec_id:sec_id
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                console.log(res.data)
                $('.grade-table tbody').empty()
                for(student of res.data){
                    $('.grade-table tbody').append($(`
                        <tr>
                            <td>${student.SID}</td>
                            <td>${student.name}</td>
                            <td><input type="number" value="${Number.parseInt(student.grade)}" id="grade-${sec_id}-${student.SID}"></td>
                            <td><button class="btn btn-primary upload-score" ${sec.status == 4 ? '' : 'disabled'} id="${sec_id}-${student.SID}">修改</button></td>
                        </tr>
                    `))
                }
                hideShadow()
                showGrade()
                $('.upload-score').click(setStudentGrade)
            }
        }
    })
}

function hideShadow(){
    $('.shadow').hide()
    $('.schedule').hide()
    $('.grade').hide()
}

function showSchedule(){
    $('.shadow').show()
    $('.schedule').show()
}

function showGrade(){
    $('.shadow').show()
    $('.grade').show()
}

function setStudentGrade(){
    let id = $(this).attr('id')
    let sec_id = id.split('-')[0]
    let SID = id.split('-')[1]
    let grade = $(`#grade-${sec_id}-${SID}`).val()

    $.ajax({
        url:`${address}/teacher/set_score`,
        type:'post',
        data:{
            sec_id:sec_id,
            SID:SID,
            grade:grade
        },
        headers:{
            token:JSON.parse(localStorage.getItem('pro-token'))
            // token:'teacher'
        },
        success:function(res){
            if(res.code == 200){
                alert('录入成绩成功!')
                loadGradeList()
            }else{
                alert(res.message)
            }
        }
    })
}