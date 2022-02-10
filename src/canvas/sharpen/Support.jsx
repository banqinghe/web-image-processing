import { Slider } from 'antd';

function Support(props) {
  const {
    ctx,
    image,
    processFn,
    handleProcessComplete,
  } = props;

  function handleChange(value) {
    setTimeout(() => {
      processFn(ctx, image, value);
      handleProcessComplete();
    }, 0);
  }

  return (
    <Slider
      tooltipVisible={false}
      style={{width: '70%'}}
      defaultValue={1}
      min={1}
      max={80}
      onChange={handleChange}
    />
  );
}

export default Support;
