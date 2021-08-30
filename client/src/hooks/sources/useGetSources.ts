import { gql, useQuery } from "@apollo/client";
import { Response } from '../../common/interfaces/response.interface'


const GET_SOURCES = gql`
  query source($id: string) {
    source(id: string) {
      data {
        source {
          sourceDbName
          sourceDbVersion
        }
      }
    }
  }
`

export const useGetSources = (id: string): Response => {
  const { data } = useQuery(GET_SOURCES, {
    variables: {id},
  });
  return data
}