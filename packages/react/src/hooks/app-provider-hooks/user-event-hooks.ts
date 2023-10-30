// eslint-disable @typescript-eslint/no-empty-function

import { useInternalAppDispatch, useInternalAppSelector } from './internal';
import {
  UserEventsSliceState,
  addEvent as _addEvent,
  setPostEndpoint as _setPostEndpoint,
  setPublicKey as _setPublicKey,
  setLastPostRefresh as _setLastPostRefresh,
} from '../../components/app/redux-slices/user-event';
import { useEffect } from 'react';
import { sha256 } from '../../library';
import { useEffectOnce } from '../useEffectOnce';
import { finder } from '@medv/finder';

/**
 * A hook to get the current state of the `_user-events` slice from the `<App>` redux context.
 *
 * @returns The `_user-events` slice from the `<App>` redux context. Because this can be overridden
 * with custom App component providers and not redux-toolkit, it will return undefined if the context
 * isn't found instead of throwing an error.
 */
export const useGetAppEventsState = (): UserEventsSliceState | undefined => {
  try {
    return useInternalAppSelector((state) => state['_user-events']);
  } catch (e) {
    return undefined;
  }
};

type AppEventStateReducer = () => {
  /**
   * Adds an event to the internal user events state managed by the `<App>` component.
   */
  addEvent: (...params: Parameters<typeof _addEvent>) => void;
  /**
   * Sets the internal URL to post user events to.
   *
   * **_NOTE: should only be used internally if trying to create a custom event uploader._**
   */
  setPostEndpoint: (...params: Parameters<typeof _setPostEndpoint>) => void;
  /**
   * Sets the public key to use for encrypting user events.
   *
   * **_NOTE: should only be used internally if trying to create a custom event uploader._**
   */
  setPublicKey: (...params: Parameters<typeof _setPublicKey>) => void;
  /**
   * Sets the last post refresh info.
   *
   * **_NOTE: should only be used internally if trying to create a custom event uploader._**
   */
  setLastPostRefresh: (...params: Parameters<typeof _setLastPostRefresh>) => void;
};

const reducers = {
  addEvent: _addEvent,
  setPostEndpoint: _setPostEndpoint,
  setPublicKey: _setPublicKey,
  setLastPostRefresh: _setLastPostRefresh,
};

/**
 * A hook to set the current state of the `_user-events` slice from the `<App>` redux context.
 *
 * @returns A tuple of the dispatch function and the reducers exposed from user event state slice.
 */
export const useAppEventStateReducer: AppEventStateReducer = () => {
  try {
    const dispatch = useInternalAppDispatch();
    return {
      addEvent: (params) => dispatch(_addEvent(params)),
      setPostEndpoint: (params) => dispatch(_setPostEndpoint(params)),
      setPublicKey: (params) => dispatch(_setPublicKey(params)),
      setLastPostRefresh: (params) => dispatch(_setLastPostRefresh(params)),
    };
  } catch (e) {
    return reducers;
  }
};

// TODO: move?
const throttle = <F extends (...args: any[]) => void>(func: F, delay: number) => {
  let throttling = false;

  return (...args: any[]) => {
    if (!throttling) {
      func(...args);
      throttling = true;
      setTimeout(() => {
        throttling = false;
      }, delay);
    }
  };
};

const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
/**
 * A hook to collect passive events from a user's browser and record them in the App's user event
 * state. Events recorded include:
 * ```txt
 * - hasFocus
 * ```
 */
