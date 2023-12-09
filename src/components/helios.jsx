import React, { useState, useEffect, useRef } from 'react';
import HeliosLeft from "@/src/icon/HeliosLeft"
import HeliosRight from "@/src/icon/HeliosRight"
import useQuery from "@/src/hooks/useQuery"
import styled from '@emotion/styled';

const HeliosStyle = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 75vh;

  @media screen and (max-width: 550px) {
    height: 100vw;
  }

  @media screen and (max-width: 485px) {
    height: 170vw;
  }
`;

const HeliosIndicator = styled.section`
  position: absolute;
  bottom: 20px;
  left: 155px;
  transform: translateX(-50%);
  display: flex;

  @media screen and (max-width: 680px) {
    left: 50%;
    bottom: 10px;
  }
`;

const HeliosPage = styled.span`
  width: 25px;
  height: 7px;
  border-radius: 8px;
  background-color: var(--color);
  opacity: 0.5;
  margin: 0 5px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease-out;
  position: relative; // add this

  &:hover {
    opacity: 1;
    background-color: #ff3f3f;
  }

  @media screen and (max-width: 680px) {
    width: 30px;
    height: 8px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 8px;
    background-color: #ff3f3f;
    transition: width 0.3s ease-out;
  }

  &.active {
    transition: all 0.3s ease-out;
    width: 45px;
    background-color:var(--helios-indicator-active); 
    opacity: 1;
    overflow:hidden;

    &::before { 
      width: ${props => props.loaderPagee};
    }

    &:hover {
      background-color: #ff3f3f7f;
    }
  }
`

const Prev = styled.button`
  position: absolute;
  border:none;
  background:none;
  top: 50%;
  color:var(--color);
  border: none;
  cursor: pointer;
  left:20px;
  z-index: 1;
  opacity:0.5;
  transition: all .3s ease-out;

  &:hover {
    opacity:1;
    color:#ff3f3f;
  }
`

const Next = styled.button`
  position: absolute;
  top: 50%;
  color:var(--color);
  border:none;
  background:none;
  border: none;
  cursor: pointer;
  right:20px;
  z-index: 1;
  opacity:0.5;
  transition: all .3s ease-out;

  &:hover {
    opacity:1;
    color:#ff3f3f;
  }
`

const HeliosInner = styled.main`
  display: flex;
  transition: transform 0.4s ease-in-out;
`

const HeliosItem =  styled.article`
  min-width: 100%;
  box-sizing: border-box;
  opacity: ${props => props.opacityProps};
  transform: ${props => props.transformProps};
  transition: opacity .5s ease-in-out;
`

const Helios = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const heliosRef = useRef(null);
  const isMobile = useQuery('(min-width: 680px)');
  const timerRef = useRef(null);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          resetTimer();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });

    observer.observe(heliosRef.current);

    startTimer();

    return () => {
      clearInterval(timerRef.current);
      observer.disconnect();
    };
  }, []);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setProgress(0);
    startTimer();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          nextSlide();
          return 0;
        } else {
          return prevProgress + 1; 
        }
      });
    }, 100);
  };


  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
    resetTimer();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetTimer();
  };


  return (
    <HeliosStyle ref={heliosRef}>
      <HeliosInner>
        {React.Children.map(children, (child, index) => (
          <HeliosItem 
            opacityProps={index === currentIndex ? '1' : '0.4'}
            transformProps={`translateX(-${currentIndex * 100}%)`}
            key={index}
          >
            {child}
          </HeliosItem>
        ))}
      </HeliosInner>
      {isMobile && (
        <>
          <Prev type="button" aria-label="Anterior Articulo" onClick={() => prevSlide()}>
            <HeliosLeft />
          </Prev>
          <Next type="button" aria-label="Siguiente Articulo" onClick={() => nextSlide()}>
            <HeliosRight />
          </Next>
        </>
      )}
      <HeliosIndicator>
        {React.Children.map(children, (_, index) => (
          <HeliosPage loaderPagee={`${index === currentIndex ? `${progress}%` : '0%'}`}
            key={index}
            className={`${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </HeliosIndicator>
    </HeliosStyle>
  );
};

export default Helios;