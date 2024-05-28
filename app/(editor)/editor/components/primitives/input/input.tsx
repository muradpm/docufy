import clsx from "clsx";
import { forwardRef } from "react";
import type { ComponentProps } from "react";
import styles from "./input.module.css";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input ref={ref} className={clsx(className, styles.input)} {...props} />
    );
  }
);

Input.displayName = "Input";
