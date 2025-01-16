import { useNavigate } from 'react-router-dom';

let navigateFn;

export const NavigationHandler = () => {
  navigateFn = useNavigate();
  return null;
};

export const navigate = (path, options) => {
  if (navigateFn) {
    navigateFn(path, options);
  } else {
    console.error('Navigation Error');
  }
};
