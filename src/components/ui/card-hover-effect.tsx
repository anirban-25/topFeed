import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MouseEventHandler, useState } from "react";
import img from "../../../public/card1.jpg";
import { StarIcon } from "@heroicons/react/solid";
import Star from "@/utils/Star";
import { useRouter } from "next/navigation";
import EmailSignUp from "../EmailSignUp";
export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    image: string;
    description: string;
    rating: number;
    price: string;
    link: string;
    ratings: number;
    students: number;
    isCourse: boolean;
    check: boolean;
  }[];
  className?: string;
}) => {
  const [isEmailSignUpOpen, setIsEmailSignUpOpen] = useState(false);
  const handleCloseModal = () => {
    setIsEmailSignUpOpen(false);
  };
  const router = useRouter();
  const goToCourse = (check: any, link: any) => {
    if (check === true) {
      router.push(link);
    } else {
      setIsEmailSignUpOpen(true);
    }
  };
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid  md:grid-cols-3  lg:grid-cols-4 ", className)}>
      {items.map((item, idx) => (
        <div
          key={item?.link}
          className="relative group p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => goToCourse(item?.check, item?.link)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-600/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className={cn(item.isCourse ? " h-full bg-white" : "h-full bg-black/[0.1]")}>
            <Image
              src={item.image}
              alt="Sample Image"
              width={700} // Specify your desired width
              height={900}
              className="rounded-xl "
            />
            <div className="h-full px-3 pb-2">
              <div className="flex justify-start mt-2 md:mb-5 h-12 md:h-16 ">
                <div className="text-sm md:text-lg font-gilroy-bold text-black text-left ">
                  {item.title}:&nbsp;
                  <span className="text-sm md:text-lg font-gilroy-bold text-gray-800">
                    {item.description}
                  </span>
                </div>
              </div>
              <div className="text-black text-xs text-left font-gilroy-light">
                Favtutor
              </div>
              {item.isCourse ? (
                <div className="flex items-center gap-x-2">
                  <div className="flex justify-start text-xs md:text-sm text-black font-bold">
                    {item.rating}
                  </div>
                  <div className="flex">
                    <Star stars={item.rating} />
                  </div>
                  <div className="text-black text-xs md:flex hidden underline">
                    ({item.students} students)
                  </div>
                </div>
              ): (
                <div className="md:mt-7"/>
              )}
              <div className="flex justify-start text-gray-800 text-sm font-extrabold mt-2">
                ${item.price}
              </div>
              <div className="mt-1 md:mt-2 bg-[#FB8800] rounded-xl p-2 items-end text-sm md:text-base font-gilroy-bold cursor-pointer">
                Visit Course
              </div>
            </div>
          </Card>
        </div>
      ))}
      <div className="text-base mx-1">
        {isEmailSignUpOpen && <EmailSignUp onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full pb-1 overflow-hidden  border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100  x-wide ", className)}>{children}</h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        " text-zinc-400 tracking- leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
