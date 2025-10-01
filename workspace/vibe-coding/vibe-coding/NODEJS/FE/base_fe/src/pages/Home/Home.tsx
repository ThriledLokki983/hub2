import { PATH_PATTERNS } from 'configs/paths';

import { Button, ButtonSet } from 'components';

import styles from './Home.module.scss';


const Home = () => {

  return (
    <article className={styles.root}>
      <h1>Hello world</h1>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letter asset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
      <ButtonSet>
        <Button url={PATH_PATTERNS}>Say hello</Button>
        <Button url="https://www.google.com/search?q=never+gonna+give+you+up" variation="secondary">Google it</Button>
      </ButtonSet>
    </article>
  );

};

export default Home;
