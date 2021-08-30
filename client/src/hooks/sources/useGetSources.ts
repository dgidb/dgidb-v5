import { gql, useQuery } from "@apollo/client";
import { Source } from '../../common/interfaces/source.interface'


const GET_SOURCES = gql`
  query GetSources($id: string){
    sources(id: string) {
      source {
        sourceDbName
        sourceDbVersion
      }
    }
  }
`

export const useGetSources = (): Source[] | undefined => {
  const { data } = useQuery(GET_SOURCES);
  return data?.sources?.data?.source
}