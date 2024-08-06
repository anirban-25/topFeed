// components/SafeHtmlRender.js

import React, { useEffect } from "react";
import DOMPurify from "dompurify";

const SafeHtmlRender = ({ htmlContent }) => {
  useEffect(() => {
    // Load Twitter script if not already present
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Reload tweet if script is already present
      window.twttr.widgets.load();
    }
  }, [htmlContent]);

  // Sanitize the HTML content
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);

  return (
    <div
      className="tweet-container"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtmlRender;
