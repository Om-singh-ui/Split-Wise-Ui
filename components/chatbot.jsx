'use client';

import { useEffect } from 'react';

export default function Chatbot() {
  useEffect(() => {
    // Initialize chatbase config
    window.chatbaseUserConfig = {
      user_id: "USER_ID", // Replace or make dynamic
      user_hash: "USER_HASH",
      user_metadata: {
        name: "Guest User",
        email: "",
        company: ""
      }
    };

    // Load chatbase script
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) window.chatbase.q = [];
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args) => target(prop, ...args);
        }
      });

      const loadScript = () => {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.id = 'eiY9ywEl0yjhDG6V50GI7';
        script.domain = 'www.chatbase.co';
        document.body.appendChild(script);
      };

      if (document.readyState === 'complete') {
        loadScript();
      } else {
        window.addEventListener('load', loadScript);
      }
    }
  }, []);

  return null;
}