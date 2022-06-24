import { Slider } from 'antd';
import { SupportComponentProps } from '../types';

function Support(props: SupportComponentProps) {
  const { ctx, image, processFn, onProcessComplete } = props;

  const handleChange = (value: number) => {
    setTimeout(() => {
      processFn(ctx, image, value);
      onProcessComplete();
    }, 0);
  };

  return (
    <Slider
      style={{ width: '70%' }}
      defaultValue={50}
      onChange={handleChange}
    />
  );
}

export default Support;
