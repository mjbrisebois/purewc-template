[![](https://img.shields.io/npm/v/@purewc/template/latest?style=flat-square)](http://npmjs.com/package/@purewc/template)

# `HTMLElementTemplate`
An ultra-light (1.3kb) base class for writing vanilla Web Components

[![](https://img.shields.io/github/issues-raw/mjbrisebois/purewc-template?style=flat-square)](https://github.com/mjbrisebois/purewc-template/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/purewc-template?style=flat-square)](https://github.com/mjbrisebois/purewc-template/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/purewc-template?style=flat-square)](https://github.com/mjbrisebois/purewc-template/pulls)


## Overview


## Usage

Install

```bash
npm i @purewc/template
```

Import and extend from template

```js
import HTMLElementTemplate from '@purewc/template';

class HTMLSomeCustomElement extends HTMLElementTemplate {
    static CSS = `
:host {
  min-height: 100px;
}

#container {
  background-color: #eee;
}
`;
    static template = `
<div id="container">
</div>
`;

    static observedAttributes = [
        ...
    ];

    static properties = {
        "title": {
            "default": "Hello world",
            updated () {
                // Code to run whenever value has changed
                this.$container.innerHTML = this.title;
            },
        },
    };

    static refs = {
        "$container": `#container`,
    };

    constructor () {
        super();
    }
}
```


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
