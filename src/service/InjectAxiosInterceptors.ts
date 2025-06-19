import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import setupInterceptors from '.';

function InjectAxiosInterceptors() {
  const history = useNavigate();

  useEffect(() => {
    setupInterceptors(history);
  }, [history]);
  return null;
}

export default InjectAxiosInterceptors;
