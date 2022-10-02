# se-course-design
2119软工课设

### Case 流程

#### 开启注册用例：

  初始化数据
  设定过程起止时间

#### 关闭注册：

  检查是否可以关闭（是否在注册时间段外）
  检查每个课程，是否满足开课条件（教师认领）
  锁定多有满足人数和开课条件的课程
  检查每个课程，是否人数够，不够的学生移到备选课程
  检查每个课程，是否人数够，不够的人数删除
  形成全部开课列表，调用计费模块计费

#### 注册课程：

  \- 学生只能有一个 schedule，初始时未创建
  \- 创建schedule后只能删除，不能额外创建
  \- 修改schedule允许学生编辑里面的课程
  \- 删除schedule默认学生退选所有已选课程
  \- 课程两种状态：selected & enrolled in
  \- 保存 : 更新selected课程列表
  \- 提交 : 默认先保存，再对所有selected课程进行提交，只校验主选课程的先决条件(可选/人数/时间冲突)

#### 登录：

  \- 输入姓名-密码
  \- 校验并登入具体角色
  \- 登录成功会生成一个token
  \- 请求头X-token 携带token表示登录状态
  \- 一层filter处理token头，标记角色
  \- 一层filter处理活动状态

#### 维护学生信息：

  \- 姓名(for login)，生日，ssn，status，graduation date，学生ID（生成）
  \- 增删改

#### 维护教授信息：

  \- 姓名(for login)，生日，ssn，status，部门，教授ID（生成）

#### 教授任教：

  \- 查出所有同部门的课程，在其中进行选择
  \- 校验时间冲突和任教冲突

#### 登录成绩：

  \- 根据学期查看授课课程列表
  \- 登录学生成绩

#### 查询成绩

  \- 找所有的选课，展示成绩



### 数据表

#### student

​	sid, name, birthday, SSN, status, graduation_date, password

#### professor

​	pid, name, birthday, SSN, status, dept, password

#### course

​	cid, name, dept, semester, credit, tsid

#### timeslot

​	tsid,mon,tue,...,sun

#### schedule

​	sche_id, semester

#### course_schedule

​	sche_id, course, state

#### schedule

​	sche_id,sid, semester

##### student_course

​	sid,cid,grades,semester