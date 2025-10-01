import { UserInterface } from 'hooks/interfaces/user.interface';

/**
 * Property information interface
 */
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  postalCode: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  status: 'active' | 'pending' | 'sold' | 'draft';
  imageUrl?: string;
  createdAt: string;
}

/**
 * Props for the Properties presenter component
 */
export interface PropertiesProps {
  /**
   * Current user data
   */
  user: UserInterface | null;

  /**
   * Array of user properties
   */
  properties: Property[];

  /**
   * Whether properties data is loading
   */
  isLoading: boolean;

  /**
   * Any error message to display
   */
  error: string | null;

  /**
   * Function to refresh properties list
   */
  onRefresh: () => void;

  /**
   * Function to add a new property
   */
  onAddProperty: () => void;

  /**
   * Function to delete a property
   */
  onDeleteProperty: (id: string) => void;

  /**
   * Function to edit a property
   */
  onEditProperty: (property: Property) => void;

  /**
   * Whether an action is in progress
   */
  isProcessing: boolean;
}
