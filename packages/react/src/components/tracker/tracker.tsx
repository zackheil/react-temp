import { PropsWithChildren, useEffect, useRef } from 'react';
import { useAppEventStateReducer } from '../../hooks';
import { finder } from '@medv/finder';

type Props = {
  trackingIdentifier: string;
  className?: string;
  trackHover?: boolean;
  trackClick?: boolean;
  trackFocus?: boolean;
  trackIntersection?: boolean;
};
export const Tracker = ({
  children,
  className,
  trackingIdentifier,
  trackClick = true,
  trackFocus = false,
  trackHover = false,
  trackIntersection = false,
}: PropsWithChildren<Props>) => {
  const { addEvent } = useAppEventStateReducer();

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!trackIntersection) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('the following is now on screen: ' + trackingIdentifier);
          addEvent('intersecting ' + trackingIdentifier);
        }
      });
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [trackIntersection]);

  return (
    <div
      ref={containerRef}
      // Tells the global event tracker (get) to ignore this element
      data-get={'ignore'}
      className={className}
      onClick={(event) => {
        let clickedSelector = '';
        try {
          clickedSelector = finder(event.target as HTMLElement, {
            root: document.body,
            maxNumberOfTries: 0,
            threshold: 1,
            seedMinLength: 0,
            
          });
        } catch(e) { console.log('ug')}
        trackClick && console.log('click on ' + trackingIdentifier + ' ' + clickedSelector);
        trackClick && addEvent('click on ' + trackingIdentifier + ' ' + clickedSelector);
      }}
      onFocus={() => {
        trackFocus && addEvent('focus on ' + trackingIdentifier);
      }}
      onBlur={() => {
        trackFocus && addEvent('focus away ' + trackingIdentifier);
      }}
      onMouseOver={() => {
        trackHover && addEvent('mouseover ' + trackingIdentifier);
      }}
      onMouseLeave={() => {
        trackHover && addEvent('mouseleave ' + trackingIdentifier);
      }}
    >
      {children}
    </div>
  );
};
