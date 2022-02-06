import { useState } from 'react';
import { InputNumber } from 'antd';

function Support(props) {
  const {
    ctx,
    image,
    processFn,
    handleProcessComplete,
  } = props;

  const [customValue, setCustomValue] = useState({
    r: 0.299,
    g: 0.587,
    b: 0.114,
  });

  function handleChange(value, key) {
    setCustomValue(prev => {
      const newCustomValue = {
        ...prev,
        [key]: parseFloat(value),
      }
      setTimeout(() => {
        processFn(ctx, image, newCustomValue);
        handleProcessComplete();
      }, 0);
      return newCustomValue;
    });
  }

  function CustomNumberInput(props) {
    const {
      value,
      onChange,
    } = props;
    return (
      <InputNumber 
        style={{ width: 80, margin: '0 4px' }}
        value={value}
        min="0"
        max="1"
        step="0.001"
        onChange={onChange}
        stringMode
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      Gray = R * <CustomNumberInput value={customValue.r.toString()} onChange={value => handleChange(value, 'r')} /> + 
      G * <CustomNumberInput value={customValue.g.toString()} onChange={value => handleChange(value, 'g')} /> + 
      B * <CustomNumberInput value={customValue.b.toString()} onChange={value => handleChange(value, 'b')} />
    </div>
  );
}

export default Support;
