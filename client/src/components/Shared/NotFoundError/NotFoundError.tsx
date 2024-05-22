import { Alert, Box, Link } from '@mui/material';
import './NotFoundError.scss';
import { useNavigate } from 'react-router-dom';

interface Props {
  errorMessage: string
}

export const NotFoundError: React.FC<Props> = ({errorMessage}) => {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection='column' p={2}>
      <Alert severity="error">
        {errorMessage}
      </Alert>
      <Box display='flex' flexDirection='column' mt={3}>
      <Link onClick={() => navigate(-1)} sx={{cursor: 'pointer', marginBottom: '15px'}}>Click here to go back to the previous page.</Link>
      <Link href='/' sx={{cursor: 'pointer'}}>Click here to go to the home page.</Link>
      </Box>
      <img
        src="/images/dgidb-404-logo.png"
        alt="404 error"
        className="not-found-404"
      />
    </Box>
  );
};
