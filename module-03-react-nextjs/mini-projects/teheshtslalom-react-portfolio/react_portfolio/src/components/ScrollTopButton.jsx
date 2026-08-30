import React from 'react';

export default function ScrollTopButton({ show, onClick }) {
  return (
    <button className={`scroll-top-btn ${show ? "show" : ""}`} onClick={onClick} aria-label="Scroll to top">
<i className="fa-solid fa-arrow-up"></i>
</button>
  );
}
