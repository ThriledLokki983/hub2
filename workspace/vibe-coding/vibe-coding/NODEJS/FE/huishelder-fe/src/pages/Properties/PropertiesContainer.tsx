import React, { useEffect, useState } from 'react';
import { useUserContext } from 'contexts';
import { useMutationApi, useQueryApi } from 'hooks/useQueryApi';
import { GET_USER_PROPERTIES, DELETE_PROPERTY } from 'configs/api-endpoints';
import { Property } from './Properties.interface';
import Properties from './Properties';

/**
 * Properties page container component - handles data fetching and business logic
 * This follows the container part of the Container/Presenter pattern
 *
 * @returns React component
 */
const PropertiesContainer: React.FC = () => {
  const { user } = useUserContext();

  // Fetch user properties
  const {
    data: propertiesData,
    isLoading,
    error: fetchError,
    refetch,
  } = useQueryApi(GET_USER_PROPERTIES, null, {
    enabled: !!user?.authenticated, // Only fetch if user is authenticated
  });

  // For delete property action
  const {
    mutate: deleteProperty,
    isPending: isDeleting,
    error: deleteError,
  } = useMutationApi(DELETE_PROPERTY, {
    onSuccess: () => {
      // Refetch properties after successful deletion
      refetch();
    },
  });

  // Sample mock properties data (would normally come from the API)
  const [mockProperties, setMockProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern Apartment in Amsterdam',
      address: 'Prinsengracht 263',
      city: 'Amsterdam',
      postalCode: '1016 GV',
      price: 450000,
      size: 85,
      bedrooms: 2,
      bathrooms: 1,
      description: 'A beautiful modern apartment in the heart of Amsterdam.',
      status: 'active',
      imageUrl:
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '2025-03-15T12:00:00Z',
    },
    {
      id: '2',
      title: 'Spacious Family Home',
      address: 'Laan van Meerdervoort 123',
      city: 'The Hague',
      postalCode: '2517 AZ',
      price: 675000,
      size: 140,
      bedrooms: 4,
      bathrooms: 2,
      description: 'Perfect family home with garden in a quiet neighborhood.',
      status: 'pending',
      imageUrl:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '2025-04-02T09:30:00Z',
    },
    {
      id: '3',
      title: 'Canal House with Character',
      address: 'Herengracht 45',
      city: 'Amsterdam',
      postalCode: '1015 BW',
      price: 1250000,
      size: 210,
      bedrooms: 5,
      bathrooms: 3,
      description: 'Historic canal house with original features and modern amenities.',
      status: 'sold',
      imageUrl:
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '2025-01-20T14:45:00Z',
    },
  ]);

  // Format any error message for the UI
  const errorMessage =
    deleteError || fetchError
      ? (deleteError || fetchError) instanceof Error
        ? (deleteError || fetchError).message
        : 'An error occurred. Please try again.'
      : null;

  // Handle delete property
  const handleDeleteProperty = (id: string) => {
    // In a real app, this would call the API
    // deleteProperty({ id });

    // For demonstration, use the mock data
    setMockProperties(prevProperties => prevProperties.filter(property => property.id !== id));
  };

  // Handle edit property
  const handleEditProperty = (property: Property) => {
    console.log('Edit property:', property);
    // In a real app, this would navigate to an edit form
    // navigate(`/properties/edit/${property.id}`);
    alert(`Edit property: ${property.title}`);
  };

  // Handle add new property
  const handleAddProperty = () => {
    console.log('Add new property');
    // In a real app, this would navigate to an add form
    // navigate('/properties/new');
    alert('Add new property');
  };

  // Handle refresh/refetch
  const handleRefresh = () => {
    refetch();
    // For demonstration, randomize mock data order
    setMockProperties(prevProperties => [...prevProperties].sort(() => 0.5 - Math.random()));
  };

  return (
    <Properties
      user={user}
      properties={mockProperties}
      isLoading={isLoading}
      error={errorMessage}
      onRefresh={handleRefresh}
      onAddProperty={handleAddProperty}
      onDeleteProperty={handleDeleteProperty}
      onEditProperty={handleEditProperty}
      isProcessing={isDeleting}
    />
  );
};

export default PropertiesContainer;
