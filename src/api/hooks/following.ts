import useSWR from 'swr'

import { getUserFollowing } from '../methods'

export function useUserFollowing() {
  return useSWR('getUserFollowing', getUserFollowing, {
    revalidateIfStale: false,
  })
}
