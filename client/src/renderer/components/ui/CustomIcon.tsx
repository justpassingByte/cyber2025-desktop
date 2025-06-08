import React from 'react';

interface CustomIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: 'UtensilsCrossed' | 'Plus' | 'Search' | 'Loader2' | 'ShoppingCart' | 'Coffee' | 'Popcorn' | 'Burger' | 'IceCream' | 'Star' | 'Clock' | 'Minus' | 'X';
}

const iconSvgs: Record<CustomIconProps['name'], string> = {
  UtensilsCrossed: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="m2 16 2.3-2.3a3 3 0 0 1 4.2 0l1.8 1.8a3 3 0 0 0 0 4.2L8 22"/><path d="M7 11l4 4"/><path d="m14 7 3 3"/></svg>',
  Plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M12 5V19"/><path d="M5 12H19"/></svg>',
  Search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  Loader2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  ShoppingCart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  Coffee: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coffee"><path d="M10 2c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1V3c0-.5-.5-1-1-1h-4Z"/><path d="M2 21v-3c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v3c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1Z"/><path d="M8 14v-2h6v2"/><path d="M15 6v2"/></svg>',
  Popcorn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-popcorn"><path d="M18 8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2Z"/><path d="M12 2v4"/><path d="M17 12c-2.3-1.3-4.5-2.5-7-2.5S5.3 10.7 3 12c.7 2.2 2.3 4.8 5 6.5s6.1 2.3 9 0c2.7-1.7 4.3-4.3 5-6.5Z"/><path d="M15 20c-1.8-.7-3.6-1.5-5.5-1.5S7.3 19.3 6 20"/></svg>',
  Burger: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-burger"><path d="M11 17H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"/><path d="M12 7H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"/><path d="M13 22h6a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2Z"/></svg>',
  IceCream: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ice-cream"><path d="M12 22a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v12a4 4 0 0 0 4 4Z"/><path d="M8 12h8"/><path d="M12 2a4 4 0 0 0 4 4"/><path d="M12 2a4 4 0 0 1-4 4"/></svg>',
  Star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  Clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  Minus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>',
  X: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
};

const CustomIcon: React.FC<CustomIconProps> = ({ name, className, style, ...restProps }) => {
  const svgString = iconSvgs[name];

  if (!svgString) {
    console.warn(`Icon ${name} not found or not supported.`);
    return <span className={className} style={style} {...restProps} />; // Fallback for unknown icons
  }

  return (
    <span
      dangerouslySetInnerHTML={{ __html: svgString }}
      className={className}
      style={style}
      {...restProps} // Pass any other valid HTML attributes
    />
  );
};

export default CustomIcon; 