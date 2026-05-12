import React from 'react';

const LiveIndicator = ({ count = 0 }) => {
  return (
    <div className="inline-flex items-center bg-white rounded shadow-md overflow-hidden h-[13px] min-w-[38px]">
      <span className="bg-white text-error text-[5px] font-bold px-1 py-1 animate-blink-live">
        LIVE
      </span>
      <span style={{display:"flex", justifyContent: "center", alignItems: "center"}} className="text-white bg-error text-[8px] font-bold px-1 w-full">
        <span>{count}</span>
      </span>
    </div>
  );
};

export default LiveIndicator;

// Add styles using a separate style tag
const styles = `
  @keyframes blink-live {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  .animate-blink-live {
    animation: blink-live 1s infinite;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);