import { useGetInteractionClaimTypes } from 'hooks/queries/useGetInteractionClaimTypes';

export const TypesTable: React.FC = () => {

  const { data } = useGetInteractionClaimTypes();
  return (
    <p>This text is from the types table!</p>
  )
};