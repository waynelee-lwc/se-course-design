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

$('.stu-schedule-add').click(addSchedule)
$('.stu-schedule-save').click(saveSchedule)
$('.stu-schedule-commit').click(commitSchedule)
$('.stu-schedule-delete').click(deleteSchedule)

function addSchedule(){
    $.ajax({
        url:`${address}/addSchedule`,
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        type:'post',
        success:(res)=>{
            if(res.code == 200){
                alert('create successfully!')
                getSchedule()
            }else{
                alert('create failed!',res.message)
            }
        }
    })
}

function deleteSchedule(){
    if(!confirm('Are you sure to delete the schedule?\nYou will lose all courses selected! \nYou can create a new schedule later.')){
        return
    }

    $.ajax({
        url:`${address}/deleteSchedule`,
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        type:'post',
        success:(res)=>{
            if(res.code == 200){
                alert('delete successfully')
                getSchedule()
            }else{
                alert('delete failed!',code.message)
            }
        }
    })
}

function commitSchedule(){

}

function saveSchedule(){
    let list = packList()
    $.ajax({
        url:`${address}/saveSchedule`,
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        data:{
            course_list:list
        },
        type:'post',
        success:(res)=>{
            if(res.code == 200){
                alert('succefully!')
                getSchedule()
                getCourseList()
            }
        }
    })
}

function packList(){
    let list = []
    for(let item of acceptedList){
        list.push({
            cid:item.cid,
            state:1,
            type:0
        })
    }

    for(let item of uncommitedList){
        list.push({
            cid:item.cid,
            state:0,
            type:0
        })
    }

    if(backup1){
        list.push({
            cid:backup1.cid,
            state:0,
            type:1
        })
    }

    if(backup2){
        list.push({
            cid:backup2.cid,
            state:0,
            type:2
        })
    }
    return list
}

function getGrades(){
    $.ajax({
        url:`${address}/getGrades`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        success:(res)=>{
            if(res.code == 200){
                $('.stu-grades tbody').empty()
                let list = res.data
                for(let item of list){
                    $('.stu-grades tbody').append($(`
                    <tr>
                        <td>${item.cid}</td>
                        <td>${item.name}</td>
                        <td>${item.dept}</td>
                        <td>${item.professor_name}</td>
                        <td>${item.price}$</td>
                        <td>${item.grades}</td>
                    </tr>
                    `))
                }
            }
        }
    })
}

function checkInSchedule(cid){
    for(let item of acceptedList){
        if(item.cid == cid){
            return 1
        }
    }
    for(let item of uncommitedList){
        if(item.cid == cid){
            return 2
        }
    }
    if(backup1 && backup1.cid == cid){
        return 3
    }
    if(backup2 && backup2.cid == cid){
        return 4
    }
    return 0
}

let courseList = []
function getCourseList(){
    $.ajax({
        url:`${address}/getStuCourses`,
        type:'get',
        headers:{
            'token':JSON.parse(localStorage.getItem('token')),
        },
        success:(res)=>{
            if(res.code == 200){
                let list = res.data
                $('.score-table tbody').empty()
                courseList = []
                for(let item of list){
                    let inList = checkInSchedule(item.cid)
                    // console.log(item.cid,inList,(inList != 1 && inList != 2) ? '' : 'disabled')
                    courseList.push(item)
                    $('.score-table tbody').append($(`
                    <tr class="course-entry" id="course-entry-${item.cid}">
                        <td>${item.cid}</td>
                        <td>${item.name}</td>
                        <td>${item.dept}</td>
                        <td>${item.professor_name == null ? 'No professor' : item.professor_name}</td>
                        <td>${item.price}$</td>
                        <td>${10 - item.stu_num}</td>
                        <td>10</td>
                        <td>Available</td>
                        <td><button id="course-select-${item.cid}" class="btn btn-primary course-select" ${(inList != 1 && inList != 2) ? '' : 'disabled'}>Select</button></td>
                        <td><button id="course-backup-${item.cid}" class="btn btn-success course-backup" ${inList == 0 ? '' : 'disabled'}>Backup</button></td>
                    </tr>
                    `))
                }

                $('.course-entry').on('mouseover',function(){
                    let id = $(this).attr('id').split('-')[2]
                    id = Number.parseInt(id)
                    for(let item of courseList){
                        if(item.cid == id){
                            setCurrTable(parseSchedule(item))
                        }
                    }
                    refreshView()
                })
                $('.course-entry').on('mouseout',function(){
                    let id = $(this).attr('id').split('-')[2]
                    id = Number.parseInt(id)

                    for(let item of courseList){
                        if(item.cid == id){
                            unsetCurrTable(parseSchedule(item))
                        }
                    }
                    refreshView()
                })
                $('.course-select').click(courseSelect)
                $('.course-backup').click(courseBackup)
            }
        }
    })
}

function courseSelect(){
    let id = $(this).attr('id').split('-')[2]
    id = Number.parseInt(id)
    console.log(id)

    if(acceptedList.length + uncommitedList.length >= 4){
        alert(`you can't select more than 4 courses!`)
        return
    }

    for(let item of courseList){
        if(item.cid == id){
            uncommitedList.push(item)
            console.log(item)
            break
        }
    }
    
    getCourseList()
    refreshScheduleList()
    refreshScheduleTable()
}

function courseBackup(){
    let id = $(this).attr('id').split('-')[2]
    id = Number.parseInt(id)
    console.log(id)

    if(acceptedList.length + uncommitedList.length >= 4){
        alert(`you can't select more than 4 courses!`)
        return
    }

    for(let item of courseList){
        if(item.cid == id){
            backup2 = backup1
            backup1 = item
            break
        }
    }
    
    getCourseList()
    refreshScheduleList()
    refreshScheduleTable()
}

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
    getCourseList()
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
    getCourseList()
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
