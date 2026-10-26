import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component that resets the scroll position to the top of the page
 * whenever the current location change.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
