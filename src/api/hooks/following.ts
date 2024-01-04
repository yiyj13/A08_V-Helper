import useSWR from 'swr'
import { useCallback } from 'react'

import { getUserFollowing } from '../methods'

export function useUserFollowing() {
  const { data, ...rest } = useSWR('getUserFollowing', getUserFollowing, {
    revalidateIfStale: false,
  })
  const checkVaccineFollowed = useCallback(
    (vaccineId?: number) => {
      return data?.followingVaccines.some((vaccine) => vaccine.ID === vaccineId) || false
    },
    [data]
  )
  const checkArticleFollowed = useCallback(
    (articleId?: number) => {
      return data?.followingArticles.some((article) => article.ID === articleId) || false
    },
    [data]
  )
  return {
    ...rest,
    checkVaccineFollowed,
    checkArticleFollowed,
    data,
  }
}
