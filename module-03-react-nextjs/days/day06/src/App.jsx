import { Routes, Route } from 'react-router-dom'

import Layout from './components/LayOut'
import RequireAuth from './components/RequireAuth'

import Menu from './pages/Menu'
import Dish from './pages/Dish'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

function Home() {
  return <h1>Home Page</h1>
}

function About() {
  return <h1>About Page</h1>
}

function Contact() {
  return <h1>Contact Page</h1>
}

function Checkout() {
  return <h1>Checkout Page</h1>
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="about" element={<About />} />

        <Route path="contact" element={<Contact />} />

        <Route path="menu" element={<Menu />} />

        <Route path="menu/:id" element={<Dish />} />

        <Route path="login" element={<Login />} />

        <Route
          path="checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App