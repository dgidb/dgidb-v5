import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useStorePreviousURL = () => {
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname + location.search);

  useEffect(() => {
    // Store the previous URL in session storage before updating the current URL
    sessionStorage.setItem('previousURL', prevLocationRef.current);
    // Update the reference to the current URL
    prevLocationRef.current = location.pathname + location.search;
  }, [location]);

  return prevLocationRef.current;
};

export default useStorePreviousURL;
