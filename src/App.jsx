import React, { useState, useEffect } from "react";
import { IoPause } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import { GrPrevious, GrNext } from "react-icons/gr";
import { RxCross1 } from "react-icons/rx";
import "./App.css";
import { storiesData } from "./assets/story";

const App = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressWidths, setProgressWidths] = useState([]);

  const openStory = (story) => {
    setActiveStory(story);
    setCurrentSlide(0);
    setIsPaused(false);
    setProgressWidths(new Array(story.slides.length).fill(0));
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

  useEffect(() => {
    if (isModalOpen && !isPaused) {
      const timer = setTimeout(nextSlide, 5000); 
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isModalOpen, isPaused]);

  // Update progress bar for each slide based on the time interval
  useEffect(() => {
    if (!isPaused && activeStory) {
      const progressInterval = setInterval(() => {
        setProgressWidths((prevWidths) => {
          const newWidths = [...prevWidths];
          if (newWidths[currentSlide] < 100) {
            newWidths[currentSlide] += 100 / 50; 
          }
          return newWidths;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [currentSlide, isPaused, activeStory]);

  return (
    <div className="App">
      <div>
        <h1> Welcome to Story Teller</h1>
      </div>
      <div className="stories-container">
        {storiesData.map((story) => (
          <div className="story-container" key={story.id}>
            <div
              className="story"
              onClick={() => openStory(story)}
              style={{ border: `2px solid ${story.ringColor}` }}
            >
              <img src={story.thumbnail} alt="hello" />
            </div>
            <p style={{color:`${story.nameColor}`}}>{story.name}</p>
          </div>
        ))}
      </div>

      {isModalOpen && activeStory && (
        <div className="modal">
          <button className="close-btn" onClick={closeStory}>
            <RxCross1 />
          </button>
          <div className="progress-container">
            {activeStory.slides.map((_, index) => (
              <div
                key={index}
                className={`progress-bar ${
                  index < currentSlide
                    ? "completed"
                    : index === currentSlide
                    ? "active"
                    : ""
                }`}
              >
                {index === currentSlide && (
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progressWidths[index]}%` }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="slide-container">
            {/* Pause Button */}
            <button className="pause-btn" onClick={togglePause}>
              {isPaused ? <FaPlay /> : <IoPause />}
            </button>
            <img
              src={activeStory.slides[currentSlide].image}
              alt={`Slide ${currentSlide + 1}`}
            />
            <button onClick={prevSlide} disabled={currentSlide === 0} className="btn prev-btn">
              <GrPrevious />
            </button>
            <button onClick={nextSlide} className="btn next-btn">
              <GrNext />
            </button>
          </div>
          <div className="checkout-btn">
            <button><a href={`${activeStory.slides[currentSlide].link}`}>{activeStory.slides[currentSlide].button_text}</a></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
