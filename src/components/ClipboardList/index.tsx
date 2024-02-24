import React, { FC, memo } from 'react';
import { Grid, List } from '@arco-design/web-react';
import { ClipboardHistory } from '@electron/clipboard';
import classNames from 'classnames';
import ClipboardCard from '@/components/ClipboardCard';
import styles from './index.module.less';

interface ClipboardCardProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  list: ClipboardHistory[]
}
const Row = Grid.Row;
const Col = Grid.Col;

const ClipboardList:FC<ClipboardCardProps> = (
  {
    list,
    className,
    ...restProps
  }
) => {

  const classes = classNames(
    styles.ClipboardList,
    className
  )

  return (
    <div className={classes} { ...restProps }>
      <List
        grid={{
          xs: 24,
          sm: 12,
          md: 8,
          lg: 6,
          xl: 4,
          xxl: 3,
          gutter: [15,15],
        }}
        dataSource={list}
        bordered={false}
        render={(clipboard) => (
          <ClipboardCard history={clipboard} />
        )}
      />
    </div>
  )
}

export default memo(ClipboardList);