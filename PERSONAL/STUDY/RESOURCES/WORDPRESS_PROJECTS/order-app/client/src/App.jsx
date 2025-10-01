import React, { useState, memo } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/Header/header.component'
import Footer from './components/Footer/footer.component'
import Search from './components/Search/search.component'
import Details from './components/Details/details.component'
import Main from './components/Common/main'
import Notifications from './components/Notifications/notifications'

import { AppStateContextProvider } from './context/AppStateContext'
import { useAuthentication } from "./hooks"
import { useProductsApi, useCustomersApi } from './api'


function App() {
  useAuthentication();

  const [customers, setCustomers] = useState([])
    const { data: _allProducts, status, error, isFetching } = useProductsApi()
    const { data: _allCustomers, status: _status, error: _error, isFetching: _isFetching } = useCustomersApi()


// console.log({ _allProducts });

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
          <Notifications />
      </AppStateContextProvider>
  )
}

export default memo(App);
