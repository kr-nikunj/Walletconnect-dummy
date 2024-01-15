// SvgMotion.js
import Image from 'next/image';
import React from 'react';
import HomepageImg from './img/Register_anytime_img.svg';

const SvgMotion = () => {
    console.log("SVGmotion");
    return (
        <div>
            <div>SVG Motion</div>
            <Image src={HomepageImg} alt="Register Anytime" />
        </div>
    );
};

export default SvgMotion;
