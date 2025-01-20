import React, { useState, useEffect, useRef } from "react";
import { IoPause } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import { GrPrevious,GrNext } from "react-icons/gr";
import "./App.css";

const storiesData = [
  {
    id: 1,
    title: "Story 1",
    thumbnail:"https://res.cloudinary.com/dirhwaotp/image/upload/v1698325284/samples/man-portrait.jpg",
    ringColor:"#d7b404",
    slides: [
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857118/i58ckdzwlyvofneizujv.jpg",
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857117/dx4cqlgwmy3nqc9jiruv.jpg",
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857071/rkpxyqbuwc2uhsbha02e.jpg",
    ],
  },
  {
    id: 2,
    title: "Story 2",
    thumbnail:"https://res.cloudinary.com/dirhwaotp/image/upload/v1698325284/samples/man-portrait.jpg",
    ringColor:"#ffea00",
    slides: [
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857019/jgoupzt8drb7lec2bnyc.jpg",
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857017/gngzplrkppeyjk7uqexq.jpg",
    ],
  },
  {
    id: 3,
    title: "Story 3",
    thumbnail:"https://res.cloudinary.com/dirhwaotp/image/upload/v1698325284/samples/man-portrait.jpg",
    ringColor:"red",
    slides: [
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857019/jgoupzt8drb7lec2bnyc.jpg",
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857017/gngzplrkppeyjk7uqexq.jpg",
    ],
  },
  {
    id: 4,
    title: "Story 4",
    thumbnail:"https://res.cloudinary.com/dirhwaotp/image/upload/v1698325284/samples/man-portrait.jpg",
    ringColor:"red",
    slides: [
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857019/jgoupzt8drb7lec2bnyc.jpg",
      "https://res.cloudinary.com/dirhwaotp/image/upload/v1698857017/gngzplrkppeyjk7uqexq.jpg",
    ],
  },
];

const App = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressBarRef = useRef(null); // Ref for the progress bar element
  const [progressWidth, setProgressWidth] = useState(0); // Progress width for smooth animation

  const openStory = (story) => {
    setActiveStory(story);
    setCurrentSlide(0);
    setIsPaused(false);
    setProgressWidth(0); // Reset progress when opening a new story
    setIsModalOpen(true);
  };

  const closeStory = () => {
    setActiveStory(null);
    setCurrentSlide(0);
    setIsModalOpen(false);
  };

  const nextSlide = () => {
    if (activeStory && currentSlide < activeStory.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Auto-slide timer
  useEffect(() => {
    if (isModalOpen && !isPaused) {
      const timer = setTimeout(nextSlide, 5000); // 5 seconds per slide
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isModalOpen, isPaused]);

  // Progress bar animation logic
  useEffect(() => {
    if (!isPaused && progressBarRef.current) {
      const interval = setInterval(() => {
        setProgressWidth((prev) => {
          if (prev < 100) {
            return prev + (100 / 5000) * 100; // 100% over 5 seconds
          } else {
            clearInterval(interval);
            return 100;
          }
        });
      }, 50); // Update every 50ms

      return () => clearInterval(interval);
    }
  }, [currentSlide, isPaused]);

  return (
    <div className="App">
      <div className="stories-container">
        {storiesData.map((story) => (
          <div
            key={story.id}
            className="story"
            onClick={() => openStory(story)}
            style={{border: `3px solid ${story.ringColor}`}}
          >
            <img src={story.thumbnail} alt="hello" />
          </div>
        ))}
      </div>

      {isModalOpen && activeStory && (
        <div className="modal">
          <button className="close-btn" onClick={closeStory}>
            &times;
          </button>
          <div className="progress-container">
            {
              activeStory.slides.map((slide,ind) =>{
                return(
                  <div className="progress-bar"></div>
                )
              })
            }
            
          </div>
          <div className="slide-container">
            {/* Pause Button */}
            <button className="pause-btn" onClick={togglePause}>
              {isPaused ? <FaPlay /> : <IoPause />}
            </button>
            <img
              src={activeStory.slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
            />
            <button onClick={prevSlide} disabled={currentSlide === 0} className="btn prev-btn">
              <GrPrevious />
            </button>
            <button onClick={nextSlide} className="btn next-btn">
              {currentSlide < activeStory.slides.length - 1 ? <GrNext /> : <GrNext />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
