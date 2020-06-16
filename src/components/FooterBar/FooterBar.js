import React from 'react';
import czechFlag from '../../assets/czech.png'
import copyright from '../../assets/copyright.png'
import divider from '../../assets/verticalDivider.png'
import { disclaimerLinkMe, disclaimerMe, actualYear, APP_VERSION } from '../../constants';

function FooterBar() {
  return (
    <footer className="Footer">
        <img src={czechFlag} draggable="false" className="Footer-Flag" alt="czech" />
        <img src={divider} draggable="false" className="Footer-Divider" alt="divider" />
        <img src={copyright} draggable="false" className="Footer-Copyright" alt="copyright" />
        <span>{actualYear} <a draggable={false} className="Footer-Link" href={disclaimerLinkMe} target="_blank" rel="noopener noreferrer">{ disclaimerMe }</a></span>
        <img src={divider} draggable="false" className="Footer-Divider"  alt="divider" />
        <span className="Footer-Link" >Version: {APP_VERSION}</span>
    </footer>
  );
};

export default FooterBar;