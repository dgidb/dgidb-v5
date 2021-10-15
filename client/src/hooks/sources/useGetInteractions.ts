import { gql, useQuery } from "@apollo/client";
import { Response } from '../../common/interfaces/response.interface'




export const GetInteractions = (id: string) => {
  const GET_INTERACTIONS = gql`
query gene($id: String!) {
  gene(id: $id) {
    interactions{interactionClaims{drugClaim{drug{name}}}}
  }
}
`
  const {data} = useQuery(GET_INTERACTIONS, {
    variables: { id: id} 
  })

  return data;
}

  // const GET_GENE = gql`
  // query gene($id: String!) {
  //   gene(id: $id) {
  //     interactions{interactionClaims{drugClaim{drug{name}}}}
  //   }
  // }
  // `

  // const {refetch} = useQuery(GET_GENE, {
  //   variables: { id: input}
  // })

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const res = await refetch();
  //   setResult(JSON.stringify(res.data.gene.interactions));
