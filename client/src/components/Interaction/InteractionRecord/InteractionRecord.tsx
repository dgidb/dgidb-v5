import React from "react";
import { useGetInteractionRecord } from "hooks/queries/useGetInteractionRecord";


export const InteractionRecord: React.FC = () => {

    const { data } = useGetInteractionRecord('f132437e-53e3-4ab3-98a2-b75608f43d4d');


    return(
    <p>hello</p>
    );
};