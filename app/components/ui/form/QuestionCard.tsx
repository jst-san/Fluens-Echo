import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export default function QuestionCard(props: QuestionCardProps) {
  return (
    <div
      {...props}
      className={`relative bg-foreground border border-border rounded-4xl p-8 transition-all focus-within:shadow-lg group ${props.className}`}
      tabIndex={1}
    
    />
  );
}

export interface QuestionCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
