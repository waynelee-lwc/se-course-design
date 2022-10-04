document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

initCurrTable()
initHistoryTable()
refreshView()
$('.schetab-cell').click(function(e){
    let id = $(this).attr('id')
    alert(id)
})

let address = 'http://www.wayne-lee.cn:3012'

let user = {}
let scheduleList = []   //course list
let acceptedList = []
let uncommitedList = []
let backup1 = {}
let backup2 = {}

$(document).ready(()=>{
    let token = JSON.parse(localStorage.getItem('token'))
    if(!token){
        alert('请先登录!')
        location.href('/index.html')
    }

    // profile
    setProfile()

    // 更新schedule
    getSchedule()

    //选课列表
    getCourseList()

    //获取成绩
    getGrades()

    // //选课列表
    // reloadTakable()
    // //分数
    // loadGrades()
    // //已选课程time slot
    // loadSchedule()
    // //学期列表
    // loadSemesters()
    
})


function getGrades(){
    $.ajax({
        url:`${address}/getGrades`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        success:(res)=>{
            console.log(res)
        }
    })
}

function getCourseList(){
    $.ajax({
        url:`${address}/getStuCourses`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        success:(res)=>{
            console.log(res)
        }
    })
}

$('.search-submit').click(reloadTakable)

function getSchedule(){
    $('.stu-schedule').hide()
    $('.stu-create-schedule').hide()

    $.ajax({
        url:`${address}/getSchedule`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        success:(res)=>{
            console.log(res)
            if(res.code == 200){
                $('.stu-schedule').show()
                let list = res.data

                acceptedList = []
                uncommitedList = []
                backup1 = undefined
                backup2 = undefined
                //append accepted courses
                for(let item of list){
                    if(item.type == 0 && item.state == 1){
                        acceptedList.push(item)
                    }
                }
                
                

                //append uncommited courses
                for(let item of list){
                    if(item.type == 0 && item.state == 0){
                        uncommitedList.push(item)
                    }
                }

                //append backup courses1
                for(let item of list){
                    if(item.type == 1){
                        backup1 = item
                    }
                }

                //append backup courses2
                for(let item of list){
                    if(item.type == 2){
                        backup2 = item
                    }
                }

                refreshScheduleList()
                refreshScheduleTable()
                
            }else{
                $('.stu-create-schedule').show()
            }
        }
    })
}

function refreshScheduleList(){

    $('.stu-schedule tbody').empty()
    //append accepted list
    for(let item of acceptedList){
        $('.stu-schedule tbody').append($(`
        <tr>
            <td>${item.cid}</td>
            <td>${item.name}</td>
            <td>${item.dept}</td>
            <td>${item.professor_name == null ? 'no prefessor ':item.professor_name}</td>
            <td>${item.price}$</td>
            <td>Accepted</td>
            <td><button id="course-cancel-${item.cid}" class="course-cancel-ac btn btn-danger">Cancel</button></td>
        </tr>
        `))
    }
    $('.course-cancel-ac').click(cancelAc)
    
    

    //append uncommited courses
    for(let item of uncommitedList){
        $('.stu-schedule tbody').append($(`
        <tr>
            <td>${item.cid}</td>
            <td>${item.name}</td>
            <td>${item.dept}</td>
            <td>${item.professor_name == null ? 'no prefessor ':item.professor_name}</td>
            <td>${item.price}$</td>
            <td>Uncommited</td>
            <td><button id="course-cancel-${item.cid}" class="course-cancel-uc btn btn-warning">Cancel</button></td>
        </tr>
        `))
    }
    $('.course-cancel-uc').click(cancelUc)

    //append backup courses1
    if(backup1){
        $('.stu-schedule tbody').append($(`
        <tr>
            <td>${backup1.cid}</td>
            <td>${backup1.name}</td>
            <td>${backup1.dept}</td>
            <td>${backup1.professor_name == null ? 'no prefessor ':backup1.professor_name}</td>
            <td>${backup1.price}$</td>
            <td>Backup1</td>
            <td><button id="course-cancel-${backup1.cid}" class="course-cancel-bk1 btn btn-primary">Cancel</button></td>
        </tr>
        `))
    }
    $('.course-cancel-bk1').click(cancelBk1)

    //append backup courses2
    if(backup2){
        $('.stu-schedule tbody').append($(`
        <tr>
            <td>${backup2.cid}</td>
            <td>${backup2.name}</td>
            <td>${backup2.dept}</td>
            <td>${backup2.professor_name == null ? 'no prefessor ':backup2.professor_name}</td>
            <td>${backup2.price}$</td>
            <td>Backup2</td>
            <td><button id="course-cancel-${backup2.cid}" class="course-cancel-bk2 btn btn-primary">Cancel</button></td>
        </tr>
        `))
    }
    $('.course-cancel-bk2').click(cancelBk2)
}

function cancelAc(){
    let id = $(this).attr('id').split('-')[2]

    for(let idx in acceptedList){
        if(acceptedList[idx].cid == id){
            if(confirm(`Are you sure to cancel the accepted course ${id} ${acceptedList[idx].name}?`)){
                acceptedList.splice(idx,1)
                break
            }
        }
    }
    refreshScheduleList()
    refreshScheduleTable()

}

function cancelUc(){
    let id = $(this).attr('id').split('-')[2]

    for(let idx in uncommitedList){
        if(uncommitedList[idx].cid == id){
            if(confirm(`Are you sure to cancel the uncommited course ${id} ${uncommitedList[idx].name}?`)){
                uncommitedList.splice(idx,1)
                break
            }
        }
    }
    refreshScheduleList()
    refreshScheduleTable()
}

