import { useState, useRef, useEffect } from 'react';
import { Icon } from 'components';
import { CustomSelectOption, CustomSelectProps } from './CustomSelect.interface';
import styles from './CustomSelect.module.scss';

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  label,
  name,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<CustomSelectOption | null>(
    options.find((opt: CustomSelectOption) => opt.value === value) || null,
  );
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: CustomSelectOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    setIsOpen(false);
    setFocusedIndex(-1);
    onChange?.(option.value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(0);
      } else {
        setFocusedIndex(-1);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(options[focusedIndex]);
        } else {
          toggleDropdown();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => {
            const next = prev + 1;
            return next >= options.length ? 0 : next;
          });
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex(prev => {
            const next = prev - 1;
            return next < 0 ? options.length - 1 : next;
          });
        }
        break;

      case 'Home':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(0);
        }
        break;

      case 'End':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(options.length - 1);
        }
        break;

      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;

      default:
        if (isOpen && /^[a-z0-9]$/i.test(event.key)) {
          const index = options.findIndex(
            (opt, i) =>
              i > focusedIndex && opt.label.toLowerCase().startsWith(event.key.toLowerCase()),
          );
          if (index !== -1) {
            setFocusedIndex(index);
          }
        }
        break;
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedOption = dropdownRef.current.children[focusedIndex] as HTMLElement;
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div
      className={styles.selectContainer}
      ref={selectRef}
      data-error={!!error}
      data-disabled={disabled}
    >
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={styles.select}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="select-dropdown"
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={styles.value}>{selectedOption ? selectedOption.label : placeholder}</span>
        <Icon name="chevron-down" className={styles.icon} data-open={isOpen} />
      </div>

      {isOpen && (
        <ul
          className={styles.dropdown}
          role="listbox"
          id="select-dropdown"
          ref={dropdownRef}
          aria-label={label}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={styles.option}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
              data-focused={index === focusedIndex}
              data-disabled={option.disabled}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && <span className={styles.error}>{error}</span>}

      <select
        name={name}
        value={selectedOption?.value || ''}
        onChange={() => {}}
        required={required}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className={styles.nativeSelect}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
