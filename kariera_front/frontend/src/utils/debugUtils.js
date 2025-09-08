// Add to src/utils/debugUtils.js
import React from "react";
export const addGlobalObjectDetection = () => {
  // Override React.createElement to catch object rendering
  const originalCreateElement = React.createElement;
  React.createElement = function (type, props, ...children) {
    // Check all children for objects
    children.forEach((child, index) => {
      if (child && typeof child === "object" && !React.isValidElement(child)) {
        console.error(`🚨 FOUND OBJECT BEING RENDERED!`);
        console.error(`🚨 Component type: ${type}`);
        console.error(`🚨 Object at child index ${index}:`, child);
        console.error(`🚨 Object keys:`, Object.keys(child));
        console.trace(`🚨 Stack trace:`);

        // Force the object to become a string to prevent crash
        children[index] = JSON.stringify(child);
      }
    });

    return originalCreateElement.apply(this, [type, props, ...children]);
  };
};
