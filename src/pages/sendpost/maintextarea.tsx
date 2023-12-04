import { FocusableTextArea, FocusableTextAreaProps } from '../../components/focusabletextarea'

type Props = FocusableTextAreaProps & {
  label?: string
}

export default function TextAreaCustom(props: Props) {
  return (
    <div className='relative h-full w-auto my-4'>
      <FocusableTextArea
        {...props}
        baseClass='peer block px-1 py-2 mb-2 text-base h-full w-auto rounded-xl'
        focusClass='focused'
        placeholderShownClass='placed'
        maxlength={500}
      ></FocusableTextArea>
      <label
        className='absolute top-3 w-auto origin-[0] -translate-y-6 transform px-1 text-sm text-gray-500 duration-150
          peer-[.focused]:-translate-y-6 peer-[.placed]:translate-y-0 
          peer-[.focused]:font-medium peer-[.focused]:text-brand'
      >
        {props.label}
      </label>
    </div>
  )
}
