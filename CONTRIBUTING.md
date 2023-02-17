[back to README.md](README.md)


# Contributing

## Overview
This is a micro-package designed to be light-weight and make 1 job as simply as possible.  That job
should only be to

1. Shadow DOM initialization with simple HTML/CSS definition
2. Intuitive causation model to keep attributes and properties in sync
3. Element reference hooks
4. Slot tracking and mutation callback


### Planned Features

- Set corresponding prop on `attributeChangedCallback` without forcing the `super()` call


### Causation Model

[![](https://mermaid.ink/img/pako:eNplkU9rhDAQxb_KkFMLa0GPHgqLCl5KD9aT8TCrs6s0RomxZcn63TvR_oHu7TG_N5k3EyeasSURi4vBqYO3VGqp86obZwukaCBta6mLau6wHT8hfX2pvSMJH6pG4TzDZMaJjL3CTLZ-ZBLdkctOcu4xhOquJY_-g-8OqTPnsg_OsK5Sl86VU4uWfApfODqH1pr-tFhKOtQXahNU6oTNu8f8MATBMxzZuYk89CE2WXpcbjKJfOjdEP2VC94agqcAMk6xG0O_t5c3Dg6_o2-Q_4BthDiIgcyAfctndVIDSGE7PqUUMcuWzrgoK4XUK1txsWNx1Y2IrVnoIJZtxbRH_pBBxGdUM61fy9-NzA?type=png)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNplkU9rhDAQxb_KkFMLa0GPHgqLCl5KD9aT8TCrs6s0RomxZcn63TvR_oHu7TG_N5k3EyeasSURi4vBqYO3VGqp86obZwukaCBta6mLau6wHT8hfX2pvSMJH6pG4TzDZMaJjL3CTLZ-ZBLdkctOcu4xhOquJY_-g-8OqTPnsg_OsK5Sl86VU4uWfApfODqH1pr-tFhKOtQXahNU6oTNu8f8MATBMxzZuYk89CE2WXpcbjKJfOjdEP2VC94agqcAMk6xG0O_t5c3Dg6_o2-Q_4BthDiIgcyAfctndVIDSGE7PqUUMcuWzrgoK4XUK1txsWNx1Y2IrVnoIJZtxbRH_pBBxGdUM61fy9-NzA)


## Development

### Building
No build required.  Vanilla JS only.

### Compress code

```bash
MODE=production npx webpack
```
