import React, { useState, useEffect } from "react";
import { IoPause } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import { GrPrevious, GrNext } from "react-icons/gr";
import { RxCross1 } from "react-icons/rx";
import "./App.css";
import {storiesData} from "./assets/storydata"

const App = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressWidths, setProgressWidths] = useState([]); // Array to track progress for each slide

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

  // Auto-slide timer
  useEffect(() => {
    if (isModalOpen && !isPaused) {
      const timer = setTimeout(nextSlide, 5000); // 5 seconds per slide
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
            newWidths[currentSlide] += 100 / 50; // Increment by a percentage of total (5 seconds)
          }
          return newWidths;
        });
      }, 50); // Update progress every 50ms

      return () => clearInterval(progressInterval);
    }
  }, [currentSlide, isPaused, activeStory]);

  return (
    <div className="App">
      <div className="stories-container">
        {storiesData.map((story) => (
          <div
            key={story.id}
            className="story"
            onClick={() => openStory(story)}
            style={{ border: `2px solid ${story.ringColor}` }}
          >
            <img src={story.thumbnail} alt="hello" />
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
              src={activeStory.slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
            />
            <button onClick={prevSlide} disabled={currentSlide === 0} className="btn prev-btn">
              <GrPrevious />
            </button>
            <button onClick={nextSlide} className="btn next-btn">
              <GrNext />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
