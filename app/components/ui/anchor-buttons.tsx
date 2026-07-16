import { AnchorHTMLAttributes } from "react";

export function PrimaryAnchorBtn(props: AnchorProps) {
  return (
    <a
      {...props}
      className={`flex items-center h-14 px-8 bg-brand text-foreground border border-border rounded-full font-semibold transition-all hover:bg-brand-light ${props.className}`}
    />
  );
}

export function SecondaryAnchorBtn(props: AnchorProps) {
  return (
    <a
      {...props}
      className={`flex items-center h-14 px-8 bg-foreground border border-border rounded-full font-semibold transition-all hover:border-brand hover:text-brand ${props.className}`}
    />
  );
}

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}
