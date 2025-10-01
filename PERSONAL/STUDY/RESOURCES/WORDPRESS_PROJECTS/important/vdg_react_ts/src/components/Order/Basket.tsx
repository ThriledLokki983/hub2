import React from 'react';
import {
	BasketContainer,
	BasketHeader,
	OrderDetails,
	OrderDetailsColumn,
	Div as Watch,
	Div as Band,
	Div as Extra,
	Div as Closing,
	OrderLines,
	ProductTotal,
} from '../Common/styles';
import Product from './Product';

const Basket = () => {
	return (
		<BasketContainer>
			<BasketHeader>Bestelling</BasketHeader>
			<OrderDetails>
				<OrderDetailsColumn>
					<span>Type</span>
					<span>Prijs</span>
					<span>Omschrijving</span>
				</OrderDetailsColumn>
				<OrderLines>
					<Watch>
						<Product isInscribed={true} />
					</Watch>
					<Band>
						<span>band</span>
					</Band>
					<Extra>
						<span>extra</span>
					</Extra>
					<Closing>
						<span>closing</span>
					</Closing>
				</OrderLines>
				<ProductTotal>
					<span>Totaal</span>
					<span>0.00</span>
				</ProductTotal>
			</OrderDetails>
		</BasketContainer>
	);
};

export default Basket;
