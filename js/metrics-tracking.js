(function() {
    // Generate a session ID
    let sessionId = localStorage.getItem('metrics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('metrics_session_id', sessionId);
    }
    
    // Better device detection
    function getDeviceType() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      }
      if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|webOS/i.test(ua)) {
        return 'mobile';
      }
      return 'desktop';
    }
    
    // Get country information
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        // Send pageview data with location info
        fetch('https://metrics-hub.netlify.app/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectApiKey: '840e20e724e48ac965dfb9eb17505853',
            page: window.location.pathname,
            referrer: document.referrer,
            sessionId: sessionId,
            userAgent: navigator.userAgent,
            deviceType: getDeviceType(),
            country: data.country_name,
            region: data.region,
            city: data.city
          }),
          keepalive: true
        }).catch(err => console.error('Analytics error:', err));
      })
      .catch(err => {
        // Fall back to sending data without location info
        console.error('Country detection error:', err);
        fetch('https://metrics-hub.netlify.app/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectApiKey: '840e20e724e48ac965dfb9eb17505853',
            page: window.location.pathname,
            referrer: document.referrer,
            sessionId: sessionId,
            userAgent: navigator.userAgent,
            deviceType: getDeviceType()
          }),
          keepalive: true
        }).catch(err => console.error('Analytics error:', err));
      });
  })();