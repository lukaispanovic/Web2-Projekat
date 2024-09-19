import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Rerouter = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const inProgress = localStorage.getItem('inProgress');
    const data = JSON.parse(localStorage.getItem('user'));

    if (!location.pathname.startsWith('/inprogress') && !location.pathname.startsWith('/inprogressDriver')) {
      if (inProgress === 'true' && data?.userType === 'User') {
        navigate('/inprogress');
      } else if (inProgress === 'true' && data?.userType === 'Driver') {
        navigate('/inprogressDriver');
      }
    }
  }, [location, navigate]);

  return null; 
};

export default Rerouter;