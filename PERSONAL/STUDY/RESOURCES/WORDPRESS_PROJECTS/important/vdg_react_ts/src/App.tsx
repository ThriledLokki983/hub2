import './App.css';
import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import useGetCustomerByName from './customHooks/useGetCustomerByName';

// COMPONENTS
import Header from './components/Header/header.component';
import Footer from './components/Footer/footer.component';
import Main from './components/Common/main';
import Search from './components/Search/search.component';
import NewCustomer from './components/Details/newCustomer.component';
import Customer from './components/Customer/customer';
import Order from './components/Order/Order';
import Overview from './components/Overview/Overview';

function App() {
	const [showModal, setShowModal] = useState(false);
	const [progressValue, setProgressValue] = useState(0);
	const [searchedCustomer, setSearchedCustomer] = useState('');
	const { customerData } = useGetCustomerByName(searchedCustomer);

	// console.log(customerData);

	const handleModalToggle = useCallback(() => {
		setShowModal((prevState) => !prevState);
	}, []);

	return (
		<>
			<Header progressValue={progressValue} />
			<Main>
				<Routes>
					<Route
						path='/'
						element={
							<Search
								onSetSearchedCustomer={setSearchedCustomer}
								handleNextPage={setProgressValue}
								setModalValue={setShowModal}
								toggleModal={handleModalToggle}
								showModal={showModal}
							/>
						}
					/>
					<Route
						path='/customer-details/:customerID'
						element={
							<Customer
								handleNextPage={setProgressValue}
								handlePreviousPage={setProgressValue}
								setModalValue={setShowModal}
							/>
						}
					/>
					<Route
						path='/details/new-customer'
						element={
							<NewCustomer
								handleNextPage={setProgressValue}
								handlePreviousPage={setProgressValue}
							/>
						}
					/>
					<Route
						path='/order'
						element={
							<Order
								handleNextPage={setProgressValue}
								handlePreviousPage={setProgressValue}
							/>
						}
					/>
					<Route
						path='/overview'
						element={
							<Overview
								handleNextPage={setProgressValue}
								handlePreviousPage={setProgressValue}
							/>
						}
					/>
				</Routes>
			</Main>
			<Footer />
		</>
	);
}

export default App;
