import React, { DetailedHTMLProps, LabelHTMLAttributes } from "react";

export default function OptionLabel(
  props: LabelProps,
  
) {
  return (
    <label
      {...props}
      className={`flex items-center gap-4 p-5 rounded-3xl border border-border transition-all cursor-pointer group ${props.className}`}
    />
  );
}

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>
