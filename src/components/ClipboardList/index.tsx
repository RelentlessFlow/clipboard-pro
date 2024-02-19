import React, { FC, memo } from 'react';
import { Grid } from '@arco-design/web-react';
import { ClipboardHistory } from '@electron/clipboard';
import ClipboardCard from '@/components/ClipboardCard';
import styles from './index.module.less';

interface ClipboardCardProps {
  list: ClipboardHistory[]
}
const Row = Grid.Row;
const Col = Grid.Col;

const ClipboardList:FC<ClipboardCardProps> = (
  {
    list
  }
) => {

  return (
    <div className={styles.ClipboardList}>
      <Row gutter={[15, 15]}>
        {
          list.map((clipboard, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3} span={4} key={clipboard.summary + index}>
              <ClipboardCard history={clipboard} />
            </Col>
          ))
        }
      </Row>
    </div>
  )
}

export default memo(ClipboardList);