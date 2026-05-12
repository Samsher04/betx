import { useState, useEffect } from 'react';

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const formatDateTime = () => {
      const now = new Date();

      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const year = now.getFullYear();

      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    setCurrentDateTime(formatDateTime());

    const intervalId = setInterval(() => {
      setCurrentDateTime(formatDateTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p className='text-[12px] px-2' style={{ textWrap: "nowrap" }}>{currentDateTime}</p>
    </div>
  );
};

export default DateTimeDisplay;
