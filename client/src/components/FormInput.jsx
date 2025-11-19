import React from 'react';

/**
 * Reusable labeled input with error message support.
 */
const FormInput = ({ label, name, type = 'text', value, onChange, error, ...rest }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} {...rest} />
    {error && <p className="error-text">{error}</p>}
  </div>
);

export default FormInput;
