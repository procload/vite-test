import { html } from "@microsoft/fast-element";
// <pre><code>${(x) => JSON.stringify(x)}</code></pre>
export const template = html `
  <template ?disabled="${(x) => x.disabled}" size="${(x) => x.size}">
    <h2>Hello world</h2>
    <div>
      <li>Disabled: ${(x) => x.disabled}</li>
      <li>Size: ${(x) => x.size}</li>
    </div>
    <div>
      <slot></slot>
    </div>
  </template>
`;
//# sourceMappingURL=hello-world.template.js.map