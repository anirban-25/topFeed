import React from "react";
import Masonry from "react-masonry-css";

const RedditMasonryLayout = ({ filteredRedditData }) => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -mx-2"
      columnClassName="px-2 bg-clip-padding"
    >
      {filteredRedditData.map((item, index) => (
        <div
          key={index}
          className="border border-gray-500 border-dotted rounded-lg overflow-hidden mb-4"
        >
          <div className="p-4">
            {item.heading && (
              <h2 className="font-kumbh-sans-bold text-xl font-bold mb-4">
                {item.heading}
              </h2>
            )}

            {item.sub_headings &&
              item.sub_headings.map(
                (subHeading, subIndex) =>
                  subHeading.points &&
                  subHeading.points.length > 0 && (
                    <div key={subIndex} className="mb-4">
                      <h3
                        className="font-kumbh-sans-semibold text-lg font-semibold mb-2"
                        style={{ color: "#146EF5" }}
                      >
                        {formatTitle(subHeading.title)}
                      </h3>
                      <ul className="list-disc pl-5">
                        {subHeading.points.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="font-kumbh-sans-medium text-sm text-gray-600"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
              )}

            {item.title && (
              <div className="mb-4">
                <h3
                  className="font-kumbh-sans-semibold text-lg font-semibold mb-2"
                  style={{ color: "#146EF5" }}
                >
                  {formatTitle(item.title)}
                </h3>
                <ul className="list-disc pl-5">
                  {item.points &&
                    item.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="font-kumbh-sans-medium text-sm text-gray-600"
                      >
                        {point}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </Masonry>
  );
};

const formatTitle = (title) => {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default RedditMasonryLayout;
