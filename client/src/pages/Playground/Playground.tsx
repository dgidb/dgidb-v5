// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';

const query1 = `
query targetDetails{
  target(q:{sym:"ACE2"}) {
    name
    tdl
    fam
    sym
    description
    novelty
  }
}`;
const query2 = `
query diseaseDetails{
  disease(name:"asthma"){
    name
    mondoDescription
    uniprotDescription
    doDescription
    targetCounts {
      name
      value
    }
    children {
      name
      mondoDescription
    }
  }
}`;
const query3 = `
query ligandDetails{
  ligand(ligid: "haloperidol") {
    name
    description
    isdrug
    synonyms {
      name
      value
    }
    smiles
    activities {
      target {
        sym
      }
      type
      value
    }
  }
}`;

export const Playground = () => {
  return(
     <>
      <iframe id="playground" src={"https://pharos-api.ncats.io/graphql"} height="700" width="1750" />
      <button onClick={() => setQuery(query1)}>Example 1</button>
      <button onClick={() => setQuery(query2)}>Example 2</button>
      <button onClick={() => setQuery(query3)}>Example 3</button>
     </>
  )
}

function setQuery(newUrl: string) {
   var playgroundiframe = document.getElementById('playground') as HTMLImageElement | null;
   const url = `https://pharos-api.ncats.io/graphql?query=${encodeURI(newUrl)}`;
   if(playgroundiframe != null) playgroundiframe.src = url;
}