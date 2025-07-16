import Button from "./Button";
import React from "react";

// interface ResetButtonProps {
//   onClick?: () => void;
//   className?: string;
//   disabled?: boolean;
// }

export const ResetButton = ({
  ...props
}) => {
    
  return (
    <Button className="w-full" variant="primary" {...props}>Reset</Button>
    // <Button className="w-full" variant="primary">Reset</Button>
  );
};
