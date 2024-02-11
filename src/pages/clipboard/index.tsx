import React, { FC } from 'react';
import { PageHeader, Radio } from '@arco-design/web-react';
import ClipboardCard from '../../components/ClipboardCard';
import './index.less';

const index:FC = () => {
  return (
    <div>
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
					    <Radio value='file'>收藏</Radio>
				    </Radio.Group>
			    </div>
		    }
	    />
	    <ClipboardCard>
		    Hello
	    </ClipboardCard>
    </div>
  )
}

export default index;