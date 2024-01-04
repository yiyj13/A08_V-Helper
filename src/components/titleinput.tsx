import { FocusableInput, FocusableInputProps } from './focusableinput'

type Props = FocusableInputProps & {
  label?: string
}

export default function InputCustom(props: Props) {
  return (
    <div className='relative mt-4'>
      <FocusableInput
        {...props}
        baseClass='peer block h-auto w-auto appearance-none rounded-xl bg-transparent mx-1 py-2.5 text-xl font-bold text-gray-600'
        focusClass='focused'
        placeholderShownClass='placed'
      />
      <label
        className='absolute top-3 w-auto origin-[0] -translate-y-6 transform px-1 text-xs text-gray-500 duration-150
          peer-[.focused]:-translate-y-6 peer-[.placed]:translate-y-0 
          peer-[.focused]:font-medium peer-[.focused]:text-brand'
      >
        {props.label}
      </label>
      <div className='relative -top-1 mx-1 w-auto border-b-2 border-b-brand/0 peer-[.focused]:border-b-brand duration-150'></div>
    </div>
  )
}
