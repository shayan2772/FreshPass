import React from "react";
import { s } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color1?: string; // For first path color (orange-brown)
  color2?: string; // For second and third path colors (dark green)
}



// SVG XML string for Leaf Logo
const leafLogoSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1087_504)">
<g clip-path="url(#clip1_1087_504)">
<path d="M36.8217 0C34.4852 4.57661 26.2141 7.24194 19.2085 10.2918C12.2028 13.3416 8.40653 16.4885 8.89441 19.3479C8.89441 19.3479 11.7378 16.9887 20.4472 13.9389C29.4006 10.9861 37.5535 7.05156 36.8217 0Z" fill="{{COLOR1}}"/>
<path d="M44.1971 2.74335C43.9989 3.86324 43.8579 4.57996 43.5072 6.11048C43.5072 6.12168 43.5034 6.13287 43.4996 6.14407C42.5086 10.4183 39.7948 14.1513 35.9985 16.4732C32.0573 18.8847 27.453 20.124 24.5714 20.8967C15.6333 23.2896 9.81309 26.9703 7.1793 31.8754C6.63806 32.7302 6.45511 33.2603 6.45511 33.2603C4.21772 22.7744 16.6701 18.1007 24.7811 15.2152C33.54 12.1019 41.8111 8.36145 44.1933 2.74708L44.1971 2.74335Z" fill="{{COLOR2}}"/>
<path d="M44.832 10.0453C43.3417 15.1445 36.4618 20.1653 25.3054 23.4056C20.3084 24.7382 8.85091 28.2995 8.24106 37.7028C7.60454 47.5765 13.238 52 13.238 52C10.7071 41.3872 14.8617 34.9068 21.2842 31.4128C27.7067 27.9187 36.8544 26.9668 41.7865 20.9269C46.7187 14.8869 44.8358 10.0453 44.8358 10.0453H44.832Z" fill="{{COLOR2}}"/>
</g>
</g>
<defs>
<clipPath id="clip0_1087_504">
<rect width="52" height="52" fill="white"/>
</clipPath>
<clipPath id="clip1_1087_504">
<rect width="52" height="52" fill="white"/>
</clipPath>
</defs>
</svg>
`;

export const LeafLogo: React.FC<IconProps> = ({
  width = 52,
  height = 52,
  color1 = "#DDA15E",
  color2 = "#606C38",
}) => {
  // Replace placeholders with actual values
  const svgXml = leafLogoSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString())
    .replace(/{{COLOR1}}/g, color1)
    .replace(/{{COLOR2}}/g, color2);

  return <SvgXml xml={svgXml} />;
};

// Simple icon props for social icons
interface SocialIconProps {
  width?: number;
  height?: number;
}

// Google Icon SVG
const googleIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="16" fill="white"/>
<path d="M30.3821 13.1272H29.2007V13.0663H16.0007V18.933H24.2895C23.0803 22.3481 19.8309 24.7997 16.0007 24.7997C11.1409 24.7997 7.20065 20.8595 7.20065 15.9997C7.20065 11.1399 11.1409 7.19967 16.0007 7.19967C18.2439 7.19967 20.2848 8.04594 21.8387 9.42827L25.9872 5.27981C23.3677 2.83854 19.8639 1.33301 16.0007 1.33301C7.90098 1.33301 1.33398 7.90001 1.33398 15.9997C1.33398 24.0993 7.90098 30.6663 16.0007 30.6663C24.1003 30.6663 30.6673 24.0993 30.6673 15.9997C30.6673 15.0163 30.5661 14.0563 30.3821 13.1272Z" fill="#FFC107"/>
<path d="M3.02539 9.17307L7.84412 12.707C9.14799 9.47888 12.3057 7.19967 16.001 7.19967C18.2443 7.19967 20.2851 8.04594 21.8391 9.42827L25.9875 5.27981C23.3681 2.83854 19.8642 1.33301 16.001 1.33301C10.3675 1.33301 5.48206 4.51347 3.02539 9.17307Z" fill="#FF3D00"/>
<path d="M16.0004 30.6664C19.7888 30.6664 23.231 29.2166 25.8336 26.8589L21.2943 23.0177C19.7725 24.1757 17.9126 24.8018 16.0004 24.7997C12.1856 24.7997 8.94643 22.3673 7.72616 18.9727L2.94336 22.6577C5.37069 27.4075 10.3002 30.6664 16.0004 30.6664Z" fill="#4CAF50"/>
<path d="M30.3814 13.1273H29.2V13.0664H16V18.9331H24.2889C23.7104 20.5584 22.6685 21.9787 21.2917 23.0185L21.2939 23.017L25.8333 26.8582C25.5121 27.1501 30.6667 23.3331 30.6667 15.9997C30.6667 15.0163 30.5655 14.0564 30.3814 13.1273Z" fill="#1976D2"/>
</svg>
`;

