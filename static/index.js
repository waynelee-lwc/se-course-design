document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
window.onresize = function(){
	// console.log("当前尺寸为：" + window.innerWidth);
	document.getElementsByTagName('html')[0].style.fontSize = (16/1920) * window.innerWidth + "px";
}

let address = 'http://www.wayne-lee.cn:3012'

$('.role-radio').click(function(e){
    console.log(e)
    console.log($(e).attr('id'))
})

$('.login-submit').on('click',function(){
    let name = $('.name').val()
    let password = $('.password').val()
    let role = $("input:radio:checked").val()

    console.log(name,password,role)

    $.ajax({
        url:`${address}/login`,
        type:'post',
        data:{
            name:name,
            password:password,
            role:role
        },
        success:function(res){
            console.log(res)
            alert(JSON.stringify(res))
            if(res.code != 200){
                alert(res.message)
            }else{
                localStorage.setItem('userinfo',JSON.stringify(res.data.user))
                localStorage.setItem('token',JSON.stringify(res.data.token))
                if(role == 'student'){
                    location.href = '/student.html'
                }
                if(role == 'professor'){
                    location.href = '/professor.html'
                }
                if(role == 'registrar'){
                    location.href = '/registrar.html'
                }
            }
        }
    })
})