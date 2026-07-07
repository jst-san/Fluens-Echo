import { ButtonHTMLAttributes } from "react";

export function PrimaryBtn(props: ButtonProps) {
  return (
    <button
      {...props}
      className={`h-14 px-8 bg-brand text-foreground border border-border rounded-full font-semibold transition-all hover:bg-brand-light ${props.className}`}
    />
  );
}

export function SecondaryBtn(props: ButtonProps) {
  return (
    <button
      {...props}
      className={`h-14 px-8 bg-foreground border border-border rounded-full font-semibold transition-all hover:border-brand hover:text-brand ${props.className}`}
    />
  );
}

export function ToggleBtn(
  props: Omit<ButtonProps, "active"> & { active?: boolean },
) {
  return (
    <button
      {...{ ...props, active: String(props.active) }}
      className={`${props.active ? "bg-brand" : "bg-muted"} relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300 focus:outline-none ${props.className}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-foreground shadow-sm transition-transform ${
          props.active ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
