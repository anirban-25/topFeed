'use client';
import { useEffect, useRef } from 'react';

const TelegramLoginButton = ({ onAuth }) => {
  const buttonRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.TelegramLoginWidget = {
        dataOnauth: (user) => onAuth(user)
      };

      const script = document.createElement('script');
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TEL_BOT_ID);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;

      buttonRef.current.appendChild(script);
      scriptRef.current = script;

      return () => {
        if (buttonRef.current && scriptRef.current) {
          buttonRef.current.removeChild(scriptRef.current);
        }
      };
    }
  }, [onAuth]);

  return <div ref={buttonRef}></div>;
};

export default TelegramLoginButton;
