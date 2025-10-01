import React, { useState } from 'react';
import { Button, LazyComponentWrapper } from 'components';

// Import lazy-loaded components
import { AlertBar, LabeledInput, StyledSelect } from 'components';

const LazyComponentExample: React.FC = () => {
  const [showLazyComponents, setShowLazyComponents] = useState(false);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Lazy Loading Example</h3>
      <Button onClick={() => setShowLazyComponents(!showLazyComponents)}>
        {showLazyComponents ? 'Hide' : 'Load'} Lazy Components
      </Button>

      {showLazyComponents && (
        <LazyComponentWrapper>
          <div style={{ marginTop: '1rem' }}>
            <AlertBar
              type="info"
              title="Lazy Loaded Alert"
              variation="notice"
            >
              This alert was lazy loaded and only included in the bundle when needed
            </AlertBar>

            <div style={{ marginTop: '1rem' }}>
              <LabeledInput
                id="lazy-input"
                label="Lazy Loaded Input"
                name="lazyInput"
                placeholder="This input was lazy loaded"
              >
                <input type="text" id="lazy-input" placeholder="This input was lazy loaded" />
              </LabeledInput>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <StyledSelect
                label="Lazy Loaded Select"
                options={[
                  { value: '1', label: 'Option 1' },
                  { value: '2', label: 'Option 2' },
                  { value: '3', label: 'Option 3' }
                ]}
              >
                {/* StyledSelect requires children */}
                <div></div>
              </StyledSelect>
            </div>
          </div>
        </LazyComponentWrapper>
      )}
    </div>
  );
};

export default LazyComponentExample;
