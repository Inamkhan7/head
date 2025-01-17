import * as React from "react"
const SparkComponent = (props:any) => (
  <svg
    aria-hidden="true"
    // className="mud-icon-root mud-svg-icon mud-icon-size-medium icon-huge align-self-center"
    style={{
      fill: "#ffc906",
    }}
    viewBox="0 0 24 24"
    height={25}
    width={25}
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
  </svg>
)
export default SparkComponent