export const useCollectPassiveUserEvents = () => {
  const { addEvent } = useAppEventStateReducer();
  useEffect(() => {
    const onWindowFocus = () => addEvent('User has focused on the window');
    const onWindowBlur = () => addEvent('User has switched away from the window');
    const onPageLoad = () => addEvent('Page has finished loading');
    const onScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY;

      const scrollDepth = (currentScroll / (fullHeight - windowHeight)) * 100;

      addEvent(`User has scrolled to ${scrollDepth.toFixed(2)}%`);
    };
    const onResize = (entries: ResizeObserverEntry[]) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log(`User has resized to ${width}x${height}`);
    };

    const throttledOnScroll = throttle(onScroll, 200);
    const debouncedOnResize = debounce(onResize, 200);

    const onClick = (event: MouseEvent) => {
      // Logic to extract text content from the clicked element
      const clickedElement = event.target;
      let clickedElementText: string | null = null;
      const fin = finder(clickedElement as any, {
        root: document.body,
        optimizedMinLength: 0,
      });

      if (clickedElement instanceof HTMLAnchorElement) {
        console.log(fin)
        clickedElementText = clickedElement.innerText;
      } else if (clickedElement instanceof HTMLButtonElement) {
        console.log(fin)
        clickedElementText = clickedElement.textContent;
      }
      else {
        console.log(fin)
      }
      if (clickedElementText) {
        const fin = finder(clickedElement as any);
        console.log(fin)
        addEvent(`User clicked on: ${clickedElementText}, ${fin}`);
      }
    };

    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('load', onPageLoad);
    window.addEventListener('scroll', throttledOnScroll);
    document.addEventListener('click', onClick);
    // BAD
    // window.addEventListener('resize', throttledOnResize);
    // GOOD
    const resizeObserver = new window.ResizeObserver(debouncedOnResize);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('load', onPageLoad);
      window.removeEventListener('scroll', throttledOnScroll);
      document.removeEventListener('click', onClick);
      // window.removeEventListener('resize', throttledOnResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Only run this on page load
  useEffectOnce(() => {
    addEvent('Page has loaded ' + document.referrer);
  });
};

/**
 * A hook to upload events from the internal user events slice to the configured post endpoint.
 * It will ideally post when it has the number of events in the event threshold. This number
 * will be halved with each passing interval:
 *
 * ```txt
 * (n; interval = 10 seconds), (t; threshold = 10 events)
 * if 1 interval passes and there are 10 events, post
 * if 2 intervals pass and there are 5 events, post
 * if 3 intervals pass and there are 2 events, post
 * if n intervals pass and there are floor(t / count(n)) events, post.
 * ```
 *
 * **_NOTE: should only be used internally if trying to recreate a custom event uploader._**
 * @param eventThreshold The ideal number of events to batch send to the server to be parsed.
 * @param msInterval The number of milliseconds considered an interval.
 */
export const useEventSliceUploader = (postEndpoint?: string, eventThreshold = 10, msInterval = 10000) => {
  const eventSlice = useGetAppEventsState();
  const { setLastPostRefresh, setPostEndpoint } = useAppEventStateReducer();

  useEffect(() => {
    if (eventSlice?.postEndpoint === postEndpoint) return;
    setPostEndpoint(postEndpoint);
  }, [postEndpoint, eventSlice]);

  useEffect(() => {
    const { events, lastEventUnix, lastPostUnix, postEndpoint, lastPostSha, publicKey } = eventSlice || {};

    // We are not in the standard app redux context
    if (typeof events === 'undefined' || !Array.isArray(events) || !lastPostUnix) return;
    const uploader = async () => {
      if (!postEndpoint) return;
      if (!shouldPostEvents(lastPostUnix, events.length, eventThreshold, msInterval)) return;

      // Build the payload
      const body = JSON.stringify({
        events,
        lastPostSha,
      });
      const sha = await sha256(body);

      fetch(postEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
        .then(() => {
          setLastPostRefresh({ sha });
        })
        .catch();
    };

    // Set up a timer to post the events to the server every interval
    const timer = setInterval(uploader, msInterval);

    return () => {
      clearInterval(timer);
    };
  }, [eventSlice]);
};

/**
 *  A function to determine if the events should be posted to the server
 *  Follows this pattern: (n; interval = 10 seconds), (t; threshold = 10 events)
 *  if 1 interval passes and there are 10 events, post
 *  if 2 intervals pass and there are 5 events, post
 *  if 3 intervals pass and there are 2 events, post
 *  if n intervals pass and there are floor(t / count(n)) events, post.
 */
function shouldPostEvents(lastPostUnix: number, eventCount: number, eventThreshold: number, msInterval: number) {
  if (!eventCount) return false;

  const intervalCount = Math.floor((Date.now() - lastPostUnix) / msInterval);
  if (!intervalCount) return false;

  return eventCount >= Math.floor(eventThreshold / intervalCount);
}

export const useLogPageView = (trackingIdentifier: string) => {
  const { addEvent } = useAppEventStateReducer();
  useEffectOnce(() => {
    addEvent(`${trackingIdentifier} page loaded`);
  });
};
