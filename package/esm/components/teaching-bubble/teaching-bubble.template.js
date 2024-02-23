import { html } from "@microsoft/fast-element";
export function teachingBubbleTemplate() {
    return html `
    <template
      size="${(x) => x.size}"
      target="${(x) => x.target}"
      ?hidden="${(x) => !x.open}"
      placement="${(x) => x.placement}"
      role="dialog"
      ?disable-trap-focus="${(x) => x.disableTrapFocus}"
    >
      <div class="image" part="image">
        <slot name="image"></slot>
      </div>
      <div class="content" part="content">
        <div class="close" part="close"><slot name="close"></slot></div>
        <div class="heading" part="heading">
          <slot name="heading"></slot>
        </div>
        <slot></slot>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
      <div id="arrow" class="arrow" part="arrow"></div>
    </template>
  `;
}
export const template = teachingBubbleTemplate();
//# sourceMappingURL=teaching-bubble.template.js.map