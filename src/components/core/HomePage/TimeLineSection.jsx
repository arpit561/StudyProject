import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png";

const timeline = [
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully commited to the success company",
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Student will always be our top proirity",
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    Heading: "Solve the Problem",
    Description: "Code your way to a Solution",
  },
];

const TimeLineSection = () => {
  return (
    <div>
      <div className="flex flex-row gap-15 items-center">
        {/* Left section */}
        <div className="w-[45%] flex flex-col gap-5">
          {timeline.map((element, index) => {
            return (
              <div key={index}>
                <div className=" flex flex-row gap-6" key={index}>
                  <div className="w[50px] h-[50px] bg-white flex items-center">
                    <img src={element.Logo} alt="TimeLineImage" />
                  </div>

                  <div>
                    <h2 className=" font-semibold text-[18px]">
                      {element.Heading}
                    </h2>
                    <p className=" text-base">{element.Description}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full ml-4">
                  <span className="border-l-2 border-gray-300 h-full">|</span>
                  <span className="border-l-2 border-gray-300 h-full">|</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right section */}
        <div className=" relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          <img
            src={timelineImage}
            alt="timelineImage2"
            className=" shadow-richblack-500 object-cover h-fit"
          />

          <div
            className=" absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
           left-[50px] translate-x-[5%] translate-y-[-50%]"
          >
            <div className=" flex flex-row gap-5 items-center border-r border-caribbeangreen-300">
              <p className=" text-3xl font-bold">10</p>
              <p className=" text-caribbeangreen-300 text-sm">
                Years of experience
              </p>
            </div>

            <div className="flex gap-5 items-center px-7">
              <p className=" text-3xl font-bold">20</p>
              <p className=" text-caribbeangreen-300 text-sm">
                Type of cCourses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLineSection;
