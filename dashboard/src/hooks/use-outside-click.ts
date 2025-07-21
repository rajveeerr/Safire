import React, { useEffect } from "react";

export const useOutsideClick = (
    ref: React.RefObject<HTMLDivElement>,
    callback: (event: MouseEvent | TouchEvent) => void
  ) => {
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Need to type guard since event.target could be null
        const target = event.target as Node;
        
        if (!ref.current || ref.current.contains(target)) {
          return;
        }
        callback(event);
      };
  
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
  
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, callback]);
  };
