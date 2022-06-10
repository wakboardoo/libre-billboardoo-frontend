import { useState } from "react";

const useForceUpdate = (): () => void => {
  const [, setState] = useState({});

  return () => setState({});
};

export default useForceUpdate;
