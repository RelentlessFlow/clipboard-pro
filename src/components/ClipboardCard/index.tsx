import React, { FC, memo, ReactNode, useMemo } from 'react';
import { Card, Image, Message, Skeleton } from '@arco-design/web-react';
import { type ClipboardHistory, type ContentType } from '@electron/clipboard';
import { useAppIcon, useImageColor } from '@/hooks';
import styles from './index.module.less';
import Content from '@/components/ClipboardCard/content';

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
  const { mainColor, textColor, contrastColor } = useImageColor(image);

  const loading = useMemo(() => {
    return !(image && mainColor);
  }, [image, mainColor])

  const handleClick = () => {
    Message.success('已复制到剪切板')
  }

  return (
	    <Card
		    hoverable
		    className={styles.ClipboardCard}
		    onClick={handleClick}
	    >
		    <Skeleton
			    loading={loading}
			    animation={true}
			    text={{ rows: 5, }}
			    className={styles.Skeleton}
		    >
		      <div className={styles.Header} style={{ color: textColor, background: mainColor }}>
		        <div className={styles.HeaderType}>{ typeMapper[history.type[0]] }</div>
		        <div className={styles.HeaderTime}>{ (history.copyTime as Date).toString() }</div>
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
		    </Skeleton>
	    </Card>
  );
};

export default memo(ClipboardCard);