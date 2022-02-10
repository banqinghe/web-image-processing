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
      defaultValue={10}
      min={1}
      max={40}
      onChange={handleChange}
    />
  );
}

export default Support;
