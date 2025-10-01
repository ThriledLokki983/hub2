import React from 'react';
import styled from 'styled-components';
import { FiClock, FiMapPin } from 'react-icons/fi';
import {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
  breakpoints,
} from '../../theme/theme';

interface ClassicCardProps {
  title: string;
  image: string;
  description: string;
  rating?: number;
  days?: number;
  region?: string;
  prep_time?: string;
  difficulty?: string;
  variant?: 'compact' | 'detailed';
  onReserve?: () => void;
}

const Card = styled.div<{
  $backgroundColor?: string;
}>`
  --tw-shadow: 0px 5px 18px rgba(204, 204, 204, 0.1);
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow-colored: 0px 5px 18px var(--tw-shadow-color);

  border-radius: 32px;
  overflow: hidden;
  box-shadow: ${shadows.soft};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 275px;
  height: 450px;
  transition: background-color 0.3s ease;

  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;

const ImageContainer = styled.div.attrs(() => ({
  // Return empty object to remove backgroundColor from DOM attributes
}))<{
  $variant: 'compact' | 'detailed';
  $backgroundColor?: string;
}>`
  position: relative;
  width: 100%;
  background-color: ${(props) =>
    props.$backgroundColor
      ? `rgba(${props.$backgroundColor}, 0.05)`
      : colors.white};
  padding-top: ${(props) => (props.$variant === 'compact' ? '75%' : '100%')};
  overflow: hidden;
  height: ${(props) => (props.$variant === 'compact' ? '320px' : '530px')};
  border-radius: ${(props) =>
    props.$variant === 'compact' ? '24px 24px 0 0' : '32px'};
`;

const PropertyImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 65%;
  object-fit: cover;
  object-position: bottom center;
`;

const RegionTag = styled.span`
  position: absolute;
  top: calc(${spacing.sm} + 0.75rem);
  right: calc(${spacing.sm} + 0.75rem);
  background-color: ${colors.cosmicLatte}CC;
  backdrop-filter: blur(4px);
  color: ${colors.emeraldGreen};
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: 0.2rem 0.6rem;
  border-radius: calc(${borderRadius.sm} * 3);
  font-weight: ${typography.fontWeights.medium};
  letter-spacing: ${typography.letterSpacing};

  @media (min-width: ${breakpoints.tablet}) {
    top: calc(${spacing.sm} + 0.75rem);
    right: calc(${spacing.sm} + 0.75rem);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

const DetailedCardOverlay = styled.div`
  --dominant-color-rgb: 33, 33, 33; /* Default dark color */

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(var(--dominant-color-rgb), 0.05) 25%,
    rgba(var(--dominant-color-rgb), 0.2) 42%,
    rgba(var(--dominant-color-rgb), 0.9) 60%
  );
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px 12px 12px 12px;
`;

const DetailedCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 8px;
`;

const Title = styled.h3<{ $variant: 'compact' | 'detailed' }>`
  font-weight: ${typography.fontWeights.medium};
  color: ${(props) =>
    props.$variant === 'compact' ? colors.deepSpace : colors.white};
  font-size: ${(props) => (props.$variant === 'compact' ? '1.1rem' : '1.3rem')};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p<{ $variant: 'compact' | 'detailed' }>`
  color: ${(props) =>
    props.$variant === 'compact'
      ? colors.galaxyGrey
      : 'rgba(255, 255, 255, 0.9)'};
  font-size: ${(props) => (props.$variant === 'compact' ? '0.85rem' : '0.9rem')};
  font-weight: ${typography.fontWeights.light};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.5em * 2);
`;

const RecipeViewButton = styled.button<{ $variant: 'compact' | 'detailed' }>`
  --dominant-color-rgb: 33, 33, 33; /* Default dark color */

  background-color: ${colors.white};
  color: ${colors.deepSpace};
  border: 1px solid rgba(var(--dominant-color-rgb), 0.2);
  border-radius: ${(props) => (props.$variant === 'compact' ? '12px' : '16px')};
  padding: 8px 16px;
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.medium};
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
  margin-top: 16px;
  box-shadow: ${shadows.soft};

  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${colors.emeraldGreen};
    color: ${colors.white};
    box-shadow: ${shadows.medium};
    border: ${colors.white} 1px solid;
  }
`;

const DynamicColorOverlay = styled.div`
  --dominant-color-rgb: 33, 33, 33; /* Default dark color */

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.85;
  border-radius: 32px;
  background: linear-gradient(
    to bottom,
    rgba(var(--dominant-color-rgb), 0.05) 9%,
    rgba(var(--dominant-color-rgb), 0.24) 25%,
    rgba(var(--dominant-color-rgb), 0.95) 65%
  );
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  gap: 8px;
  margin-top: 16px;
`;

const MetaItem = styled.div<{
  $difficulty: 'easy' | 'medium' | 'hard' | 'other';
}>`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4);
  color: ${colors.white};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  backdrop-filter: blur(5px);
  font-weight: ${typography.fontWeights.light};

  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.$difficulty === 'easy'
        ? colors.emeraldGreen
        : props.$difficulty === 'medium'
        ? colors.maximumYellow
        : props.$difficulty === 'hard'
        ? colors.darkPastelRed
        : colors.cosmicLatte};
    margin-right: 6px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.8rem;

    &:before {
      width: 6px;
      height: 6px;
      margin-right: 8px;
    }
  }
`;
const PrepTime = styled.div<{
  $difficulty: 'easy' | 'medium' | 'hard' | 'other';
}>`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4);
  color: ${colors.white};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  backdrop-filter: blur(5px);
  font-weight: ${typography.fontWeights.light};


  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.8rem;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: ${spacing.xs};
  color: ${colors.white};
