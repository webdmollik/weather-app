import "../styles/main.scss";
import Script from "next/script"
import React from "react";

function MyApp({ Component, pageProps }) {
  return(
    <>
    <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-2WZ4Q3ST0Q`}
      />

      <Script strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2WZ4Q3ST0Q');
                `}
      </Script> 
  
  <Component {...pageProps} />;
  </>
  );
}

export default MyApp;
