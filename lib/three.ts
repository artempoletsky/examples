const listeners: Map<HTMLElement, Record<string, Function>> = new Map();

export function onDrag(el: HTMLElement, fn: (e: { dx: number; dy: number }) => void) {
  let lastX: number = 0;
  let lastY: number = 0;
  const onMove = (e: MouseEvent) => {
    e.preventDefault();
    // console.log(e);
    fn({
      dx: lastX - e.screenX,
      dy: lastY - e.screenY,
    });
    lastX = e.screenX;
    lastY = e.screenY;
  }
  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    lastX = e.screenX;
    lastY = e.screenY;
    el.addEventListener("mousemove", onMove)
  }
  const onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    el.removeEventListener("mousemove", onMove)
  }
  listeners.set(el, {
    mousedown: onMouseDown,
    mouseup: onMouseUp,
  });
  el.addEventListener("mousedown", onMouseDown);
  el.addEventListener("mouseup", onMouseUp);
}

export function offDrag(el: HTMLElement) {
  const lisrs = listeners.get(el);
  if (!lisrs) return;
  for (const key in lisrs) {
    el.removeEventListener(key as any, lisrs[key] as any);
  }
}