`;

const ClassicCard: React.FC<ClassicCardProps> = ({
  title,
  image,
  description,
  region,
  prep_time,
  difficulty,
  variant = 'detailed', // Provide default value
  onReserve,
}) => {
  const [dominantColor, setDominantColor] =
    React.useState<string>('33, 33, 33');

  React.useEffect(() => {
    const extractColor = async () => {
      try {
        // Skip color extraction if image is empty or null
        if (!image) {
          return;
        }

        // Create a temporary image element to load the image
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        // Add error handling before setting the source
        const handleImageError = () => {
          console.error('Error loading image for color extraction');
          setDominantColor('33, 33, 33'); // Set default color on error
        };

        // Set up event handlers first
        img.onload = () => {
          try {
            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              handleImageError();
              return;
            }
            // Set canvas dimensions to a smaller size for performance
            canvas.width = 50;
            canvas.height = 50;

            // Try to draw the image with error handling
            try {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } catch (drawError) {
              console.error('Error drawing image to canvas:', drawError);
              handleImageError();
              return;
            }

            // Get pixel data
            let imageData;
            try {
              imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            } catch (pixelError) {
              // This can happen with CORS issues
              console.error('Error getting image data:', pixelError);
              handleImageError();
              return;
            }

            // Calculate dominant color by averaging pixels
            let r = 0,
              g = 0,
              b = 0,
              count = 0;

            // Sample pixels from various regions (focusing on bottom area where overlay is most visible)
            for (
              let y = Math.floor(canvas.height * 0.5);
              y < canvas.height;
              y += 2
            ) {
              for (let x = 0; x < canvas.width; x += 2) {
                const i = (y * canvas.width + x) * 4;
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
                count++;
              }
            }

            // Calculate averages
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            // Darken the color for better overlay
            r = Math.floor(r * 0.7);
            g = Math.floor(g * 0.7);
            b = Math.floor(b * 0.7);

            // Update state with the dominant color
            setDominantColor(`${r}, ${g}, ${b}`);
          } catch (processError) {
            console.error('Error processing image color:', processError);
            handleImageError();
          }
        };

        img.onerror = handleImageError;

        // Now set the source to trigger loading
        // Try with a proxy if it's an external URL to bypass CORS
        if (image.startsWith('http') && !image.includes(window.location.hostname)) {
          // For external images, try using a CORS proxy
          // You might need to set up your own proxy or use one that's available
          const proxyUrl = `https://cors-anywhere.herokuapp.com/${image}`;
          img.src = proxyUrl;

          // Set a timeout to fall back to default color if the proxy fails
          const timeoutId = setTimeout(() => {
            if (!img.complete) {
              console.warn('Image load timed out, using default color');
              handleImageError();
            }
          }, 3000);

          // Clean up timeout on successful load
          img.onload = () => {
            clearTimeout(timeoutId);
            img.onload(); // Call the original onload handler
          };
        } else {
          // For local images or same-origin images
          img.src = image;
        }
      } catch (error) {
        console.error('Error extracting color:', error);
        setDominantColor('33, 33, 33'); // Set default color on error
      }
    };

    if (image) {
      extractColor();
    } else {
      setDominantColor('33, 33, 33'); // Set default color when no image
    }
  }, [image]);

  return (
    <Card data-variant={variant}>
      <ImageContainer
        $variant={variant}
        $backgroundColor={dominantColor}>
        <PropertyImage
          src={image || undefined}
          alt={title}
        />
        {region && (
          <RegionTag>
            <IconWrapper>
              <FiMapPin
                size={12}
                color={colors.emeraldGreen}
              />
            </IconWrapper>
            <span>{region}</span>
          </RegionTag>
        )}
        <DynamicColorOverlay
          style={
            { '--dominant-color-rgb': dominantColor } as React.CSSProperties
          }
        />
        <DetailedCardOverlay
          style={
            { '--dominant-color-rgb': dominantColor } as React.CSSProperties
          }>
          <DetailedCardHeader>
            <Title $variant={variant}>{title}</Title>
            <Description $variant={variant}>{description}</Description>
          </DetailedCardHeader>

          <MetaInfo>
            <PrepTime $difficulty={
              difficulty?.toLowerCase() === 'easy'
              ? 'easy'
              : difficulty?.toLowerCase() === 'medium'
              ? 'medium'
              : difficulty?.toLowerCase() === 'hard'
              ? 'hard'
              : 'other'
            }>
              <IconWrapper style={{
              color:
                (difficulty?.toLowerCase() === 'easy'
                ? colors.emeraldGreen
                : difficulty?.toLowerCase() === 'medium'
                ? colors.maximumYellow
                : difficulty?.toLowerCase() === 'hard'
                ? colors.darkPastelRed
                : colors.cosmicLatte)
              }}>
              <FiClock size={12} />
              </IconWrapper>
              {prep_time}
            </PrepTime>
            <MetaItem
              $difficulty={
                difficulty?.toLowerCase() === 'easy'
                  ? 'easy'
                  : difficulty?.toLowerCase() === 'medium'
                  ? 'medium'
                  : difficulty?.toLowerCase() === 'hard'
                  ? 'hard'
                  : 'other'
              }>
              {difficulty}
            </MetaItem>
          </MetaInfo>

          <RecipeViewButton
            $variant={variant}
            onClick={onReserve}
            style={
              { '--dominant-color-rgb': dominantColor } as React.CSSProperties
            }>
            View Recipe
          </RecipeViewButton>
        </DetailedCardOverlay>
      </ImageContainer>
    </Card>
  );
};

export default ClassicCard;
