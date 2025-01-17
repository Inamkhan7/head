import * as React from "react"
const SendComponent = (props:any) => (
  // <svg
  //   aria-hidden="true"
  //   className="mud-icon-root mud-svg-icon mud-icon-size-large"
  //   viewBox="0 0 24 24"
  //   {...props}
  // >
  //   <path fill="yellow" d="M0 0h24v24H0z" />
  //   <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
  // </svg>
  <svg className="w-10" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M0 0h24v24H0z" fill="none"></path><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#facc15"></path></svg>
)
export default SendComponent