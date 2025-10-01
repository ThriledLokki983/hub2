import { useCallback, useState } from 'react';
// import useForm from '../../customHooks/useForm';
import useForm from '../../customHooks/useOtherForm';
// import useFillForm from '../../customHooks/useFillForm';
// import { customerDetails } from '../../utils/customerDetails';
import { Content } from '../Common/styles';
import { MultiButton } from '../Search/search.style';
import { Button, LinkButton } from '../Common/styles';
import { remapClientData } from '../../utils/helper';
import { countries } from '../../utils/data/countriesData';

import Form from '../Common/form';
import Input from '../UI/Input/Input';
import Select from '../UI/Select/Select';
import RadioGroup from '../UI/Radio/RadioGroup';
import TextArea from '../UI/TextArea/TextArea';

import '../../components/SignUp/signupForm.css';

import { useAppSelector } from '../../redux/app/hooks';
// import { getClient } from '../../redux/features/customers/customerSlice';
// import useCustomerAndAccount from '../../customHooks/useCustomerAccount';

interface CustomerDetailsProps {
	handlePreviousPage: (progressValue: number) => void;
	handleNextPage: (progressValue: number) => void;
	setModalValue: (modalOpen: boolean) => void;
}

interface RegisterProps {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	phone: string;
}

const Customer = ({
	handlePreviousPage,
	handleNextPage,
	setModalValue,
}: CustomerDetailsProps) => {
	const client = useAppSelector((state) => state.customers.client);
	const clientData = remapClientData(client);
	const [values, setValues] = useState(clientData);
	const [userData, setUserData] = useForm(clientData);

	// console.log(client);

	const goToNextPage = useCallback(() => {
		handleNextPage(50);
		console.log(values);
	}, [handleNextPage, values]);

	const goToPreviousPage = useCallback(() => {
		handlePreviousPage(0);
		setModalValue(false);
	}, [handlePreviousPage, setModalValue]);

	const onFormSubmit = useCallback(() => {
		console.log(values);
	}, [values]);

	const isFormValid = () => {
		return true;
	};

	const set = useCallback(
		(name: any) => {
			return ({ target: { value } }: any) => {
				setValues((oldValues: any) => ({
					...oldValues,
					[name]: value,
				}));

				console.log(values);
			};
		},
		[values]
	);

	return (
		<Content>
			<Form
				onSubmit={() => {
					console.log('hello');
				}}>
				<RadioGroup
					handleChange={set('aanhef')}
					label='Aanhef'
					type='radio'
					name='aanhef'
					titles={['Dhr', 'Mevrouw']}
					errorMessage=''
					isValid={false}
				/>
				<Input
					label={'Voorletters(s)'}
					type={'text'}
					name={'voorletters'}
					errorMessage=''
					isValid={false}
					value={values.voorletters}
					handleChange={set('voorletters')}
				/>
				<Input
					label={'Voornaam'}
					type={'text'}
					name={'voornaam'}
					errorMessage=''
					isValid={false}
					value={values.voornaam ? values.voornaam : ''}
					handleChange={set('voornaam')}
				/>
				<Input
					label={'Tussenvoegsel'}
					type={'text'}
					name={'tussenvoegsel'}
					errorMessage=''
					isValid={false}
					value={values.tussenvoegsel ? values.tussenvoegsel : ''}
					handleChange={set('tussenvoegsel')}
				/>
				<Input
					label={'Achternaam'}
					type={'text'}
					name={'achternaam'}
					value={values.achternaam ? values.achternaam : ''}
					handleChange={set('achternaam')}
					errorMessage=''
					isValid={false}
				/>
				<Input
					label={'BTW Nummer'}
					type={'text'}
					name={'btw_nummer'}
					value={values.btw_nummer ? values.btw_nummer : ''}
					handleChange={set('btw_nummer')}
					errorMessage=''
					isValid={false}
				/>
				<Input
					label={'Adres'}
					type={'text'}
					name={'adres'}
					value={values.adres ? values.adres : ''}
					handleChange={set('adres')}
					errorMessage=''
					isValid={false}
				/>
				<Input
					label={'Postcode'}
					type={'text'}
					name={'postcode'}
					value={values.postcode ? values.postcode : ''}
					handleChange={set('postcode')}
					errorMessage=''
					isValid={false}
				/>
				<Input
					label={'Plaats'}
					type={'text'}
					name={'plaats'}
					value={values.plaats ? values.plaats : ''}
					handleChange={set('plaats')}
					errorMessage=''
					isValid={false}
				/>
				<Select
					label='Land'
					data={countries}
					value={values.land ? values.land : ''}
					handleChange={set('land')}
					name='land'
				/>
				<Input
					label={'E-mailadres'}
					type={'text'}
					name={'email'}
					value={values.email ? values.email : ''}
					handleChange={set('email')}
					errorMessage=''
					isValid={false}
				/>
				<Input
					label={'Telefoonnummer'}
					type={'number'}
					name={'telefoonnummer'}
					value={values.telefoonnummer ? values.telefoonnummer : ''}
					handleChange={set('telefoonnummer')}
					errorMessage=''
					isValid={false}
				/>
				<TextArea
					label='Extra Opmerking'
					name='extraopmerking'
					rowNumber={5}
					value={values.extraopmerking ? values.extraopmerking : ''}
					handleChange={set('extraopmerking')}
					errorMessage=''
					isValid={false}
				/>
				{/* ------------------------------------------------------------------------------------- */}
				<MultiButton>
					<LinkButton to='/' onClick={goToPreviousPage}>
						Terug
					</LinkButton>
					<Button disabled={!isFormValid()}>
						klantgegevens opslaan
					</Button>
					<LinkButton to='/order' onClick={goToNextPage}>
						verder
					</LinkButton>
				</MultiButton>
				{/* ------------------------------------------------------------------------------------- */}
			</Form>
		</Content>
	);
};

export default Customer;
