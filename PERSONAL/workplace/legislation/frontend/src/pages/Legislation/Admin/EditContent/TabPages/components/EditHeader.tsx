import React from 'react'

import { EditHeaderProps } from '../interfaces'
import styles from './EditHeader.module.scss'

const EditHeader = ({ title = '', content = '' }: EditHeaderProps) => {
  return (
    <header className={styles.root}>
      <h6 className={styles.root__title}>{title}</h6>
      <p className={styles.root__description}>{content}</p>
    </header>
  )
}

export default EditHeader
