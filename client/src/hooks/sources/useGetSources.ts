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

export const useGetSources = (id: string): [] => {
  const { data } = useQuery(GET_SOURCES, {
    variables: {id}
  });
  return data?.sources?.data?.source
}