/**
 * Determines if the passed element is overflowing its bounds,
 * either vertically or horizontally.
 * Will temporarily modify the "overflow" style to detect this
 * if necessary.
 */
export function checkOverflow(el, width?, height?) {
  const curOverflow = el.style.overflow;

  if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

  const isOverflowing =
    (width && el.clientWidth < el.scrollWidth) ||
    (height && el.clientHeight < el.scrollHeight);

  el.style.overflow = curOverflow;

  return isOverflowing;
}
