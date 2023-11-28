/* TODO:
    1. Add a ComboBox component to replace the Picker component
    2. CSS style for the text and the buttons
    3. Coordinate with the backend APIs (to be implemented)
    4. Gradient color for the slider 
*/

import { useState } from "react";
import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { Picker, Range, DatePicker, Cell, Button } from '@nutui/nutui-react-taro';
import { PickerOption } from "@nutui/nutui-react-taro/dist/types/packages/picker/types";

// import api from '../../api'
// import {ComboBox} from 'src/components/combobox';

type TemperData = {
    id: number // 测温人
    time: string // 测温时间
    val: number // 体温值
}

// type MemberData = {
//     id: number,
//     name: string,
// }

export default function TemperRecord() {
    const [visible, setVisible] = useState(false)
    const [baseDesc, setBaseDesc] = useState('')
    const MemberData = [
        [
            { value: 0, text: '本人', },
            { value: 1, text: '父亲', },
            { value: 2, text: '女儿', },
        ],
    ]

    const [temperature, setTemperature] = useState<TemperData>({
        id: -1,
        time: '2023-11-27 12:00',
        val: 36.2,
    });

    const updateTemperature = (value: number) => {
        const newTemperature = {
            ...temperature,
            val: value
        };
        setTemperature(newTemperature);
    };

    // const [MemberList, setMemberList] = useState<MemberData[] | null>()

    // useEffect(() => {
    //     api.request({ url: '/api/member' }).then((res) => {
    //         const result = res.data as MemberData[]
    //         setMemberList(result)
    //     })
    // }, [])

    // if (!MemberList) {
    //     return <Loading className='h-screen w-screen' />
    // }
    const confirmPicker = (options: PickerOption[], values: (string | number)[]) => {
        let description = ''
        options.forEach((option: any) => {
            description += option.text
        })
        setBaseDesc(description)
        setTemperature({
            ...temperature,
            // get the coordinate value in MemberData according to option.text
            id: values[0] as number,
        });
    }

    const startDate = new Date(2000, 0, 1)
    const endDate = new Date(2025, 11, 30)
    const [show, setShow] = useState(false)
    const [desc, setDesc] = useState('2022-05-10 10:10')
    const confirm = (values: (string | number)[], _options: PickerOption[]) => {
        const date = values.slice(0, 3).join('-');
        const time = values.slice(3).join(':');
        setDesc(`${date} ${time}`)
    }

    // TODO: coordinate with the APIs to be implemented by the backend
    const handleSubmission = () => {
        if (temperature.id >= 0) {
            // api.submitTemperature(temperature).then(submitSucceed).catch(submitFailed);
            // timeout
            Taro.navigateBack()
        }
        else {
            Taro.showToast({ title: '请填写完整记录', icon: 'error' })            
        }

    }

    const handleReset = () => {
        setTemperature({
            id: -1,
            time: '2023-11-27 12:00',
            val: 36.2,
        });
        setBaseDesc('');
        setDesc('2022-05-10 10:10');
        setVisible(false); // 关闭 Picker
        setShow(false); // 关闭 DatePicker
        Taro.showToast({ title: '重置成功', icon: 'success' })
    }

    return (
        <>
            <Cell title="测温人员" description={baseDesc} onClick={() => setVisible(!visible)}
                style={{ textAlign: 'center' }} />
            <Picker
                title="member"
                visible={visible}
                options={MemberData}
                onConfirm={(list, values) => confirmPicker(list, values)}
                onClose={() => setVisible(false)}
            />
            <Cell title="测温时间" description={desc} onClick={() => setShow(true)}
                style={{ textAlign: 'center' }} />
            <DatePicker
                title="date"
                startDate={startDate}
                endDate={endDate}
                visible={show}
                type="datetime"
                onClose={() => setShow(false)}
                onConfirm={(options, values) => confirm(values, options)}
            />

            {/* <View id='temper_slider' style={{ textAlign: 'center' }}>
                <Text id="temper_val"> 体温: {temperature.val} ℃</Text>
                <Slider step={0.1} value={temperature.val} showValue min={34} max={42} onChanging={(value) => updateTemperature(value)} />
            </View> */}
            <>
                <Cell.Group
                    divider={false}
                >
                    <Cell className="temper_val_display" style={{ textAlign: 'center', padding: '10px,18px' }}>
                        <Text id="temper_val" >{temperature.val} ℃</Text>
                    </Cell>
                    <Cell className="slider" style={{ padding: '20px,18px' }}>
                        <Range
                            defaultValue={36.2}
                            maxDescription={42.0}
                            minDescription={34.0}
                            max={42.0}
                            min={34.0}
                            step={0.1}
                            currentDescription={null}
                            marks={{
                                35.0: 35.0,
                                36.0: 36.0,
                                37.0: 37.0,
                                38.0: 38.0,
                                39.0: 39.0,
                                40.0: 40.0,
                                41.0: 41.0,
                            }}
                            onChange={(val) => {
                                if (typeof val === 'number') {
                                    updateTemperature(parseFloat(val.toFixed(1)));
                                }
                            }}
                        />
                    </Cell>
                </Cell.Group>
            </>

            <Button className="submit_btm" formType="submit" type="primary" onClick={handleSubmission} >
                提交
            </Button>
            <Button className="reset_btm" formType="reset" style={{ marginLeft: '20px' }} onClick={handleReset} >
                重置
            </Button>
        </>
    );
};