import { useEffect, useState } from 'react';

export default () => {
  const [host, setHost] = useState<string | undefined>();
  useEffect(() => {
    if(host) return;
    ipc.FILE_SERVER_HOST().then(res => setHost(res));
  }, [host]);
  return host;
}