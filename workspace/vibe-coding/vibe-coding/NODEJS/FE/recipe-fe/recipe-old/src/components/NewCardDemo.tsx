import React from 'react';
import styled from 'styled-components';
// import ClassicCard from './Cards/ClassicCard';
import { spacing, breakpoints } from '../theme/theme';
import ElegantCard from './Cards/ElegantCard';
import ClassicCard from './Cards/ClassicCard';

const DemoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xl};
  padding: ${spacing.xl};
  justify-content: center;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
  }
`;

const NewCardDemo: React.FC = () => {
  const icelandCabinProps = {
    title: 'Jollof Rice',
    image:
      'https://kikifoodies.com/wp-content/uploads/2024/11/ET5B6272-2-1024x1024.jpg',
    description:
      'A signature West African dish, this Ghanaian Jollof Rice is cooked with aromatic spices, tomatoes, and paired with perfectly grilled chicken.',
    rating: 4.9,
    prepTime: '30 minutes',
    difficulty: 'Easy',
    region: 'Central Region',
    onReserve: () => alert('Reservation requested'),
  };

  return (
    <DemoContainer>
      <ElegantCard
        {...icelandCabinProps}
        variant='compact'
      />
      <ClassicCard
        {...icelandCabinProps}
        variant='compact'
      />
    </DemoContainer>
  );
};

export default NewCardDemo;
