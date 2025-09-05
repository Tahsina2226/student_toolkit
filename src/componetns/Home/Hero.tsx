import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      id: "schedule",
      title: "Class Schedule Tracker",
      description:
        "Never miss a lecture with our intuitive class scheduling system. Organize your weekly timetable with color-coded subjects.",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-[#7D8F69] to-[#A2AF9B]",
      image: "https://thumbs.dreamstime.com/b/class-schedule-7582513.jpg",
      details: [
        "Add, edit, or delete classes",
        "Color coding for different subjects",
        "Track subject, time, day, and instructor",
      ],
    },
    {
      id: "budget",
      title: "Budget Tracker",
      description:
        "Manage your finances effectively. Track income, expenses, and savings with visual charts and insightful analytics.",
      icon: <DollarSign className="w-8 h-8" />,
      color: "from-[#E8D7C3] to-[#DCCFC0]",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1011&q=80",
      details: [
        "Add income sources",
        "Track expenses by category",
        "Visual representation with charts",
      ],
    },
    {
      id: "exam",
      title: "Exam Q&A Generator",
      description:
        "Prepare for exams with AI-powered question generation. Create practice tests tailored to your study materials.",
      icon: <FileText className="w-8 h-8" />,
      color: "from-[#8D9C84] to-[#A2AF9B]",
      image:
        "https://images.unsplash.com/photo-1561089489-f13d5e730d72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      details: [
        "Generate practice questions",
        "Multiple question types (MCQs, short answers)",
        "Adjustable difficulty levels",
      ],
    },
    {
      id: "planner",
      title: "Study Planner",
      description:
        "Break down big study goals into manageable tasks. Allocate time slots and track your progress efficiently.",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-[#5A6D57] to-[#7D8F69]",
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      details: [
        "Allocate time for each subject",
        "Set priorities and deadlines",
        "Track your study progress",
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-gradient-to-br from-[#FAF9EE] to-[#f5f4e5] shadow-lg border border-[#A2AF9B]/30 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="top-0 left-0 absolute bg-[#7D8F69] rounded-full w-72 h-72 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="right-0 bottom-0 absolute bg-[#E8D7C3] rounded-full w-96 h-96 translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="z-10 relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-bold text-[#2F3E2F] text-4xl sm:text-5xl lg:text-6xl">
              Your All-in-One
              <span className="block bg-clip-text bg-gradient-to-r from-[#7D8F69] to-[#5A6D57] text-transparent">
                Student Companion
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-gray-700 text-lg">
              Organize your academic life with our suite of tools designed to
              help you succeed in your studies and beyond.
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <button
              onClick={prevSlide}
              className="top-1/2 left-0 z-20 absolute bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full transition-colors -translate-x-4 -translate-y-1/2"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-5 h-5 text-[#5A6D57]" />
            </button>

            <button
              onClick={nextSlide}
              className="top-1/2 right-0 z-20 absolute bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full transition-colors -translate-y-1/2 translate-x-4"
              aria-label="Next feature"
            >
              <ChevronRight className="w-5 h-5 text-[#5A6D57]" />
            </button>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {features.map((feature) => (
                  <div key={feature.id} className="flex-shrink-0 w-full">
                    <div className="flex lg:flex-row flex-col items-center p-6 md:p-10">
                      <div className="flex-1 mb-8 lg:mb-0 lg:pr-8">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg`}
                        >
                          {feature.icon}
                        </div>

                        <h2 className="mb-4 font-bold text-[#2F3E2F] text-2xl md:text-3xl">
                          {feature.title}
                        </h2>
                        <p className="mb-6 text-gray-700 text-lg">
                          {feature.description}
                        </p>

                        <ul className="space-y-3 mb-8">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-start">
                              <div className="flex flex-shrink-0 justify-center items-center bg-[#A2AF9B]/20 mt-0.5 mr-3 rounded-full w-6 h-6">
                                <div className="bg-[#5A6D57] rounded-full w-2 h-2"></div>
                              </div>
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>

                        <button className="bg-gradient-to-r from-[#A2AF9B] hover:from-[#8D9C84] to-[#8D9C84] hover:to-[#7D8F69] shadow-md hover:shadow-lg px-6 py-3 rounded-lg font-medium text-white text-base transition-all">
                          Learn More
                        </button>
                      </div>

                      <div className="flex-1 w-full lg:w-auto">
                        <div className="relative">
                          <div className="absolute -inset-4 bg-gradient-to-br from-[#A2AF9B]/20 to-[#7D8F69]/20 rounded-2xl rotate-2 transform"></div>
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="z-10 relative shadow-lg mx-auto rounded-xl w-full max-w-md h-64 object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-3 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-[#5A6D57]" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex sm:flex-row flex-col justify-center gap-4 mt-16">
            <button className="bg-gradient-to-r from-[#5A6D57] to-[#7D8F69] shadow-md hover:shadow-lg px-8 py-4 rounded-lg font-medium text-white text-lg transition-all hover:-translate-y-0.5 transform">
              Get Started - It's Free
            </button>
            <button className="bg-white shadow-sm hover:shadow-md px-8 py-4 border border-[#A2AF9B] rounded-lg font-medium text-[#5A6D57] text-lg transition-all">
              View Demo
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">Trusted by students from</p>
            <div className="flex flex-wrap justify-center gap-6 opacity-70">
              <div className="bg-[#7D8F69] rounded-full w-8 h-8"></div>
              <div className="bg-[#A2AF9B] rounded-full w-8 h-8"></div>
              <div className="bg-[#5A6D57] rounded-full w-8 h-8"></div>
              <div className="bg-[#E8D7C3] rounded-full w-8 h-8"></div>
              <div className="bg-[#8D9C84] rounded-full w-8 h-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
