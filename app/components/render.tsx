import React from "react";

export const Render = ({
  when,
  children,
}: {
  when: boolean;
  children: React.ReactNode;
}) => {
  return when ? <>{children}</> : null;
};
