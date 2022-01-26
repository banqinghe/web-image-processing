import { useState, useEffect } from 'react';

import './index.css';

function HeaderPopover(props) {
  const {
    children
  } = props;

  const [visible, setVisible] = useState(false);

  // function handleClickOtherSpace() {
    
  // }

  // useEffect(() => {
  //   window.addEventListener('click', )
  // }, [visible])

  return (
    <div className="header-menu">
      <ul></ul>
    </div>
  )
}

export default HeaderPopover;
