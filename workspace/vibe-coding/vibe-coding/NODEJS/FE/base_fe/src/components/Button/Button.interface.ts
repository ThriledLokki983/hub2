import React from "react";


export interface BasicButtonProps {
  type?: "button" | "submit" | "reset";
  variation?: "primary" | "secondary" | "tertiary" | "quaternary";
  size?: "small" | "regular" | "medium" | "large";
  disabled?: boolean;
  url?: string;
  onClickButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickAnchor?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface ButtonProps extends BasicButtonProps {
  [key: string]: any;
}
