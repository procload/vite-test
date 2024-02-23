import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { Stepper, Step, StepDefinition, StepperDefinition } from '@horizon-msft/web-components';
import { DesignToken, setTheme, fabricLightTheme } from '@horizon-msft/theme';
import { HelloWorld, HelloWorldDefinition } from '@horizon-msft/web-components'

setTheme(fabricLightTheme);

DesignToken.registerDefaultStyleTarget();

HelloWorldDefinition.define(customElements)
StepperDefinition.define(customElements)
StepDefinition.define(customElements)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
