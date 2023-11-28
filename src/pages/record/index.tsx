/* TODO: 
    1. Coordinate with the backend APIs (implemented)
    2. Add a ComboBox component to replace the Picker component
    3. Simplify the code
    4. CSS style for the menu and the buttons
*/

import Taro from '@tarojs/taro'
import { useState } from "react";
import { Cell, Switch, Picker, Uploader, Button, DatePicker } from '@nutui/nutui-react-taro';
import { TextArea } from '@nutui/nutui-react-taro';
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types';

// import {ComboBox} from 'src/components/combobox';

type RecordData = {
    id: number // 接种人
    name: string // 疫苗名称
    type: string // 接种类型
    time: string // 接种时间
    valid: string // 有效期
    reminder: boolean // 接种提醒
    voucher: string // 接种凭证
    note: string // 备注
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

    const ValidData = [
        [
            { value: 0, text: '一年', },
            { value: 1, text: '两年', },
            { value: 2, text: '三年', },
            { value: 3, text: '四年', },
            { value: 4, text: '五年', },
            { value: 5, text: '六年', },
            { value: 6, text: '七年', },
            { value: 7, text: '八年', },
            { value: 8, text: '九年', },
            { value: 9, text: '十年', },
        ]
    ]

    const [record, setRecord] = useState<RecordData>({
        id: -1,
        name: '',
        type: '',
        time: '',
        valid: '',
        reminder: true,
        voucher: '',
        note: '',
    });

    const [idVisible, setIdVisible] = useState(false)
    const [idDesc, setIdDesc] = useState('')
    const confirmID = (options: PickerOption[], values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setIdDesc(description)
        setRecord({
            ...record,
            id: values[0] as number,
        });
    }

    const [nameVisible, setNameVisible] = useState(false)
    const [nameDesc, setNameDesc] = useState('')
    const confirmName = (options: PickerOption[], _values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setNameDesc(description)
        setRecord({
            ...record,
            name: description,
        });
    }

    const [typeVisible, setTypeVisible] = useState(false)
    const [typeDesc, setTypeDesc] = useState('')
    const confirmType = (options: PickerOption[], _values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setTypeDesc(description)
        setRecord({
            ...record,
            type: description,
        });
    }

    const startDate = new Date(2000, 0, 1)
    const endDate = new Date(2025, 11, 30)
    const [dateVisible, setDateVisible] = useState(false)
    const [dateDesc, setDateDesc] = useState('2023-11-22')
    const confirmDate = (values: (string | number)[], _options: PickerOption[]) => {
        const date = values.slice(0, 3).join('-');
        setDateDesc(`${date}`)
        setRecord({
            ...record,
            time: date,
        });
    }

    const [validVisible, setValidVisible] = useState(false)
    const [validDesc, setValidDesc] = useState('')
    const confirmValid = (options: PickerOption[], _values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setValidDesc(description)
        setRecord({
            ...record,
            valid: description,
        });
    }
    const onSwitchChange = (value: boolean) => {
        setRecord({
            ...record,
            reminder: value,
        });
    }

    const onTextChange = (value: string) => {
        setRecord({
            ...record,
            note: value,
        });
    }

    const handleSubmission = async() => {
        console.log('record:', record);// for debug
        if (record && record.id >= 0 && record.name && record.type && record.valid) {
            // try {
            //     Taro.request({
            //         url: 'src/api/vaccination-records',
            //         data: record,
            //         method: 'POST',
            //         header: {
            //             'content-type': 'application/json'
            //         },
            //         success: function (res) {
            //             console.log(res.data)
            //             Taro.showToast({ title: '提交成功', icon: 'success' })
            //             // Taro.navigateBack()
            //         }
            //     })
            // } catch (error) {
            //     console.error('Error submitting vaccination record:', error);
            //     Taro.showToast({ title: '发生错误，请稍后重试', icon: 'error' });
            // }
            Taro.showToast({ title: '提交成功', icon: 'success' })

        } else {
            Taro.showToast({ title: '请填写完整记录', icon: 'error' });
        }

    }

    const handleReset = () => {
        setRecord({
            id: -1,
            name: '',
            type: '',
            time: '',
            valid: '',
            reminder: true,
            voucher: '',
            note: '',
        });
        setIdDesc('');
        setNameDesc('');
        setTypeDesc('');
        setDateDesc('2023-11-28');
        setValidDesc('');
    
        setIdVisible(false);
        setNameVisible(false);
        setTypeVisible(false);
        setDateVisible(false);
        setValidVisible(false);
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
            <Cell title="接种类型" description={typeDesc} onClick={() => setTypeVisible(!typeVisible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="接种类型"
                visible={typeVisible}
                options={TypeData}
                onConfirm={(list, values) => confirmType(list, values)}
                onClose={() => setTypeVisible(false)}
            />
            <Cell title="接种时间" description={dateDesc} onClick={() => setDateVisible(true)}
                style={{ textAlign: 'center' }} />
            <DatePicker
                title="接种时间"
                startDate={startDate}
                endDate={endDate}
                visible={dateVisible}
                type="date"
                onClose={() => setDateVisible(false)}
                onConfirm={(options, values) => confirmDate(values, options)}
            />
            <Cell title="有效期限" description={validDesc} onClick={() => setValidVisible(!validVisible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="期限"
                visible={validVisible}
                options={ValidData}
                onConfirm={(list, values) => confirmValid(list, values)}
                onClose={() => setValidVisible(false)}
            />
            <div className="flex-content">接种提醒
                <Switch defaultChecked onChange={(value) => onSwitchChange(value)} />
            </div>
            <div className="flex-content">接种凭证
                <Uploader
                    url="https://img13.360buyimg.com/imagetools/jfs/t1/169186/5/33010/1762/639703a1E898bcb96/6c372c661c6dddfe.png" />
            </div>
            <TextArea rows={5} autoSize onChange={(value) => onTextChange(value)}/>
            <Button className="submit_btm" formType="submit" type="primary" onClick={handleSubmission} >
                提交
            </Button>
            <Button className="reset_btm" formType="reset" style={{ marginLeft: '20px' }} onClick={handleReset} >
                重置
            </Button>
        </>
    )

}