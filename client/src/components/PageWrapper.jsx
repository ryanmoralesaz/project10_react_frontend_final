import React from "react";

export default function PageWrapper({ className, title, children }) {
  return (
    <div className={className}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
