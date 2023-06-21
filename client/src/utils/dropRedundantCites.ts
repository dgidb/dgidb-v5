export const dropRedundantCites = (cites: any[]) => {
  return cites.reduce((accumulator, cite) => {
    const isDuplicate = accumulator.some(
      (obj: any) => obj.citation === cite.citation
    );
    if (!isDuplicate) accumulator.push(cite);
    return accumulator;
  }, []);
};
