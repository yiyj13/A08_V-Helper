import { Input, InputProps } from '@tarojs/components'
import { useState } from 'react'

// [FocusableInput]:
//   Extends [Input]
//   wxml does not support 'focus' and 'placeholder-shown' selector, so we need state to change the className
//
// Example:
//   <FocusableInput baseClass='h-12 w-auto px-4 rounded-xl' focusClass='ring-2 ring-slate-300' placeholder='Title' />

type FocusableInputProps = InputProps & {
  baseClass?: string
  focusClass?: string
  blurClass?: string
  placeholderShownClass?: string
}

function FocusableInput(props: FocusableInputProps) {
  const [focus, setFocus] = useState(false)
  const { value, baseClass = '', focusClass, blurClass, placeholderShownClass = '' } = props
  const newClassName =
    baseClass + ' ' + (focus ? focusClass : blurClass) + ' ' + (value || focus ? '' : placeholderShownClass)
  return (
    <Input
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      className={newClassName}
      controlled
      {...props}
    />
  )
}

export { FocusableInput, FocusableInputProps }
