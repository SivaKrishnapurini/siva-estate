import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Edit from './pages/Edit'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import ProtectedRoute from './protectedRoute/ProtectedRoute'
import CreatingList from './pages/CreatingList'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import ListData from './pages/ListData'

const App = ()=>{
  return(
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/list-data/:id" element={<ListData />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/CreatingList" element={<CreatingList />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Route>
        <Route path='/Search' element={<Search />} />
        <Route path="/not-found" element={<NotFound/>} />
        <Route path="/*" element={<Navigate to={"/not-found"} />} replace />
      </Routes>
    </BrowserRouter>
  )
}

export default App