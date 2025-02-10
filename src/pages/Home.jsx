import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
  return (
    <div>
      {/* Section1 */}
      <div className=" relative flex mx-auto flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit shadow-md hover:shadow-lg">
            <div className="flex flex-row items-center rounded-full px-10 py-[5px] gap-2 transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRightLong />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-4">
          Empower your future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="w-[90%] mt-4 text-center text-lg font-ssemibold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn more
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className=" mx-20 my-12 shadow-[12px_12px_0_0] shadow-pink-200">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

          {/* Code section 1 */}
          <div className="lg:mx-20 flex">
            <CodeBlocks
              position={"lg:flex-row sm:flex-col"}
              heading={
                <div className=" text-4xl font-semibold">
                  Unlock your
                  <HighlightText text={"coding potential"} /> with our online
                  courses
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "try it yourself",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "learn More",
                linkto: "/login",
                active: false,
              }}
              backgroudGradient={
                "w-50 h-50 bg-gradient-to-r from-richblack-700 via-orange-500 to-red-500 rounded-full shadow-lg"
              }
              codeblock={`<<!DOCTYPE html>\n<html>\nhead>\n<title> Example </title>\n<linkrel="stylesheet href="styles.css">\n</head>\n<body>\n<div>\n<h3> Hello, Coders </h3> \n</div>\n </body>`}
              codeColor={"text-caribbeangreen-100"}
            />
          </div>

          {/* Code section 2 */}
          <div>
            <CodeBlocks
              position={"lg:flex-row-reverse md:flex-col"}
              heading={
                <div className=" text-4xl font-semibold">
                  Start
                  <HighlightText text={"coding in seconds"} />
                </div>
              }
              subheading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctabtn1={{
                btnText: "Continue Lesson",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "learn More",
                linkto: "/login",
                active: false,
              }}
              backgroudGradient={
                "w-50 h-50 bg-gradient-to-r from-richblack-700 via-orange-500 to-red-500 rounded-full shadow-lg"
              }
              codeblock={`<<!DOCTYPE html>\n<html>\nhead>\n<title> Coding Platforms </title>\n<linkrel="stylesheet href="styles.css">\n</head>\n<body>\n<div>\n<h3> Today's Tasks </h3> \n</div>\n </body>`}
              codeColor={"text-caribbeangreen-100"}
            />
          </div>

          <ExploreMore />
        </div>

      {/* Section2 */}
      <div className=" bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto">
            <div className="h-[150px]"></div>
            <div className=" flex flex-row gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore full Catalog
                  <FaArrowRightLong />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/signup"}>
                <div className="flex items-center gap-3">Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-9/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="flex flex-row gap-5 mb-10 mt-10">
            <div className=" text-4xl font-semibold w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 w-[40%] items-start">
              <p className="text-[16px] font-semibold">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>

          <TimeLineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section3 */}
      <div
        className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between
         gap-8 first-letter bg-richblack-900 text-white"
      >
        <InstructorSection />

        <h2 className="text-center text-4xl font-semobold mt-10">
          Review From Other Learners
        </h2>

        {/* ReviewSlider */}
        <ReviewSlider/>

      </div>

      {/* Section4 */}
      <Footer />
    </div>
  );
};

export default Home;
