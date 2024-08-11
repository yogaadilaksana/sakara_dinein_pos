export function loadSnap() {
    return new Promise((resolve, reject) => {
      if (typeof window.snap !== "undefined") {
        resolve(window.snap);
      } else {
        const script = document.createElement("script");
        const clientKey = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_PRODUCTION
          : process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX;
        script.src = process.env.NODE_ENV === 'production'
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", clientKey);
        script.onload = () => resolve(window.snap);
        script.onerror = reject;
        document.body.appendChild(script);
      }
    });
  }
  