import { Button } from '@nutui/nutui-react-taro'
import { IconFont, Edit, Eye } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

import { useProfiles } from '../../api'

import { Profile } from '../../api/methods'

export default function Member() {
  const {data: memberDataList} = useProfiles()

  const handleAddMember = () => {
    Taro.navigateTo({ url: '/pages/addMember/index' })
  }

  return (
    <div style={{ height: '100%', position: 'relative', paddingBottom: '70px' }}>
      {memberDataList?.map((item, index) => (
        <ItemRender data={item} key={index} />
      ))}
      <Button
        type='primary'
        onClick={handleAddMember}
        style={{ width: '90%', position: 'fixed', bottom: '10px', marginLeft: '5%', marginRight: '5%', zIndex: 999 }}
      >
        新增成员
      </Button>
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
    <div
      className='border border-gray-300 p-4 rounded-md'
      style={{ borderRadius: '8px', marginLeft: '10px', marginRight: '10px' }}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <IconFont className='text-2xl mr-2' name={data.avatar} style={{ width: '60px', height: '60px' }} />
          <div>
            <span className='font-bold' style={{ color: '#4796A1' }}>
              {data.relationship}
            </span>
            <span className='font-bold text-lg'>{data.fullName}</span>
          </div>
        </div>
        <div className='flex items-center'>
          <Eye className='cursor-pointer' onClick={() => handleDocument(data)} style={{ marginRight: '10px' }} />
          <Edit className='cursor-pointer' onClick={() => handleEditMember(data)} />
        </div>
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          性别 <b className='text-black font-bold'>{data.gender}</b>
        </div>
        <div className='text-gray-500'>
          出生日期 <b className='text-black font-bold'>{data.dateOfBirth}</b>
        </div>
      </div>
    </div>
  )
}
