import Taro from '@tarojs/taro'
import React, { useState } from "react";
import { Input, Cell, Switch, Picker, Uploader, Button, DatePicker } from '@nutui/nutui-react-taro';
import { TextArea } from '@nutui/nutui-react-taro';
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types';

// import {ComboBox} from 'src/components/combobox';

type RecordData = {
    id: number // 接种人
    name: string // 疫苗名称
    type: string // 接种类型
    time: string // 接种时间
    valid: string // 有效期
}

export default function VaccineRecord() {
    const MemberData = [
        [
            { value: 0, text: '本人', },
            { value: 1, text: '父亲', },
            { value: 2, text: '女儿', },
        ],
    ]

    const VaccineData = [
        [
            { value: 0, text: '九价HPV疫苗', },
            { value: 1, text: '流感疫苗', },
            { value: 2, text: '水痘疫苗', },
        ]
    ]

    const TypeData = [
        [
            { value: 0, text: '免疫接种第一针', },
            { value: 1, text: '免疫接种第二针', },
            { value: 2, text: '免疫接种第三针', },
            { value: 3, text: '常规接种', },
            { value: 4, text: '加强针剂', },
            { value: 5, text: '补种疫苗', },
        ]
    ]

    const [record, setRecord] = useState<RecordData | null>()

    const [idVisible, setIdVisible] = useState(false)
    const [idDesc, setIdDesc] = useState('')
    const confirmID = (options: PickerOption[], values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setIdDesc(description)
    }

    const [nameVisible, setNameVisible] = useState(false)
    const [nameDesc, setNameDesc] = useState('')
    const confirmName = (options: PickerOption[], values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setNameDesc(description)
    }

    const [typeVisible, setTypeVisible] = useState(false)
    const [typeDesc, setTypeDesc] = useState('')
    const confirmType = (options: PickerOption[], values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setTypeDesc(description)
    }

    const startDate = new Date(2000, 0, 1)
    const endDate = new Date(2025, 11, 30)
    const [show, setShow] = useState(false)
    const [desc, setDesc] = useState('2022-05-10')
    const confirmDate = (values: (string | number)[], options: PickerOption[]) => {
        const date = values.slice(0, 3).join('-');
        setDesc(`${date}`)
    }

    const [validVisible, setValidVisible] = useState(false)
    const [validDesc, setValidDesc] = useState('')
    const confirmValid = (options: PickerOption[], values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setValidDesc(description)
    }

    const submitFailed = (error: any) => {
        Taro.showToast({ title: JSON.stringify(error), icon: 'error' })
    }
    const submitSucceed = (values: any) => {
        Taro.showToast({ title: JSON.stringify(values), icon: 'success' })
    }
    const handleSubmission = () => {
        if (1) {
            // api.submitTemperature(temperature).then(submitSucceed).catch(submitFailed);
            // timeout
            Taro.navigateBack()
        }
        else {
            Taro.showToast({ title: '请填写完整记录', icon: 'none' })
        }

    }

    const handleReset = () => {
        setIdDesc('');
        setDesc('2023-05-10');
        setIdVisible(false); // 关闭 Picker
        setShow(false); // 关闭 DatePicker
        Taro.showToast({ title: '重置成功', icon: 'success' })
    }

    return (
        <>
            <Cell title="接种人" description={idDesc} onClick={() => setIdVisible(!idVisible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="接种人"
                visible={idVisible}
                options={MemberData}
                onConfirm={(list, values) => confirmID(list, values)}
                onClose={() => setIdVisible(false)}
            />
            <Cell title="疫苗名称" description={nameDesc} onClick={() => setNameVisible(!nameVisible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="疫苗名称"
                visible={nameVisible}
                options={VaccineData}
                onConfirm={(list, values) => confirmName(list, values)}
                onClose={() => setNameVisible(false)}
            />
            <Cell title="接种类型" description={idDesc} onClick={() => setTypeVisible(!typeVisible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="接种类型"
                visible={typeVisible}
                options={TypeData}
                onConfirm={(list, values) => confirmType(list, values)}
                onClose={() => setTypeVisible(false)}
            />
            <Cell title="接种时间" description={desc} onClick={() => setShow(true)}
                style={{ textAlign: 'center' }} />
            <DatePicker
                title="接种时间"
                startDate={startDate}
                endDate={endDate}
                visible={show}
                type="date"
                onClose={() => setShow(false)}
                onConfirm={(options, values) => confirmDate(values, options)}
            />
            <Cell title="有效期限" description={idDesc} onClick={() => setValidVisible(!validVisible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="期限"
                visible={validVisible}
                options={MemberData}
                onConfirm={(list, values) => confirmValid(list, values)}
                onClose={() => setValidVisible(false)}
            />
            <div className="flex-content">接种提醒
                <Switch defaultChecked />
            </div>
            <div className="flex-content">接种凭证
                <Uploader
                    url="https://img13.360buyimg.com/imagetools/jfs/t1/169186/5/33010/1762/639703a1E898bcb96/6c372c661c6dddfe.png" />
            </div>
            <TextArea rows={5} autoSize />
            <Button className="submit_btm" formType="submit" type="primary" onClick={handleSubmission} >
                提交
            </Button>
            <Button className="reset_btm" formType="reset" style={{ marginLeft: '20px' }} onClick={handleReset} >
                重置
            </Button>
        </>
    )

}