import React, { FC } from 'react';
import type { ClipboardHistory } from '@electron/clipboard';
import useFileServerHost from '@/hooks/useFileServerHost';
import { Image, Skeleton } from '@arco-design/web-react';
import styles from './content.module.less'

interface ContentProps {
  history: ClipboardHistory
}
const imageSize = { width: 70, height: 70 };

const Content: FC<ContentProps> = (
  {
    history
  }
) => {

  // const host = useFileServerHost();
  //
  // const renderHistory = () => {
  //   if(!host) return <></>;
  //   const isBase64 = history.type.includes("BASE64");
  //
  //   if(isBase64) {
  //     return history.contents.map(({ buffers }) => buffers?.map(buffer => {
  //       const imgUrl = host + '/' + buffer.path
  //       return <Image key={imgUrl}
  //         preview={false}
  //         className={styles.HeaderImage}
  //         src={imgUrl}
  //         lazyload={{ threshold: 0.5 }}
  //         loader={<Skeleton image={{ style: imageSize }} text={false} animation />}
  //       />
  //     }))
  //   }
  //   return <></>
  // }

  return (
    <>
      {/*{ renderHistory() }*/}
    </>
  )
}

export default Content;