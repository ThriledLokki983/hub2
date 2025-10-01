import React, { StrictMode, Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import pizzaData from './data';
import './index.css';

function App() {
    return (
        <div className='container'>
            <Header />
            <Menu />
            <Footer />
        </div>
    );
}

const Header = () => {
    return (
        <header className='header'>
            <h1>Fast React Pizza Co.</h1>
        </header>
    );
};

const Menu = () => {
    const pizzas = pizzaData;
    const isPizzas = pizzas && pizzas.length > 0;
    
    return (
        <main className='menu'>
            <h2>Our Menu</h2>
            { isPizzas ? (
                <Fragment>
                    <p>Authentic Italian cuisine. 6 creative dishes to choose from. All from stone oven, all organic, all delicious.</p>
                    <ul className='pizzas'>
                        {pizzas.map((pizzaObject) => (
                            <Pizza pizza={pizzaObject} key={`${pizzaObject.name}-${pizzaObject.photoName}`}/>
                        ))}
                    </ul>
                </Fragment>
                )
                : (<p>Sorry, we are closed.</p>)
            }
        </main>
    );
};

function Pizza({pizza}) {
    const { name, ingredients, photoName, price, soldOut } = pizza;
    
    return (
        <li className={`pizza ${soldOut ? 'sold-out' : ''}`}>
            <img src={photoName} alt={name} />
            <div>
                <h3>{name}</h3>
                <p>{ingredients}</p>
                <span>{soldOut ? 'Sold out' : price}</span>
            </div>
        </li>
    );
}

const Footer = () => {
    const hour = new Date().getHours();
    const openHour = 9;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour <= closeHour;
    
    return (
        <footer className='footer'>
            <div className='order'>
                {isOpen
                    ? (<Order closeHour={closeHour}/>)
                    : (<p>We are closed. See you tomorrow at {openHour}:00.</p>)
                }
                <button className='btn'>Order</button>
            </div>
        </footer>
    )
};

const Order = ({ closeHour }) => {
    return (
        <div className='order'>
            <p>We are open until {closeHour}:00. Come visit us or order online. </p>
        </div>
    )
};

// React v18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

