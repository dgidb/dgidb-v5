import useMediaQuery from '@mui/material/useMediaQuery';

export function useGetIsMobile() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile;
}
