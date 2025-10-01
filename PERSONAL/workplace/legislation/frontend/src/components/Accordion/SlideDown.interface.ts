export interface SlideDownProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  closed?: boolean
  transitionOnAppear?: boolean
}

export interface SlideDownContentProps extends SlideDownProps {
  forwardedRef: React.Ref<HTMLDivElement> | null
}

export interface SlideDownContentState {
  children?: React.ReactNode
  childrenLeaving: boolean
}
