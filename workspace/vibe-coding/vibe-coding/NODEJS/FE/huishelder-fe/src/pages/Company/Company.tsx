import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Company.module.scss';
import { LabeledInput, Icon, StyledSelect } from 'components';

/**
 * Company page component - serves as a layout container for company-related pages
 * such as About Us, Contact, Careers, and Blog
 */
const Company: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    address: '',
    postalCode: '',
    companyType: '',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Handle successful submission
    } catch (error) {
      setSubmitError('Failed to submit company information. Please try again.');
    }
  };

  return (
    <div className={styles['company-page']}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {submitError && <div className={styles.error}>{submitError}</div>}
        <div className={styles.formGroup}>
          <LabeledInput
            id="company-name"
            label="Company Name"
            icon={{
              object: () => (
                <Icon name="buildings" phosphor="Buildings" weight="light" width={20} />
              ),
            }}
          >
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </LabeledInput>

          <LabeledInput
            id="registration-number"
            label="Registration Number"
            icon={{
              object: () => (
                <Icon
                  name="identification"
                  phosphor="IdentificationCard"
                  weight="light"
                  width={20}
                />
              ),
            }}
          >
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              required
            />
          </LabeledInput>
        </div>

        <div className={styles.formGroup}>
          <LabeledInput
            id="company-address"
            label="Company Address"
            icon={{
              object: () => <Icon name="map-pin" phosphor="MapPin" weight="light" width={20} />,
            }}
          >
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </LabeledInput>

          <LabeledInput
            id="company-postal-code"
            label="Postal Code"
            icon={{
              object: () => <Icon name="envelope" phosphor="Envelope" weight="light" width={20} />,
            }}
          >
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
            />
          </LabeledInput>
        </div>

        <LabeledInput
          id="company-type"
          label="Company Type"
          icon={{
            object: () => <Icon name="briefcase" phosphor="Briefcase" weight="light" width={20} />,
          }}
        >
          <StyledSelect>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select company type</option>
              <option value="real-estate-agency">Real Estate Agency</option>
              <option value="property-developer">Property Developer</option>
              <option value="property-management">Property Management</option>
              <option value="other">Other</option>
            </select>
          </StyledSelect>
        </LabeledInput>
      </form>
      <Outlet />
    </div>
  );
};

export default Company;
