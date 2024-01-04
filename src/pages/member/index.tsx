import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'

import { useProfiles } from '../../api'

import { Profile } from '../../api/methods'

import { CheckProfileWrap } from '../../components/checkprofilewrap'

export default function Index() {
  return (
    <CheckProfileWrap>
      <Members />
    </CheckProfileWrap>
  )
}

const Members = () => {
  const { data: memberDataList } = useProfiles()

  const handleAddMember = () => {
    Taro.navigateTo({ url: '/pages/addMember/index' })
  }

  return (
    <div className='max-w-2xl mx-auto px-6'>
      <div className='items-center justify-between flex mt-4'>
        <div>
          <h4 className='text-gray-800 text-2xl font-semibold'>成员档案</h4>
          <p className='text-gray-400'>管理你的家庭成员</p>
        </div>
        <Button
          type='primary'
          className='inline-flex items-center justify-center gap-1 py-2 px-3 mt-2 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg sm:mt-0'
          onClick={handleAddMember}
        >
          添加成员
        </Button>
      </div>
      <ul className='mt-12 divide-y divide-gray-100'>
        {memberDataList?.map((item) => (
          <ItemRender data={item} key={item.ID} />
        ))}
      </ul>
    </div>
  )
}

const ItemRender = ({ data }: { data: Profile }) => {
  const handleEditMember = (memberData: Profile) => {
    Taro.navigateTo({
      url: '/pages/addMember/index?id=' + memberData.ID,
    })
  }

  const handleDocument = (memberData: Profile) => {
    Taro.navigateTo({
      url: `/pages/document/index?id=` + memberData.ID,
    })
  }

  return (
    <li className='py-5 flex items-start justify-between'>
      <div className='flex gap-3 items-center'>
        <Image
          src={data?.avatar ?? ''}
          className='h-12 w-12 animate-fade-in rounded-full object-cover bg-slate-100 shadow-sm'
          mode='aspectFill'
        />
        <div className='flex flex-col'>
          <span className='block text-base text-brand font-semibold'>{data.relationship}</span>
          <span className='block text-lg text-gray-700 font-semibold'>{data.fullName}</span>
          <div className='flex gap-x-2'>
            <span className='block text-sm text-gray-600'>{'性别 '}</span>
            <span className='block text-sm font-semibold'>{data.gender}</span>
          </div>
          <div className='flex gap-x-2'>
            <span className='block text-sm text-gray-600'>{'生日 '} </span>
            <span className='block text-sm font-semibold'>{data.dateOfBirth}</span>
          </div>
        </div>
      </div>
      <div className='flex gap-x-2'>
        <label
          className='text-sm border rounded-lg px-3 text-brand py-2 duration-150 bg-white active:bg-gray-100'
          onClick={() => handleDocument(data)}
        >
          查看
        </label>
        <label
          className='text-sm border rounded-lg px-3 text-brand py-2 duration-150 bg-white active:bg-gray-100'
          onClick={() => handleEditMember(data)}
        >
          编辑
        </label>
      </div>
    </li>
  )
}
