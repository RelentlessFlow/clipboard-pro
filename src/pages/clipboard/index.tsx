import React, { FC } from 'react';
import { PageHeader, Radio } from '@arco-design/web-react';
import { useClipboardStore } from '@/store/clipboard';
import ClipboardList from '@/components/ClipboardList';
import styles from './index.module.less';

const index:FC = () => {

  const { list: clipboards } = useClipboardStore();
  return (
    <div className={styles.Page}>
	    <PageHeader
		    title='Clipboard Pro'
		    subTitle='跨平台剪切板'
		    extra={
			    <div style={{ marginTop: '10px' }}>
				    <Radio.Group type='button' defaultValue='all'>
					    <Radio value='all'>全部</Radio>
					    <Radio value='text'>文本</Radio>
					    <Radio value='pic'>图片</Radio>
					    <Radio value='file'>文件</Radio>
					    <Radio value='favor'>收藏</Radio>
				    </Radio.Group>
			    </div>
		    }
	    />
	    <ClipboardList list={clipboards} />
    </div>
  )
}

export default index;