import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header/header.component'
import Footer from './components/Footer/footer.component'
import Search from './components/Search/search.component'
import Details from './components/Details/details.component'
import Main from './components/Common/main'

import { AppStateContextProvider } from './context/AppStateContext'

import { useAuthentication, useLocalStorage } from "./hooks"
import { useProductsApi } from "./api"

function App() {
  const [ token, setToken ] = useLocalStorage('accessCode');
  const { login, revoke } = useAuthentication();

  const [customers, setCustomers] = useState([])
  // const { data: _allProducts } = useProductsApi();

  return (
      <AppStateContextProvider>
          <Header />
          <Main>
            <Routes>
              <Route
                  path="/"
                  element={<Search setCustomers={setCustomers}/>}
              />
              <Route path="/details/:customerName" element={<Details />} />
            </Routes>
          </Main>
          <Footer />
      </AppStateContextProvider>
  )
}

export default App
