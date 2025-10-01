//! NOTE: THIS IS A PAGE FOR TESTING AND SHOWCASING COMPONENTS :-)

import { useState, Fragment, useEffect, memo } from 'react';
import { useUserContext } from 'contexts';

import {
  AlertBar,
  Aside,
  Button,
  ButtonSet,
  Drawer,
  Modal,
  LabeledInput,
  StyledSelect,
  TopContent,
  CheckboxGroup,
  CustomCheckbox,
} from 'components';

import styles from './Patterns.module.scss';


const Patterns = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [numbers, setNumbers] = useState<Array<{label: string, value: string, checked: boolean}>>([]);
  const [cities, setCities] = useState<Array<{label: string, value: string, checked: boolean}>>([]);

  const { user } = useUserContext();

  const onChange = (value: any) => {
    setNumbers(value as Array<{ label: string, value: string, checked: boolean }>)
  };

  const onCityChange = (e: any) => {};

  useEffect(() => {
    setCities([
      {label: 'Ghana', value: 'ghana', checked: false, },
      {label: 'Nigeria', value: 'nigeria', checked: true,},
      {label: 'Comoros', value: 'comoros', checked: true,},
      {label: 'New Guinea', value: 'new_guinea', checked: false,}
    ]);

    setNumbers([
      {label: 'Hong Kong', value: 'hong_kong', checked: false, },
      {label: 'Stockholm', value: 'stockholm', checked: true, },
      {label: 'São Paulo', value: 'são_paulo', checked: true, },
      {label: 'Saint Petersburg', value: 'saint_petersburg', checked: false, }
    ]);
  }, []);

  return (
    <Fragment>

    {/* Top Content */}
    <TopContent user={user} showAlert />

    {/* Aside  */}
    <Aside user={user}>
      <header className={styles.root__header}>
        <h4 className={styles.root__header__title}>Patterns page</h4>
        <p>This part is still under development. (Patterns/Aside.tsx) &nbsp; ¯\_(ツ)_/¯</p>
      </header>
    </Aside>

    {/* Main Content */}
    <section className={styles.root} data-main-content>

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

      <CheckboxGroup
        value={numbers.map((n) => n.label)}
        name={`${numbers[0]?.value}-${numbers[0]?.label.toLowerCase()}`}
        onChange={onChange}
        data-block
      >
        {numbers.map((number) => (
          <CustomCheckbox
            key={number.label}
            name={number.value}
            onChange={() => {}}
          >
            {number.label}
          </CustomCheckbox>
        ))}
      </CheckboxGroup>
      <br/>
      <hr/>

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

      <article>
        <Drawer isOpen={openDrawer} onClose={() => setOpenDrawer((prev) => !prev)}/>
        <Button onClick={() => setOpenDrawer((prev) => !prev)}>Open Drawer</Button>
      </article>

      <hr />

      <article>
        <Modal
          isOpen={openModal}
          onOpen={() => setOpenModal(true)}
          onClose={() => setOpenModal(false)}
          data-variation="dialog"
        >

        <article>
          <h4>Heading 4</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
          </p>
        </article>

          <ButtonSet className={styles.root__footer}>
            <Button variation="secondary-trans" onClick={() => setOpenModal(false)} size="medium">Close</Button>
            <Button type="button" onClick={() => {}} size="medium">Do nothing</Button>
          </ButtonSet>
        </Modal>

        <Button onClick={() => setOpenModal(true)}>Open Dialog</Button>
      </article>

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
      <br/>

      </section>
    </Fragment>

  );

};

export default memo(Patterns);
