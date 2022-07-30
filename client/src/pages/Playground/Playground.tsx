// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

// components
import { Playground, store } from 'graphql-playground-react'


// <link
//   href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Source+Code+Pro:400,700"
//   rel="stylesheet"
// />



export const Test = () => {

    return(

          <Playground endpoint='http://localhost:3001/api/graphql' />
    )


}