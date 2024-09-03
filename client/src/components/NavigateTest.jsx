import { useNavigate } from 'react-router-dom';

const NavigationTest = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    console.log('Attempting navigation to /courses/create');
    navigate('/courses/create');
    console.log('Navigation function called');
  };

  return (
    <div>
      <h2>Navigation Test</h2>
      <button onClick={handleNavigation}>Navigate to Create Course</button>
    </div>
  );
};

export default NavigationTest;