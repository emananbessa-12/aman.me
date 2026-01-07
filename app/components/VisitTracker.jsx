"use client";
import { useEffect, useRef } from 'react';

export default function VisitTracker() {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);

  // Track initial visit - use sessionStorage to persist across Fast Refresh
  useEffect(() => {
    const hasVisitTracked = sessionStorage.getItem('visit_tracked');
    
    if (!hasVisitTracked) {
      sessionStorage.setItem('visit_tracked', 'true');
      sessionStorage.setItem('visit_start_time', startTime.current.toString());
      
      console.log('🟢 SENDING VISIT NOTIFICATION');
      
      fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'New Visitor',
          userAgent: 'Clean visit tracking',
          referrer: document.referrer || 'Direct visit'
        })
      }).catch(console.error);
    } else {
      // Restore start time from session storage
      const savedStartTime = sessionStorage.getItem('visit_start_time');
      if (savedStartTime) {
        startTime.current = parseInt(savedStartTime);
      }
      console.log('🔴 VISIT ALREADY TRACKED (from sessionStorage)');
    }
  }, []);

  // Track scroll and exit - use sessionStorage to prevent duplicates
  useEffect(() => {
    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      
      if (scrollPercent > maxScroll.current) {
        maxScroll.current = scrollPercent;
      }
    };

    const trackExit = () => {
      const hasExitTracked = sessionStorage.getItem('exit_tracked');
      
      if (!hasExitTracked) {
        sessionStorage.setItem('exit_tracked', 'true');
        
        console.log('🟡 SENDING EXIT NOTIFICATION');
        
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        const scrollDepth = maxScroll.current;
        
        if (timeSpent > 5 || scrollDepth > 10) {
          const data = JSON.stringify({
            page: 'User Left Site',
            userAgent: `${timeSpent}s spent • ${scrollDepth}% scrolled`,
            referrer: 'Exit tracking'
          });
          
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/track-visit', data);
          } else {
            fetch('/api/track-visit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: data,
              keepalive: true
            }).catch(console.error);
          }
        }
      } else {
        console.log('🔴 EXIT ALREADY TRACKED (from sessionStorage)');
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('beforeunload', trackExit);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) trackExit();
    });

    return () => {
      window.removeEventListener('scroll', trackScroll);
      window.removeEventListener('beforeunload', trackExit);
      document.removeEventListener('visibilitychange', trackExit);
    };
  }, []);

  return null;
}