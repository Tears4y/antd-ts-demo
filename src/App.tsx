import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react';
import CompTest from './components/CompTest';
import ProductTypeDisplay from './components/ProductTypeDisplay';
import Login from './components/Login';



function App() {

  const auth = localStorage.getItem('react-demo-token')

  return (
    <>
      <Router>
        <Routes>
          {
            auth ? (
              <Route path="/" element={<ProductTypeDisplay />} />
            ) : (
              <Route path="/login" element={<Login />} />
            )
          }
          {!auth && <Route path='/' element={<Navigate to='/login' />} />}
          <Route path='*' element={<Navigate to='/' />} />
          <Route path='/login' element={auth ? <Navigate to='/' /> : <Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
