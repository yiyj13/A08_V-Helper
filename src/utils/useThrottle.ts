import React,{ useState } from 'react'

export default function useThrottle(time: number = 2000) {
  const [actionDisabled, setActionDisabled] = useState(false)

  const throttle = (action: any) => () => {
    setActionDisabled(true)
    action()
    setTimeout(() => {
      setActionDisabled(false)
    }, time)
  }

  return { actionDisabled, throttle }
}

export const ThrottleWrap = (props: any) => {
  const { actionDisabled, throttle } = useThrottle()

  const children = React.cloneElement(props.children, {
    onClick: throttle(props.children.props.onClick),
    disabled: actionDisabled,
  })

  return children
}
