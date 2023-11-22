export default {
  "POST /api/login": {
    code: "200",
    message: "ok",
    data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjMyODU2LCJzZXNzaW9uIjoiOTRlZTZjOThmMmY4NzgzMWUzNzRmZTBiMzJkYTIwMGMifQ.z5Llnhe4muNsanXQSV-p1DJ-89SADVE-zIkHpM0uoQs",
    success: true,
  },
  "GET /api/vaccines": {
    code: "200",
    message: "ok",
    data: [
      {
        id: 1,
        name: "狂犬病疫苗",
        type: "疫苗",
        description: "狂犬病疫苗",
        status: 1,
        createdAt: "2021-06-22T07:37:58.000Z",
        updatedAt: "2021-06-22T07:37:58.000Z",
      },
      {
        id: 2,
        name: "狂犬病疫苗2",
        type: "疫苗",
        description: "狂犬病疫苗2",
        status: 1,
        createdAt: "2021-06-22T07:37:58.000Z",
        updatedAt: "2021-06-22T07:37:58.000Z",
      },
      {
        id: 3,
        name: "狂犬病疫苗3",
        type: "疫苗",
        description: "狂犬病疫苗3",
        status: 1,
        createdAt: "2021-06-22T07:37:58.000Z",
        updatedAt: "2021-06-22T07:37:58.000Z",
      },
    ],
    success: true,
  },
};
