import { ButtonSet, Button  } from 'components';
import { TourProps } from './Tour.interface';

const TOUR_CONTENT = 'Find legislations that are relevant to you by selecting the filters of interest from the filter list. Matching legislations will be shown based on your filter selection.';

const Tour = ({
  user,
  content = TOUR_CONTENT,
  firstButton = 'Learn more',
  secondButton = 'Start filtering',
  onNext,
  onPrevious,
  ...rest
}: TourProps) => {


  return (
    <article
      data-tour-guide={user?.show_guided_tour}
      {...rest}
    >
      <p>{content}</p>
      <ButtonSet data-button-set>
        <Button
          variation="transparent"
          size="small"
          data-tour-action
          onClick={onPrevious}
        >
          {firstButton}
        </Button>
        <Button
          variation="transparent"
          size="small"
          data-tour-action
          onClick={onNext}
        >
          {secondButton}
        </Button>
      </ButtonSet>
    </article>
  );

};

export default Tour;
