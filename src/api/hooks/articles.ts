import useSWRInfinite from 'swr/infinite'
import { useCommunityStore } from '../../models'
import api from '../../api/'

const PAGESIZE = 5

export const useArticles = () => {
  const filter = useCommunityStore.use.vaccineId()

  return {
    ...useSWRInfinite(
      (index) =>
        filter
          ? `/api/articles?page=${index + 1}&size=${PAGESIZE}&isBind=true&vaccineID=${filter}`
          : `/api/articles?page=${index + 1}&size=${PAGESIZE}`,
      (url) => api.get(url).then((res) => res.data),
      { dedupingInterval: 1000 * 10 }
    ),
    PAGESIZE,
  }
}
