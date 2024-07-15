import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

const Star = ({ stars }) => {
  const ratingStar = Array.from({ length: 5 }, (elem, i) => {
    let number = i + 0.5;
    return (
      <span key={i}>
        {stars >= i + 1 ? (
          <FaStar className=" text-yellow-600 text-xs md:text-sm"/>
        ) : stars >= number ? (
          <FaStarHalfAlt className=" text-yellow-600 text-xs md:text-sm"/>
        ) : (
          <AiOutlineStar className=" text-yellow-600 text-xs md:text-sm"/>
        )}
      </span>
    );
  });
  return <div className="flex ">{ratingStar}</div>;
};


export default Star