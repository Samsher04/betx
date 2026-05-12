import React from "react";
import Marquee from "react-fast-marquee";
import { useSelector } from "react-redux";
import { selectSite, selectSiteNews } from "./helper/commonSelectors";
import DateTimeDisplay from "./DateTimeDisplay";
import SocialLink from "./SocialLink";
const parseNews = (newsHTML) => {
  const div = document.createElement("div");
  div.innerHTML = newsHTML;
  const span = div.querySelector(".news-time");
  const time = span?.textContent || "";
  span?.remove();
  const text = div.textContent?.trim() || "";
  return { time, text };
};

const ScrollingFooter = () => {
  const news = useSelector(selectSiteNews());
  const topHeaderColor = useSelector(selectSite())?.topBarColor;

  const siteDetails = useSelector(selectSite());

  return (
    <footer
      className="p-1 top-0 flex md:fixed w-full text-white font-normal text-sm sm:text-[14px]"
      style={{
        backgroundImage: `linear-gradient(180deg, ${topHeaderColor?.start}, ${topHeaderColor?.end})`,
      }}
    >
       <div>
        <SocialLink />
      </div>
      <Marquee style={{ textTransform: "capitalize" }}>
        {news?.length > 0 ? (
          <>
            {news.map((item, index) => {
              const { time, text } = parseNews(item);
              return (
                <div key={index} className="mr-4">
                  <span className="italic text-[#f5f5f5] bg-[#023047] px-2 py-[1px] rounded mr-2">
                    {time}
                  </span>
                  <span>{text}</span>
                </div>
              );
            })}
          </>
        ) : (
          <p>
            {" "}
            Welcome to{" "}
            <span className="text-[#198754]">{siteDetails?.siteName} </span>!
            Join thousands of players betting live, winning big, and enjoying
            the ultimate betting rush. Ready to play smart and win bigger? Let’s
            go!
          </p>
        )}
      </Marquee>
      <div>
        <DateTimeDisplay />
      </div>
    </footer>
  );
};

export default ScrollingFooter;
