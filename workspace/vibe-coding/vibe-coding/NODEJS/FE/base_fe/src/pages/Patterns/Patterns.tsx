import {
  AlertBar,
  Button,
  ButtonSet,
  LabeledInput,
  StyledSelect,
} from 'components';

import styles from './Patterns.module.scss';


const Patterns = () => {

  return (
    <article className={styles.root}>

      <AlertBar variation="notice">
        <p>Hey! Just letting you know.</p>
      </AlertBar>
      <AlertBar variation="success">
        <p>Success! Well done.</p>
      </AlertBar>
      <AlertBar variation="warning">
        <p>Make sure you bla bla.</p>
      </AlertBar>
      <AlertBar variation="error">
        <p>Warning! You did something stupid.</p>
      </AlertBar>

      <hr />

      <h1>Heading 1</h1>
      <p>
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
      </p>

      <h2>Heading 2</h2>
      <p>
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
      </p>

      <h3>Heading 3</h3>
      <p>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consecrate, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubted source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de " (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      </p>

      <h4>Heading 4</h4>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of enetreset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>

      <hr />

      <h3>A wild form has appeared</h3>
      <form>

        <LabeledInput id="input-1" label="Your name">
          <input type="text" />
        </LabeledInput>

        <LabeledInput id="input-2" label="E-mail address">
          <input type="email" />
        </LabeledInput>

        <LabeledInput id="input-3" label="Duration" >
          <StyledSelect>
            <select name="duration" required defaultValue="">
              <option value="">Choose an option</option>
              <option value="" disabled>&mdash;&mdash;&mdash;</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </StyledSelect>
        </LabeledInput>

        <ButtonSet>
          <Button variation="secondary">Cancel</Button>
          <Button type="submit">Submit</Button>
        </ButtonSet>
      </form>
    </article>
  );

};

export default Patterns;
