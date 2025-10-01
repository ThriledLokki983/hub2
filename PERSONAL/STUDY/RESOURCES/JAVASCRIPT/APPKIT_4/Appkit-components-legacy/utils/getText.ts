function getText(rootChild: any) {
    let res = ''
    const rr = (child: any) => {
      if (typeof child === 'string' || typeof child === 'number') {
        res += child
      } else if (Array.isArray(child)) {
        child.forEach(c => rr(c))
      } else if(child && child.props) {
        const {children} = child.props
  
        if (Array.isArray(children)) {
          children.forEach(c => rr(c) )
        } else {
          rr(children)
        }
      }
    }
  
    rr(rootChild)
  
    return res
  }
  
export default getText;
  