import {  useEffect } from 'react';

import { FooterProps } from './Footer.interface';
import styles from './Footer.module.scss';

const FOOTER_TOOL_SRC = 'https://footertool.pwc.nl/static/footer.js';
const FOOTER_LOCAL_SRC = '../../../public/footer.js';
const FOOTER_TOOL_DOMAIN = 'https://sustainabilitylegislationnavigator.pwc.com';


const Footer = ({ children, ...props }: FooterProps) => {
  useEffect(() => {
    const content = document.querySelector("main > footer") as HTMLElement
      || document.querySelector("footer") as HTMLElement;

    if (content && !content.querySelector('avg-pwc-wrapper')) {
      const script = document.createElement('script');
      script.src = FOOTER_TOOL_SRC;
      script.dataset.avgDomain = FOOTER_TOOL_DOMAIN;
      script.dataset.avgLang = "en";
      script.dataset.avgInvert = "0";
      script.dataset.avgScheme = "digital_rose";
      script.defer = true;

      // include now the content into the tool directly from here
      content.appendChild(script);
      return () => {
        content.removeChild(script); // Clean up the script when the component is unmounted
      };
    }
  }, []);

  return (
    <footer className={styles.root}></footer> // THis is nothing -- don't worry about it
  );
}

export default Footer;