function cancelBk1(){
    backup1 = backup2
    cancelBk2()
    refreshScheduleList()
    refreshScheduleTable()
}

function cancelBk2(){
    backup2 = undefined
    refreshScheduleList()
    refreshScheduleTable()
}

function refreshScheduleTable(){
    initCurrTable()
    initHistoryTable()
    for(let item of acceptedList){
        setHistoryTable(parseSchedule(item))
    }
    for(let item of uncommitedList){
        setCurrTable(parseSchedule(item))
    }
    refreshView()
}

function setProfile(){
    $.ajax({
        url:`${address}/profile`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
            // 'token':'student',
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

let takable = []
function reloadTakable(){
    
    let course_name = $('.course_name input').val()
    let dept_name = $('.dept_name input').val()
    let teacher_name = $('.teacher_name input').val()
    let semester = $('.semester select').val()
    let year = semester.split('-')[0]
    semester = semester.split('-')[1]

    //学生可选课程列表
    $.ajax({
        url:`${address}/student/section_list_takable`,
        type:'get',
        headers:{
            token:JSON.parse(localStorage.getItem('token'))
            // token:'student'
        },
        data:{
            course_name:course_name,
            teacher_name:teacher_name,
            dept_name:dept_name,
            year:year,
            semester:semester  
        },
        success:function(res){
            // console.log(res)
            if(res.code != 200){
                alert('表单加载错误！')
            }else{
                takable = res.data
                $('.section-table tbody').empty()
                for(let idx in res.data){
                    sec = res.data[idx]
                    $('.section-table tbody').append(
                        $(`
                        <tr>
                            <td>${sec.course_id}</td>
                            <td>${sec.sec_id}</td>
                            <td>${sec.title}</td>
                            <td>${sec.course_type}</td>
                            <td>${sec.dept_name}</td>
                            <td>${sec.professor_name == 'null' ? 'no prefessor ':professor_names}</td>
                            <td>${sec.year} ${sec.semester}</td>
                            <td>${sec.teacher_names}</td>
                            <td><button class="btn btn-primary check-schedule" id="${idx}-${sec.sec_id}">查看</button></td>
                            <td><button class="btn btn-${sec.SID ? 'success' : 'danger'} take-untake" id="${sec.SID ? 'untake' : 'take'}-${sec.sec_id}">${sec.SID ? '退选' : '选课'}</button></td>
                        </tr>
                        `)
                    )
                }
            }
            $('.take-untake').click(takeUntake)
            $('.check-schedule').click(checkSchedule)
        }
    })
}

function takeUntake(){
    id = $(this).attr('id')
    operation = id.split('-')[0]
    sec_id = id.split('-')[1]
    $.ajax({
        url:`${address}/student/take_untake`,
        type:'post',
        headers:{
            token:JSON.parse(localStorage.getItem('token'))
            // token:'student'
        },
        data:{
            operation:operation,
            sec_id:sec_id
        },
        success:function(res){
            if(res.code != 200){
                alert(res.message)
            }else{
                reloadTakable()
                loadSchedule()
                alert(operation == 'take' ? '选课成功!' : '退选成功!')
            }
        }
    })
}

function checkSchedule(){
    let id = $(this).attr('id')
    let sec_id = id.split('-')[1]
    let idx = id.split('-')[0]
    sec = takable[idx]
    console.log(sec)

    $.ajax({
        url:`${address}/search/get_time_slog_by_sec_id`,
        type:'get',
        data:{
            sec_id:sec_id
        },
        success:function(res){
            timeslot = res.data.timeSlot
            table = parseSchedule(timeslot)
            setCurrTable(table)
            initHistoryTable(table)
            refreshView()
            showShadow()

            $('.schedule-title').empty()
            $('.schedule-title').append($(`
                <div class="name">${sec.title}</div>
                <div class="teachers">${sec.teacher_names}</div>
                <div class="type">${sec.course_type}</div>
                <div class="dept">${sec.dept_name}</div>
                <div class="semester">${sec.year} ${sec.semester}</div>
            `))

            $('.schedule-panel').empty()
            $('.schedule-panel').append($(`
                <div class="begin-week">从第<b>${timeslot.begin_week}</b>周开始</div>
                <div class="end-week">到第<b>${timeslot.end_week}</b>周结束</div>
                <div class="building">教学楼:<b>${sec.building}</b></div>
                <div class="classroom">教室:<b>${sec.room_number}</b></div>
                <button class="btn btn-primary show-history">展示已选课程</button>
            `))
            $('.show-history').click(loadHistory)
        }
    })
}

function loadHistory(){
    let val = $(this).text()
    if(val == '展示已选课程'){
        initHistoryTable()
        for(sec of historyTakes){
            table = parseSchedule(sec)
            for(let i = 1;i <= 7;i++){
                for(let j = 1;j <= 11;j++){
                    historyTable[i][j] += table[i][j]
                }
            }
        }
        refreshView()
        $(this).text('隐藏已选课程')
    }else{
        initHistoryTable()
        refreshView()
        $(this).text('展示已选课程')
    }
    
}

function loadSemesters(){
    $.ajax({
        url:`${address}/search/semester_list`,
        type:'get',
        success:function(res){
            semesterList = res.semesterList
            $('.semester select').empty()
            $('.semester select').append($(`<option value="-" selected>开课学期</option>`))
            for(let semester of semesterList){
                $('.semester select').append($(`
                    <option value="${semester.year}-${semester.semester}">${semester.year} ${semester.semester}</option>
                `))
            }
        }
    })
}