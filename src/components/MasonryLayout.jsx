import React from "react";
import Masonry from "react-masonry-css";
import { CheckCircle, AlertCircle } from "lucide-react";

const MasonryLayout = ({
  filteredTweets,
  getRelevancyColor,
  handleImageLoad,
  handleImageError,
}) => {
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
      {filteredTweets.map((tweet) => (
        <div
          key={tweet.id}
          className="border border-gray-500 border-dotted rounded-lg overflow-hidden mb-4"
        >
          <div
            className={`${getRelevancyColor(
              tweet.relevancy
            )} text-white font-kumbh-sans-bold py-2 px-4 flex items-center justify-between`}
          >
            <span>Relevancy: {tweet.relevancy}</span>
            {tweet.relevancy.toLowerCase() === "high" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>
          <div className="p-4">
            <div
              className="tweet-content"
              dangerouslySetInnerHTML={{ __html: tweet.content_html }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
