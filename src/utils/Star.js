import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

const Star = ({ stars }) => {
  const ratingStar = Array.from({ length: 5 }, (elem, i) => {
    let number = i + 0.5;
    return (
      <span key={i}>
        {stars >= i + 1 ? (
          <FaStar className="text-transparent bg-clip-text bg-gradient-to-r from-[#55A3F8]  to-[#7567D9] text-xs md:text-sm"/>
        ) : stars >= number ? (
          <FaStarHalfAlt className="text- bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9] text-xs md:text-sm"/>
        ) : (
          <AiOutlineStar className="text- bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9] text-xs md:text-sm"/>
        )}
      </span>
    );
  });
  return <div className="flex ">{ratingStar}</div>;
};


export default Star