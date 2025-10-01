import React, { useState } from 'react';
import { Icon, LabeledInput, StyledSelect } from 'components';
import { PropertiesProps, Property } from './Properties.interface';
import styles from './Properties.module.scss';

/**
 * Format currency in Euro format
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format square meter size
 */
const formatSize = (size: number): string => {
  return `${size} m²`;
};

/**
 * Properties presenter component - handles UI rendering for user properties page
 *
 * @param props - Component properties
 * @returns React component
 */
const Properties: React.FC<PropertiesProps> = ({
  user,
  properties,
  isLoading,
  error,
  onRefresh,
  onAddProperty,
  onDeleteProperty,
  onEditProperty,
  isProcessing,
}) => {
  // State for filtering and search
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter properties based on status, type, and search term
  const filteredProperties = properties.filter(property => {
    // Filter by status
    if (filters.status !== 'all' && property.status !== filters.status) {
      return false;
    }

    // Filter by type
    if (filters.type !== 'all' && property.type !== filters.type) {
      return false;
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.postalCode.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  // Property card component
  const PropertyCard = ({ property }: { property: Property }) => (
    <div className={styles.propertyCard}>
      <div className={styles.propertyImage}>
        {property.imageUrl ? (
          <img src={property.imageUrl} alt={property.title} />
        ) : (
          <div className={styles.noImage}>
            <Icon name="house-simple" phosphor="House" weight="light" width={32} />
          </div>
        )}
        <div className={`${styles.statusBadge} ${styles[property.status]}`}>{property.status}</div>
      </div>
      <div className={styles.propertyContent}>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyAddress}>
          {property.address}, {property.city}
        </p>
        <p className={styles.propertyPrice}>{formatPrice(property.price)}</p>
        <div className={styles.propertyFeatures}>
          <div className={styles.feature}>
            <span className={styles.featureValue}>{formatSize(property.size)}</span>
            <span className={styles.featureLabel}>Size</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureValue}>{property.bedrooms}</span>
            <span className={styles.featureLabel}>Bedrooms</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureValue}>{property.bathrooms}</span>
            <span className={styles.featureLabel}>Bathrooms</span>
          </div>
        </div>
        <div className={styles.propertyCardFooter}>
          <button
            className={styles.actionButton}
            onClick={() => onEditProperty(property)}
            disabled={isProcessing}
          >
            <Icon name="pencil" phosphor="PencilSimple" weight="light" width={16} />
            Edit
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => onDeleteProperty(property.id)}
            disabled={isProcessing}
          >
            <Icon name="trash" phosphor="Trash" weight="light" width={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Empty state when no properties are available
  const EmptyState = () => (
    <div className={styles.emptyState}>
      <Icon name="house" phosphor="Houses" weight="light" width={48} className={styles.emptyIcon} />
      <h3>No Properties Found</h3>
      <p>
        {filters.status !== 'all' || filters.type !== 'all' || searchTerm
          ? 'No properties match your current filters. Try adjusting your search criteria.'
          : "You don't have any properties yet. Add your first property to get started."}
      </p>
      <button className={styles.addButton} onClick={onAddProperty}>
        <Icon name="plus" phosphor="Plus" weight="light" width={16} />
        Add Property
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Properties</h1>
        </div>
        <div className={styles.loading}>
          <Icon
            name="circle-notch"
            phosphor="CircleNotch"
            weight="light"
            width={24}
            className={styles.spinnerIcon}
          />
          Loading properties...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Properties</h1>
        </div>
        <div className={styles.errorMessage}>Please log in to view your properties.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Properties</h1>
        <div className={styles.actions}>
          <button className={styles.refreshButton} onClick={onRefresh} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Icon
                  name="circle-notch"
                  phosphor="CircleNotch"
                  weight="light"
                  width={16}
                  className={styles.spinnerIcon}
                />
                Refreshing...
              </>
            ) : (
              <>
                <Icon name="arrow-clockwise" phosphor="ArrowClockwise" weight="light" width={16} />
                Refresh
              </>
            )}
          </button>
          <button className={styles.addButton} onClick={onAddProperty} disabled={isProcessing}>
            <Icon name="plus" phosphor="Plus" weight="light" width={16} />
            Add Property
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.searchContainer}>
        <div className={styles.filters}>
          <LabeledInput id="property-status" label="Status" className={styles.filterSelect}>
            <StyledSelect>
              <select
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </StyledSelect>
          </LabeledInput>

          <LabeledInput id="property-type" label="Property Type" className={styles.filterSelect}>
            <StyledSelect>
              <select
                value={filters.type}
                onChange={e => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
              </select>
            </StyledSelect>
          </LabeledInput>
        </div>

        <div className={styles.searchBox}>
          <LabeledInput
            id="property-search"
            label="Search properties"
            icon={{
              object: () => (
                <Icon
                  name="magnifying-glass"
                  phosphor="MagnifyingGlass"
                  weight="light"
                  width={20}
                />
              ),
            }}
          >
            <input
              type="search"
              placeholder="Search by location, property type..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </LabeledInput>
        </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className={styles.propertiesList}>
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Properties;
