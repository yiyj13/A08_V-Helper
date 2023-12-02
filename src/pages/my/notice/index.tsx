import { Checkbox } from '@nutui/nutui-react-taro';

export default function Index () {
  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='flex flex-col h-11/12 w-11/12 m-4 rounded-2xl std-box-shadow'>
        
        <div className="flex flex-row-reverse m-4">
          <div className='p-2'>
            <Checkbox
              labelPosition="left" label="开启消息通知"
              defaultChecked={true}
            />
          </div>
        </div>
        
        <div className='h-[75vh] overflow-auto m-4'>
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
          <ListItem
            profile='张三'
            vaccine='新冠疫苗'
            type='第一针'
            time='2021-09-01' />
        </div>
      </div>
    </div>
  )
}

interface IListItem {
  profile: string;
  vaccine: string;
  type: string;
  time: string;
}

function ListItem(props: IListItem) {
  return (
    <div className='flex flex-row justify-evenly items-center m-2 p-2 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-400 text-white'>

        <div className='text-lg'>{props.profile}</div>
        
        <div className='flex flex-col'>
          <div className='text-lg'>{props.vaccine}</div>
          <div className='text-sm'>{props.type}</div>
        </div>
        
        <div className='text-sm'>{props.time}</div>

    </div>
  )
}