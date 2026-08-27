# Module 03 - Day 1: Introduction to React & Components

A beginner React application built with Vite demonstrating the fundamentals of React component architecture, JSX syntax, and dynamic list rendering.



##  Overview

This project marks the start of Module 3 (React & Next.js). It introduces key React concepts by creating a modular restaurant menu display featuring traditional Ethiopian dishes.


## Features

- Component-Based Architecture**: Reusable and modular component design.
  - `Header`: Displays the main section heading (`Our Dishes`).
  - `Card`: Dynamically renders menu item cards.
  - `App`: Main layout combining all components.
- **Dynamic List Rendering**: Uses JavaScript's `.map()` to iterate over dish items (`dorowot`, `shiro`, `kitfo`, `tibs`) and display their names and prices.
- **Fast Development**: Powered by **Vite** with Hot Module Replacement (HMR).

---

## Technologies Used

- React 19
- Vite
- JavaScript (ES6+ / JSX)
- CSS3
- Oxlint


##  Project Structure


day1/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Card.jsx       # Component for rendering dish cards from menu data
│   │   └── Header.jsx     # Header component displaying title
│   ├── App.css
│   ├── App.jsx            # Root component composing Header and Card
│   ├── index.css
│   └── main.jsx           # React DOM entry point
├── index.html
├── package.json
└── vite.config.js

