import Mock from 'mockjs'

export default {
  'POST /api/login': {
    code: '200',
    message: 'ok',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjMyODU2LCJzZXNzaW9uIjoiOTRlZTZjOThmMmY4NzgzMWUzNzRmZTBiMzJkYTIwMGMifQ.z5Llnhe4muNsanXQSV-p1DJ-89SADVE-zIkHpM0uoQs',
    success: true,
  },
  'GET /api/vaccines': [
    {
      ID: 1,
      name: '狂犬病疫苗',
      description: '狂犬病疫苗的描述性文字',
      targetDisease: '狂犬病',
      sideEffects:
        '疫苗接种后，可能会出现发热、头痛、乏力、肌肉酸痛、注射部位红肿、疼痛等不良反应，一般在接种后1～2天内自行缓解，无需特殊处理。',
      precautions:
        '1.接种者应在接种后30分钟内留在接种单位观察，以防发生严重过敏反应。\n2.接种者应在接种后3天内避免剧烈运动，以免影响疫苗效果。\n3.接种者应在接种后7天内避免饮酒，以免影响疫苗效果。\n4.接种者应在接种后7天内避免接种其他疫苗，以免影响疫苗效果。\n5.接种者应在接种后7天内避免接触犬、猫等动物，以免影响疫苗效果。\n6.接种者应在接种后7天内避免接触动物尸体，以免影响疫苗效果。\n7.接种者应在接种后7天内避免接触动物的粪便，以免影响疫苗效果。\n8.接种者应在接种后7天内避免接触动物的尿液，以免影响疫苗效果。\n9.接种者应在接种后7天内避免接触动物的唾液，以免影响疫苗效果。\n10.接种者应在接种后7天内避免接触动物的血液，以免影响疫苗效果。\n11.接种者应在接种后7天内避免接触动物的分泌物，以免影响疫苗效果。\n12.接种者应在接种后7天内避免接触动物的排泄物，以免影响疫',
    },
    {
      ID: 2,
      name: '百白破联合疫苗',
      description: '百白破联合疫苗',
      targetDisease: '百日咳、白喉、破伤风',
      SideEffects:
        '疫苗接种后，可能会出现发热、头痛、乏力、肌肉酸痛、注射部位红肿、疼痛等不良反应，一般在接种后1～2天内自行缓解，无需特殊处理。',
      precautions:
        '1.接种者应在接种后30分钟内留在接种单位观察，以防发生严重过敏反应。\n2.接种者应在接种后3天内避免剧烈运动，以免影响疫苗效果。\n3.接种者应在接种后7天内避免饮酒，以免影响疫苗效果。\n4.接种者应在接种后7天内避免接种其他疫苗，以免影响疫苗效果。\n5.接种者应在接种后7天内避免接触犬、猫等动物，以免影响疫苗效果。\n6.接种者应在接种后7天内避免接触动物尸体，以免影响疫苗效果。\n7.接种者应在接种后7天内避免接触动物的粪便，以免影响疫苗效果。\n8.接种者应在接种后7天内避免接触动物的尿液，以免影响疫苗',
    },
    {
      ID: 3,
      name: '麻疹风疹联合疫苗',
      description: '麻疹风疹联合疫苗',
      targetDisease: '麻疹、风疹',
      sideEffects:
        '疫苗接种后，可能会出现发热、头痛、乏力、肌肉酸痛、注射部位红肿、疼痛等不良反应，一般在接种后1～2天内自行缓解，无需特殊处理。',
      precautions:
        '1.接种者应在接种后30分钟内留在接种单位观察，以防发生严重过敏反应。\n2.接种者应在接种后3天内避免剧烈运动，以免影响疫苗效果。\n3.接种者应在接种后7天内避免饮酒，以免影响疫苗效果。\n4.接种者应在接种后7天内避免接种其他疫苗，以免影响疫苗效果。\n5.接种者应在接种后7天内避免接触犬、猫等动物，以免影响疫苗效果。\n6.接种者应在接种后7天内避免接触动物尸体，以免影响疫苗效果。\n7.接种者应在接种后7天内避免接触动物的粪便，以免影响疫苗效果。\n8.接种者应在接种后7天内避免接触动物的尿液',
    },
  ],

  'GET /api/vaccines/1': {
    ID: 1,
    name: '狂犬病疫苗',
    description: '狂犬病疫苗的描述性文字',
    targetDisease: '狂犬病',
    sideEffects:
      '疫苗接种后，可能会出现发热、头痛、乏力、肌肉酸痛、注射部位红肿、疼痛等不良反应，一般在接种后1～2天内自行缓解，无需特殊处理。',
    precautions:
      '1.接种者应在接种后30分钟内留在接种单位观察，以防发生严重过敏反应。\n2.接种者应在接种后3天内避免剧烈运动，以免影响疫苗效果。\n3.接种者应在接种后7天内避免饮酒，以免影响疫苗效果。\n4.接种者应在接种后7天内避免接种其他疫苗，以免影响疫苗效果。\n5.接种者应在接种后7天内避免接触犬、猫等动物，以免影响疫苗效果。\n6.接种者应在接种后7天内避免接触动物尸体，以免影响疫苗效果。\n7.接种者应在接种后7天内避免接触动物的粪便，以免影响疫苗效果。\n8.接种者应在接种后7天内避免接触动物的尿液，以免影响疫苗效果。\n9.接种者应在接种后7天内避免接触动物的唾液，以免影响疫苗效果。\n10.接种者应在接种后7天内避免接触动物的血液，以免影响疫苗效果。\n11.接种者应在接种后7天内避免接触动物的分泌物，以免影响疫苗效果。\n12.接种者应在接种后7天内避免接触动物的排泄物，以免影响疫',
  },
  'GET /api/vaccines/2': {
    ID: 2,
    name: '百白破联合疫苗',
    description: '百白破联合疫苗',
    targetDisease: '百日咳、白喉、破伤风',
    sideEffects:
      '疫苗接种后，可能会出现发热、头痛、乏力、肌肉酸痛、注射部位红肿、疼痛等不良反应，一般在接种后1～2天内自行缓解，无需特殊处理。',
    precautions:
      '1.接种者应在接种后30分钟内留在接种单位观察，以防发生严重过敏反应。\n2.接种者应在接种后3天内避免剧烈运动，以免影响疫苗效果。\n3.接种者应在接种后7天内避免饮酒，以免影响疫苗效果。\n4.接种者应在接种后7天内避免接种其他疫苗，以免影响疫苗效果。\n5.接种者应在接种后7天内避免接触犬、猫等动物，以免影响疫苗效果。\n6.接种者应在接种后7天内避免接触动物尸体，以免影响疫苗效果。\n7.接种者应在接种后7天内避免接触动物的粪便，以免影响疫苗效果。\n8.接种者应在接种后7天内避免接触动物的尿液，以免影响疫苗',
  },
  'GET /api/vaccines/3': {
    ID: 3,
    name: '麻疹风疹联合疫苗',
    description: '麻疹风疹联合疫苗',
    targetDisease: '麻疹、风疹',
    sideEffects:
      '疫苗接种后，可能会出现发热、头痛、乏力、肌肉酸痛、注射部位红肿、疼痛等不良反应，一般在接种后1～2天内自行缓解，无需特殊处理。',
    precautions:
      '1.接种者应在接种后30分钟内留在接种单位观察，以防发生严重过敏反应。\n2.接种者应在接种后3天内避免剧烈运动，以免影响疫苗效果。\n3.接种者应在接种后7天内避免饮酒，以免影响疫苗效果。\n4.接种者应在接种后7天内避免接种其他疫苗，以免影响疫苗效果。\n5.接种者应在接种后7天内避免接触犬、猫等动物，以免影响疫苗效果。\n6.接种者应在接种后7天内避免接触动物尸体，以免影响疫苗效果。\n7.接种者应在接种后7天内避免接触动物的粪便，以免影响疫苗效果。\n8.接种者应在接种后7天内避免接触动物的尿液',
  },

  'POST /api/vaccination-records': (req, res) => {
    res.status(200).json({
      message: 'Vaccination record submitted successfully',
      success: true,
      data: {
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        date: req.body.date,
        valid: req.body.valid,
        reminder: req.body.reminder,
        remindDate: req.body.remindDate,
        voucher: req.body.voucher,
        note: req.body.note,
      },
    })
  },

  'POST /api/temperature-records': (req, res) => {
    res.status(200).json({
      message: 'Temperature record submitted successfully',
      success: true,
      data: {
        id: req.body.id,
        time: req.body.time,
        value: req.body.val,
        note: req.body.note,
      },
    })
  },

  'GET /api/profiles': [
    {
      id: 1,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      name: '张三',
      relationship: '本人',
      gender: '男',
      birthday: '1990/11/01',
      note: '青霉素过敏',
    },
    {
      id: 2,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      name: '王二',
      relationship: '父亲',
      gender: '男',
      birthday: '1960/11/01',
      note: '高血压高血脂',
    },
    {
      id: 3,
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      name: '李四',
      relationship: '女儿',
      gender: '女',
      birthday: '2020/11/01',
      note: '蛋白过敏',
    },
  ],

  'GET /api/profiles/1': {
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    name: '张三',
    relationship: '本人',
    gender: '男',
    birthday: '1990/11/01',
    note: '青霉素过敏',
  },

  'GET /api/profiles/2': {
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    name: '王二',
    relationship: '父亲',
    gender: '男',
    birthday: '1960/11/01',
    note: '高血压高血脂',
  },

  'GET /api/profiles/3': {
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    name: '李四',
    relationship: '女儿',
    gender: '女',
    birthday: '2020/11/01',
    note: '蛋白过敏',
  },

  'POST /api/profiles': (req, res) => {
    res.status(200).json({
      message: 'New memeber added successfully',
      success: true,
      data: {
        Fullname: req.body.name,
        Gender: req.body.gender,
        DateOfBirth: req.body.birthday,
        Relationship: req.body.relationship,
        avatar: req.body.avatar,
        note: req.body.note,
      },
    })
  },

  'PUT /api/profiles': (req, res) => {
    res.status(200).json({
      message: 'Memeber edited successfully',
      success: true,
      data: {
        Fullname: req.body.name,
        Gender: req.body.gender,
        DateOfBirth: req.body.birthday,
        Relationship: req.body.relationship,
        avatar: req.body.avatar,
        note: req.body.note,
      },
    })
  },

  'PUT /api/profiles/1': (req, res) => {
    res.status(200).json({
      message: 'Memeber edited successfully',
      success: true,
      data: {
        Fullname: req.body.name,
        Gender: req.body.gender,
        DateOfBirth: req.body.birthday,
        Relationship: req.body.relationship,
        avatar: req.body.avatar,
        note: req.body.note,
      },
    })
  },

  'GET /api/notices': [
    {
      ID: 1,
      profile: '张三',
      vaccine: '新冠疫苗',
      type: '第一针',
      date: '2023-01-01',
    },
    {
      ID: 2,
      profile: '张三',
      vaccine: '新冠疫苗',
      type: '第二针',
      date: '2023-02-01',
    },
    {
      ID: 3,
      profile: '张三',
      vaccine: '新冠疫苗',
      type: '第三针',
      date: '2023-03-01',
    },
  ],
}

// const VaccinationRecord = Mock.mock({
//   "list|1-10": [{
//     "profileId|+1": 0,
//     "vaccineId|+1": 0,
//     "vaccineType|+1": 0,
//     "vaccineDate": "@date",
//     "vaccineValid": '@integer(1, 10) * 365',
//     "vaccineReminder": '@boolean',
//     "vaccineVoucher": Mock.Random.dataImage(),
//     "vaccineNote": '@cparagraph(1, 3)',
//   }]
// })

// Mock.mock('/api/vaccination-records/', 'post', (options) => {
//   let body = JSON.parse(options.body)
//   VaccinationRecord.list.push(Mock.mock({
//     "profileId": body.id,
//     "vaccineId": body.name,
//     "vaccineType": body.type,
//     "vaccineDate": body.date,
//     "vaccineValid": body.valid,
//     "vaccineReminder": body.reminder,
//     "vaccineVoucher": body.voucher,
//     "vaccineNote": body.note,
//   }))

//   return {
//     status: 200,
//     message: 'ok',
//     success: true,
//     list: VaccinationRecord.list,
//   }
// })
