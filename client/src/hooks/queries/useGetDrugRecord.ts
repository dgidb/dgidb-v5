import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';


const getDrugRecordQuery = gql`
  query genes($names: [String!]!) {
    drugAliases {
      alias
    }
    drugAttributes {
      id
      name
      value
    }
    approved

    interactions {

      gene {
        name
      }

      interactionTypes {
        type
        directionality
      }

      interactionAttributes{
        name
        value
        sources {
          id
        }
      }

      publications{
        id
        pmid
        citation
      }

      interactionScore
    }
  }
  }
`

export function useGetDrugRecord(names: string[]) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getDrugRecordQuery,
      { names }
    );
    return res;
  }, 
  {enabled: names !== []});
}