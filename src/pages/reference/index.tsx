import { useState } from "react";
import { Table, Tabs } from '@nutui/nutui-react-taro';
import { TableColumnProps } from '@nutui/nutui-react-taro/dist/types/packages/table/types';

export default function App() {
  const [tabValue, setTabValue] = useState<string | number>('0');

  const [columns, setColumns] = useState<Array<TableColumnProps>>([
    {
      title: '年龄',
      key: 'age',
    },
    {
      title: '疫苗',
      key: 'vaccine',
    },
    {
      title: '剂次',
      key: 'dose',
    },
  ])

  const [data1, setData1] = useState([
    {
      age: '出生',
      vaccine: '乙肝疫苗',
      dose: '1',
    },
    {
      vaccine: '卡介苗',
      dose: '1',
    },
    {
      age: '1月龄',
      vaccine: '乙肝疫苗',
      dose: '2',
    },
    {
      age: '2月龄',
      vaccine: '脊灰灭活疫苗',
      dose: '1',
    },
    {
      age: '3月龄',
      vaccine: '脊灰灭活疫苗',
      dose: '2',
    },
    {
      vaccine: '百白破疫苗',
      dose: '1',
    },
    {
      age: '4月龄',
      vaccine: '百白破疫苗',
      dose: '2',
    },
    {
      vaccine: '二价脊灰疫苗',
      dose: '1',
    },
    {
      age: '5月龄',
      vaccine: '百白破疫苗',
      dose: '3',
    },
    {
      age: '6月龄',
      vaccine: '乙肝疫苗',
      dose: '3',
    },
    {
      vaccine: 'A群流脑疫苗',
      dose: '1',
    },
    {
      age: '8月龄',
      vaccine: '乙脑减毒活疫苗',
      dose: '1',
    },
    {
      vaccine: '麻腮风疫苗',
      dose: '1',
    },
    {
      age: '9月龄',
      vaccine: 'A群流脑疫苗',
      dose: '2',
    },
    {
      age: '18月龄',
      vaccine: '麻腮风疫苗',
      dose: '2',
    },
    {
      vaccine: '甲肝减毒活疫苗',
      dose: '1',
    },
    {
      vaccine: '百白破疫苗',
      dose: '4',
    },
    {
      age: '2周岁',
      vaccine: '乙脑减毒活疫苗',
      dose: '2',
    },
    {
      age: '3周岁',
      vaccine: 'A+C群流脑疫苗',
      dose: '1',
    },
    {
      age: '4周岁',
      vaccine: '二价脊灰疫苗',
      dose: '2',
    },
    {
      age: '6周岁',
      vaccine: 'A+C群流脑疫苗',
      dose: '2',
    },
    {
      vaccine: '白破疫苗',
      dose: '1',
    },
  ])

  const [data2, setData2] = useState([
    {
      age: '1月15天',
      vaccine: '13价肺炎多糖结合疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: '五价轮状病毒疫苗',
      dose: '1',
    },
    {
      age: '2月龄',
      vaccine: '百白破IPV和Hib五联疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: 'b型流感嗜血杆菌疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: '轮状病毒疫苗',
      dose: '1',
    },
    {
      age: '2月15天',
      vaccine: '五价轮状病毒疫苗',
      dose: '2',
    },
    {
      age: '3月龄',
      vaccine: 'b型流感嗜血杆菌疫苗',
      dose: '2',
    },
    {
      age: '',
      vaccine: '四联疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: 'A群C群流脑结合疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: 'ACYW群流脑多糖结合疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: 'A+C流脑疫苗（结合）',
      dose: '1',
    },
    {
      age: '',
      vaccine: '百白破IPV和Hib五联疫苗',
      dose: '2',
    },
    {
      age: '3月15日',
      vaccine: '五价轮状病毒疫苗',
      dose: '3',
    },
    {
      age: '',
      vaccine: '13价肺炎多糖结合疫苗',
      dose: '2',
    },
    {
      age: '4月龄',
      vaccine: 'A+C流脑疫苗（结合）',
      dose: '2',
    },
    {
      age: '',
      vaccine: 'A群C群流脑结合疫苗',
      dose: '2',
    },
    {
      age: '',
      vaccine: '四联疫苗',
      dose: '2',
    },
    {
      age: '',
      vaccine: 'ACYW群流脑多糖结合疫苗',
      dose: '2',
    },
    {
      age: '',
      vaccine: '百白破IPV和Hib五联疫苗',
      dose: '3',
    },
    {
      age: '',
      vaccine: '脊灰灭活疫苗',
      dose: '3',
    },
    {
      age: '',
      vaccine: 'b型流感嗜血杆菌疫苗',
      dose: '3',
    },
    {
      age: '5月龄',
      vaccine: '四联疫苗',
      dose: '3',
    },
    {
      age: '',
      vaccine: 'A+C流脑疫苗（结合）',
      dose: '3',
    },
    {
      age: '',
      vaccine: 'ACYW群流脑多糖结合疫苗',
      dose: '3',
    },
    {
      age: '5月15天',
      vaccine: '13价肺炎多糖结合疫苗',
      dose: '3',
    },
    {
      age: '6月龄',
      vaccine: '三价流感疫苗 （6-35月龄）',
      dose: '1',
    },
    {
      age: '',
      vaccine: '肠道病毒71型灭活疫苗',
      dose: '1',
    },
    {
      age: '7月龄',
      vaccine: '肠道病毒71型灭活疫苗',
      dose: '2',
    },
    {
      age: '8月龄',
      vaccine: '腮腺炎疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: '乙脑灭活疫苗 （Vero）',
      dose: '1',
    },
    {
      age: '8月7天',
      vaccine: '乙脑灭活疫苗 （Vero）',
      dose: '2',
    },
    {
      age: '12月龄',
      vaccine: '13价肺炎多糖结合疫苗',
      dose: '4',
    },
    {
      age: '',
      vaccine: '甲肝灭活疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: 'ACYW群流脑多糖结合疫苗',
      dose: '4',
    },
    {
      age: '',
      vaccine: '水痘减毒活疫苗',
      dose: '1',
    },
    {
      age: '14月龄',
      vaccine: '轮状病毒疫苗',
      dose: '2',
    },
    {
      age: '18月龄',
      vaccine: '脊灰灭活疫苗',
      dose: '4',
    },
    {
      age: '',
      vaccine: '百白破IPV和Hib五联疫苗',
      dose: '4',
    },
    {
      age: '',
      vaccine: '甲肝灭活疫苗',
      dose: '2',
    },
    {
      age: '',
      vaccine: 'b型流感嗜血杆菌疫苗',
      dose: '4',
    },
    {
      age: '',
      vaccine: '四联疫苗',
      dose: '4',
    },
    {
      age: '',
      vaccine: '三价流感疫苗 （6-35月龄）',
      dose: '2',
    },
    {
      age: '2周岁',
      vaccine: 'ACYW群流脑多糖疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: '乙脑灭活疫苗 （Vero）',
      dose: '3',
    },
    {
      age: '',
      vaccine: '23价肺炎球菌疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: '轮状病毒疫苗',
      dose: '3',
    },
    {
      age: '3周岁',
      vaccine: '四价流感疫苗',
      dose: '1',
    },
    {
      age: '',
      vaccine: '新冠肺炎疫苗 （Vero）',
      dose: '1',
    },
    {
      age: '3周岁21天',
      vaccine: '新冠肺炎疫苗（Vero）',
      dose: '2',
    },
    {
      age: '4周岁',
      vaccine: '水痘减毒活疫苗',
      dose: '2',
    },
    {
      age: '5周岁',
      vaccine: 'ACYW群流脑多糖疫苗',
      dose: '2',
    },
    {
      age: '6周岁',
      vaccine: '乙脑灭活疫苗 （Vero）',
      dose: '4',
    },
    {
      age: '9周岁',
      vaccine: '二价宫颈癌疫苗',
      dose: '1',
    },
  ])

  return (
    <Tabs value={tabValue} onChange={(value) => {
      setTabValue(value)
    }}>
      <Tabs.TabPane title="一类疫苗">
        <Table columns={columns} data={data1} bordered={false} />
      </Tabs.TabPane>
      <Tabs.TabPane title="二类疫苗">
        <Table columns={columns} data={data2} bordered={false} />
      </Tabs.TabPane>
    </Tabs>
  ) 
};