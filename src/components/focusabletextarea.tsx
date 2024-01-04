import { Textarea, TextareaProps } from '@tarojs/components'
import { useState } from 'react'

type FocusableTextAreaProps = TextareaProps & {
  focusClass?: string
  blurClass?: string
  baseClass?: string
  placeholderShownClass?: string
}
function FocusableTextArea(props: FocusableTextAreaProps) {
  const [focus, setFocus] = useState(false)
  const { value, baseClass = '', focusClass, blurClass, placeholderShownClass = '' } = props
  const newClassName =
    baseClass + ' ' + (focus ? focusClass : blurClass) + ' ' + (value || focus ? '' : placeholderShownClass)
  return (
    <Textarea
      {...props}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      className={newClassName}
      controlled
    />
  )
}

export { FocusableTextArea, FocusableTextAreaProps }