export const GoogleIcon: React.FC<SocialIconProps> = ({
  width = 32,
  height = 32,
}) => {
  const svgXml = googleIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString());

  return <SvgXml xml={svgXml} />;
};

// Apple Icon SVG
const appleIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.7342 27.04C21.4275 28.3067 20.0009 28.1067 18.6275 27.5067C17.1742 26.8933 15.8409 26.8667 14.3075 27.5067C12.3875 28.3333 11.3742 28.0933 10.2275 27.04C3.72087 20.3333 4.68087 10.12 12.0675 9.74667C13.8675 9.84 15.1209 10.7333 16.1742 10.8133C17.7475 10.4933 19.2542 9.57333 20.9342 9.69333C22.9475 9.85333 24.4675 10.6533 25.4675 12.0933C21.3075 14.5867 22.2942 20.0667 26.1075 21.6C25.3475 23.6 24.3609 25.5867 22.7209 27.0533L22.7342 27.04ZM16.0409 9.66667C15.8409 6.69333 18.2542 4.24 21.0275 4C21.4142 7.44 17.9075 10 16.0409 9.66667Z" fill="#283618"/>
</svg>
`;

export const AppleIcon: React.FC<SocialIconProps> = ({
  width = 32,
  height = 32,
}) => {
  const svgXml = appleIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString());

  return <SvgXml xml={svgXml} />;
};

// Facebook Icon SVG
const facebookIconSvg = `
<svg width="{{WIDTH}}" height="{{HEIGHT}}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1467_1539)">
<path d="M28 16C28 9.37263 22.6274 4 16 4C9.37262 4 4 9.37263 4 16C4 21.9895 8.38825 26.954 14.125 27.8542V19.4688H11.0781V16H14.125V13.3563C14.125 10.3488 15.9166 8.6875 18.6576 8.6875C19.9705 8.6875 21.3438 8.92188 21.3438 8.92188V11.875H19.8306C18.3399 11.875 17.875 12.8 17.875 13.7491V16H21.2031L20.6711 19.4688H17.875V27.8542C23.6117 26.954 28 21.9896 28 16Z" fill="#1877F2"/>
<path d="M20.6711 19.4688L21.2031 16H17.875V13.7491C17.875 12.7999 18.3399 11.875 19.8306 11.875H21.3438V8.92188C21.3438 8.92188 19.9705 8.6875 18.6575 8.6875C15.9166 8.6875 14.125 10.3488 14.125 13.3563V16H11.0781V19.4688H14.125V27.8542C14.7453 27.9514 15.3722 28.0001 16 28C16.6278 28.0001 17.2547 27.9514 17.875 27.8542V19.4688H20.6711Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_1467_1539">
<rect width="24" height="24" fill="white" transform="translate(4 4)"/>
</clipPath>
</defs>
</svg>
`;

export const FacebookIcon: React.FC<SocialIconProps> = ({
  width = 32,
  height = 32,
}) => {
  const svgXml = facebookIconSvg
    .replace(/{{WIDTH}}/g, width.toString())
    .replace(/{{HEIGHT}}/g, height.toString());

  return <SvgXml xml={svgXml} />;
};

 

export default {
  LeafLogo,
  GoogleIcon,
  AppleIcon,
  FacebookIcon,
};
