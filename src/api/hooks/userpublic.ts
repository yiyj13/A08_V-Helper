import useSWR from 'swr'
import { getUserPublic } from '../methods'
import { getUserID } from '../../models'

export function useUserPublic(userID?: number | null) {
  if (!userID) userID = getUserID()
  return useSWR(userID ? [userID, 'getUserPublic'] : null, ([id]) => getUserPublic(id), {
    revalidateIfStale: false,
  })
}
