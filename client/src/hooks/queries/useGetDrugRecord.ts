import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';


// const getDrugRecordQuery = gql`
//   query drugs($name: String!) {
//     drugs(name: $name) {
//       drugAliases {
//         alias
//       }
//     }
//   }
// `

const getDrugRecordQuery = gql`
query drugs($names: [String!]!) {
  drugs(names: $names) {
    nodes {
      drugAliases {
        alias
      }
      drugAttributes {
        id
        name
        value
      }

    }
  }
}
`

// interactions {

//   gene {
//     name
//   }

//   interactionTypes {
//     type
//     directionality
//   }

//   interactionAttributes{
//     name
//     value
//     sources {
//       id
//     }
//   }

//   publications{
//     id
//     pmid
//     citation
//   }

//   interactionScore
// }


export function useGetDrugRecord(names: string[]) {
  return useQuery('drug-record', async () => {
    const res = await graphQLClient.request(
      getDrugRecordQuery,
      { names }
    );
    return res;
  },
  {enabled: names !== []});
}
