import useSWR from 'swr'
import { getUserPublic } from '../methods'

export function useUserPublic(userID?: number) {
  return useSWR(userID ? [userID, 'getUserPublic'] : null, ([id]) => getUserPublic(id), {
    revalidateIfStale: false,
  })
}
