import { Loading } from '@nutui/nutui-react-taro'

import { useVaccines } from '../../api'
import { Header } from './header'
import VaccineItem from './vaccineItem'

export default function VaccineEnquiry() {
  const { data: vaccineList, isLoading } = useVaccines()

  return (
    <>
      <Header />
      {isLoading ? (
        <Loading className='h-screen w-screen' />
      ) : (
        <>
          <div className='grid grid-cols-2 gap-x-5 gap-y-4 px-6'>
            {vaccineList?.map((vaccine, index) => (
              <VaccineItem key={index} {...vaccine} />
            ))}
          </div>
          <div className='h-32' />
        </>
      )}
    </>
  )
}
