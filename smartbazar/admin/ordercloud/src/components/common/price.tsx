import usePrice from "@utils/use-price";
import React from "react";

const Price = React.memo(
  ({
    amount,
    className,
    component: Component = "div",
  }: {
    amount: number[];
    className?: string;
    component?: "div" | "span";
    title?: string;
  }) => {
    if (amount.length > 1) {
      const { price: min } = usePrice({ amount: amount[0] });
      const { price: max } = usePrice({ amount: amount[1] });
      return <Component className={className}>{`${min}-${max}`}</Component>;
    }

    const { price } = usePrice({ amount: amount[0] });
    return <Component className={className}>{price}</Component>;
  }
);

Price.displayName = "Price";

export default Price;
