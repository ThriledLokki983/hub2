export const cleanupSearchValue = (inputValue: string) => {
	const newInputValue = inputValue.trim();
	const inputValueArray = inputValue.split(' ');

	if (inputValueArray.length === 2) {
		const firstName = inputValueArray[0].trim();
		const lastName = inputValueArray[1].trim();

		if (!(firstName === '' && lastName === '')) {
			return [firstName, lastName];
		}
	} else if (inputValueArray.length === 3) {
		const firstName = inputValueArray[0].trim();
		const middleName = inputValueArray[1].trim();
		const lastName = inputValueArray[2].trim();

		if (!(firstName === '' && middleName === '' && lastName === '')) {
			return [firstName, middleName, lastName];
		}
	} else if (!(newInputValue === '' && newInputValue.length < 3)) {
		return newInputValue;
	}
};

export const remapClientData = (obj: any) => {
	const newObj = { ...obj };
	Object.keys(newObj).forEach((key) => {
		if (key === 'FirstName') {
			newObj['voornaam'] = newObj[key];
			delete newObj[key];
		} else if (key === 'LastName') {
			newObj['achternaam'] = newObj[key];
			delete newObj[key];
		} else if (key === 'MiddleName') {
			newObj['tussenvoegsel'] = newObj[key];
			delete newObj[key];
		} else if (key === 'CountryName') {
			newObj['land'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Initials') {
			newObj['voorletters'] = newObj[key];
			delete newObj[key];
		} else if (key === 'City') {
			newObj['plaats'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Postcode') {
			newObj['postcode'] = newObj[key];
			delete newObj[key];
		} else if (key === 'AddressLine1') {
			newObj['adres'] = newObj[key];
			delete newObj[key];
		} else if (key === 'VATNumber') {
			newObj['btw_nummer'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Email') {
			newObj['email'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Mobile') {
			newObj['telefoonnummer'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Phone') {
			newObj['mobielnummer'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Name') {
			newObj['naam'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Country') {
			newObj['land'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Notes') {
			newObj['extraopmerking'] = newObj[key];
			delete newObj[key];
		} else if (key === 'Title') {
			newObj['aanhef'] = newObj[key];
			delete newObj[key];
		}
	}, {});

	return newObj;
};
