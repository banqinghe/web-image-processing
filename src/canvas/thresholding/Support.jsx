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
    <Slider style={{width: '70%'}} defaultValue={50} onChange={handleChange}/>
  );
}

export default Support;
