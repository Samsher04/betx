import React from "react";
import "../../SkyExchangeSrc/src/assets/styles/Loading.css";
import { useSelector } from "react-redux";
import { selectSite } from "./helper/commonSelectors";
import { useLocation } from "react-router-dom";

const Loader = () => {
  const location = useLocation();
  const siteDetails = useSelector(selectSite());

  // If URL contains "/score", do not render the loader
  if (location.pathname.includes("/score")|| location.pathname.includes("/tv")) {
    return null;
  }  
  return (
    <>
      <div className="black-overlay"></div>
      <div className="loading-wrap-wrapper">
        <div className="loading-wrap">
          <ul className="loading">
            <li>
              <div className="loading-spinner-dual-ball">
                <div className="loader">
                  <div></div>
                  <div
                  style={{
                    background: siteDetails?.headerColor
                      ? `linear-gradient(180deg, ${siteDetails?.headerColor?.start}, ${siteDetails?.headerColor?.end})`
                      : "red"
                  }}
                  
                  ></div>
                  <div></div>
                </div>
              </div>
            </li>
            <li>Loading...</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Loader;
