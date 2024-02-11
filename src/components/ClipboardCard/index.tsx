import React, { FC, memo, ReactNode } from 'react';
import { Card } from '@arco-design/web-react';

interface ClipboardCardProps {
  children: ReactNode
}

const ClipboardCard:FC<ClipboardCardProps> = (
  {
    children
  }
) => {
  return (
    <Card hoverable>
	    { children }
    </Card>
  )
}

export default memo(ClipboardCard);