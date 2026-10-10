/**
 * Splits text content of the given element into individual <span> characters.
 * Returns an array of the created span elements for GSAP animation.
 */
export function splitIntoSpans(
  element: HTMLElement,
  className?: string
): HTMLSpanElement[] {
  const text = element.textContent || '';
  element.innerHTML = '';
  const spans: HTMLSpanElement[] = [];

  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    span.textContent = char === ' ' ? '\u00A0' : char;
    if (className) span.className = className;
    element.appendChild(span);
    spans.push(span);
  });

  return spans;
}
