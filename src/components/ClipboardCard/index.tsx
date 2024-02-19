import React, { FC, memo, ReactNode } from 'react';
import { Card, Image, Message, Skeleton } from '@arco-design/web-react';
import { type ClipboardHistory, type ContentType } from '@electron/clipboard';
import { useAppIcon } from '@/hooks';
import styles from './index.module.less';
import Content from '@/components/ClipboardCard/Content';

interface ClipboardCardProps {
  history: ClipboardHistory
}
const imageSize = { width: 70, height: 150 };

// 辅助函数，类型到文本转换
const typeMapper: Record<ContentType, string> = {
  RTF: '文本',
  HTML: '文本',
  BASE64: '图片',
  BUFFERS: '文件'
}

const ClipboardCard: FC<ClipboardCardProps> = (
  {
	  history
  }
) => {
  const { owner } = history
  const { image } = useAppIcon(owner.path);

  const handleClick = () => {
    Message.success('已复制到剪切板')
  }

  return (
    <Card
	    hoverable
	    className={styles.ClipboardCard}
	    onClick={handleClick}
    >
      <div className={styles.Header}>
        <div className={styles.HeaderType}>{ typeMapper[history.type[0]] }</div>
        <div className={styles.HeaderTime}>just now</div>
	      <Image
		      preview={false}
		      className={styles.HeaderImage}
		      height={70}
		      width={70}
		      simple={true}
		      src={image}
		      lazyload={{ threshold: 0.5 }}
		      loader={<Skeleton image={{ style: imageSize }} text={false} animation />}
	      />
      </div>
	    <div className={styles.Content}>
		    <Content history={history} />
	    </div>
    </Card>
  );
};

export default memo(ClipboardCard);