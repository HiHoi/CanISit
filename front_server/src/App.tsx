import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Layout from "./pages/Layout";
import "./styles/layout.css"

function App() {
  return (
    <div className='background'>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App;
