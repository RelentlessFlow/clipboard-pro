import { useEffect, useRef, useState } from 'react';

export default (appPath: string) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const loading= useRef<boolean>(false);
  useEffect(() => {
    if(loading.current) return;
	  loading.current = true;
    ipc.APP_ICON_PATH(appPath).then(res => {
	    setImage(res);
	    loading.current = false;
    })
  }, [appPath]);
  return {
    image,
	  loading
  }
}