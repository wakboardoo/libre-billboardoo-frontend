import { classNames } from '@utils/classNames'
import React from 'react'

interface Props {
  title: string
  buttons: React.ReactNode[]
}

const SmallHeader = ({ title, buttons }: Props, ref: React.ForwardedRef<HTMLElement>) => {
  return (
    <header
      ref={ref}
      className={classNames(
        'hidden sticky top-0 z-50 justify-between items-center px-14 py-4',
        'bg-black/20 backdrop-blur-md'
      )}
    >
      <h1 className='text-gray-50 text-2xl font-bold'>{title}</h1>
      <div className='flex gap-3'>{buttons}</div>
    </header>
  )
}

const forwardRefSmallHeader = React.forwardRef(SmallHeader)

export default forwardRefSmallHeader
