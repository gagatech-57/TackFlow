import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';

const CustomDatePicker = ({
  id,
  name,
  value,
  onChange,
  placeholder = 'Select date...',
  className = '',
  style = {},
  disabled = false,
  required = false,
  min,
  max
}) => {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    if (disabled || !inputRef.current) return;
    if (typeof inputRef.current.showPicker === 'function') {
      try {
        inputRef.current.showPicker();
      } catch (e) {
        inputRef.current.focus();
      }
    } else {
      inputRef.current.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`custom-datepicker-container ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="date"
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className="form-input custom-date-input"
        style={{
          width: '100%',
          paddingRight: '2.5rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: '#ffffff',
          colorScheme: 'light'
        }}
      />
      <Calendar
        size={16}
        style={{
          position: 'absolute',
          right: '0.875rem',
          color: 'var(--primary)',
          pointerEvents: 'none',
          opacity: disabled ? 0.4 : 0.85
        }}
      />
    </div>
  );
};

export default CustomDatePicker;
