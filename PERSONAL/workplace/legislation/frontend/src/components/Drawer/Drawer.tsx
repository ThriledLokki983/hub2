import { useState, useEffect } from 'react';
import { DrawerProps } from './Drawer.interface';

import { Modal } from 'components';
import styles from './Drawer.module.scss';

const DRAWER_MODAL_ID = 'sln-onboarding-modal-drawer';


const Drawer = ({ isOpen, onClose, onOpen }: DrawerProps) => {
  const [openDrawer, setOpenDrawer] = useState(isOpen);

  // Synchronize local state with prop
  useEffect(() => {
    setOpenDrawer(openDrawer);
  }, [openDrawer]);

	return (
		<Modal
      id={DRAWER_MODAL_ID}
      isOpen={isOpen}
      onOpen={() => setOpenDrawer(true)}
      onClose={() => setOpenDrawer(false)}
      data-variation="drawer"
    >
      Drawer works
		</Modal>
	);
}

export default Drawer;
