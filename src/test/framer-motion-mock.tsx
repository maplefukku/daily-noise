import React from "react";

function createMotionComponent(tag: string) {
  return React.forwardRef(function MotionComponent(
    { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
    ref: React.Ref<HTMLElement>
  ) {
    const {
      initial, animate, exit, transition, variants,
      whileTap, whileHover, whileFocus, whileInView,
      ...rest
    } = props;
    return React.createElement(tag, { ...rest, ref }, children);
  });
}

export const motion = new Proxy({} as Record<string, ReturnType<typeof createMotionComponent>>, {
  get: (_target, prop: string) => createMotionComponent(prop),
});

export function AnimatePresence({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
