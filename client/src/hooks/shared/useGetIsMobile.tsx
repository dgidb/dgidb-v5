import useMediaQuery from '@mui/material/useMediaQuery';

export function useGetIsMobile() {
  const isMobile = useMediaQuery('(max-width: 1000px)');
  return isMobile;
}
