import { useState } from 'react';
import { InputNumber } from 'antd';
import { SupportComponentProps } from '../types';

type RGBValue = {
  r: number;
  g: number;
  b: number;
};

function CustomNumberInput(props: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { value, onChange } = props;
  return (
    <InputNumber
      style={{ width: 80, margin: '0 4px' }}
      value={value}
      min={0}
      max={1}
      step="0.001"
      onChange={onChange}
      stringMode
    />
  );
}

function Support(props: SupportComponentProps) {
  const { ctx, image, processFn, onProcessComplete } = props;

  const [customValue, setCustomValue] = useState<RGBValue>({
    r: 0.299,
    g: 0.587,
    b: 0.114,
  });

  const handleChange = (value: number, key: keyof RGBValue) => {
    setCustomValue(prev => {
      const newCustomValue = {
        ...prev,
        [key]: value,
      };
      setTimeout(() => {
        processFn(ctx, image, newCustomValue);
        onProcessComplete();
      }, 0);
      return newCustomValue;
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      Gray = R *{' '}
      <CustomNumberInput
        value={customValue.r}
        onChange={value => handleChange(value, 'r')}
      />{' '}
      + G *{' '}
      <CustomNumberInput
        value={customValue.g}
        onChange={value => handleChange(value, 'g')}
      />{' '}
      + B *{' '}
      <CustomNumberInput
        value={customValue.b}
        onChange={value => handleChange(value, 'b')}
      />
    </div>
  );
}

export default Support;
