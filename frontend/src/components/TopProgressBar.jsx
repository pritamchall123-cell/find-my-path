import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

function TopProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setProgress(20);

    timers.current.push(setTimeout(() => setProgress(55), 80));
    timers.current.push(setTimeout(() => setProgress(80), 200));
    timers.current.push(setTimeout(() => setProgress(100), 380));
    timers.current.push(
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 600)
    );

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-[100] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '150ms' : '250ms',
        }}
      ></div>
    </div>
  );
}

export default TopProgressBar;