const smoothScrollToBottom = (containerRef, duration = 500) => {
    const start = containerRef.scrollTop;
    const end = containerRef.scrollHeight - containerRef.clientHeight;
    const distance = end - start;
    let startTime = null;
  
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  
    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      containerRef.scrollTop = start + distance * ease;
  
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
  
    requestAnimationFrame(animation);
  };
  