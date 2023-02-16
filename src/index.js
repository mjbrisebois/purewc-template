
export class HTMLElementTemplate extends HTMLElement {
    constructor () {
	super();

	const observer			= new MutationObserver( () => {
	    this.mutationCallback && this.mutationCallback();
	});
	observer.observe( this, {
	    "characterData": false,
	    "childList": true,
	    "attributes": false,
	});

	if ( this.constructor.template === undefined )
	    throw new Error(`Missing template for ${this.constructor.name}`);

	let template			 	= this.constructor.template;
	this.constructor.$template		= document.createElement("template");

	if ( this.constructor.CSS )
	    template				= `<style>\n${this.constructor.CSS}\n</style>` + template;

	this.constructor.$template.innerHTML	= template;

	this.attachShadow({ mode: "open" });
	this.shadowRoot.appendChild(
	    this.constructor.$template.content.cloneNode(true)
	);


	const $this				= this;
	const __props_store			= {};
	Object.defineProperty( this, "__props", {
	    "value": {},
	});

	Object.entries( this.constructor.refs ).forEach( ([key, selector]) => {
	    Object.defineProperty( this, key, {
		get () {
		    if ( key.startsWith("$") )
			return this.shadowRoot.querySelector( selector );
		    else
			return this.shadowRoot.querySelectorAll( selector );
		},
	    });
	});

	this.constructor.observedAttributes.push( ...Object.keys( this.constructor.properties ) );

	Object.entries( this.constructor.properties ).forEach( ([key, config]) => {
	    Object.defineProperty( this.__props, key, {
		get () {
		    return __props_store[ key ] || config.default;
		},
		set ( value ) {
		    __props_store[ key ]	= value;

		    if ( config.updated ) {
			config.updated.call( $this );
		    }
		},
	    });

	    Object.defineProperty( this, key, {
		get () {
		    return this.__props[ key ];
		},
		set ( value ) {
		    this.__props[ key ]		= value;

		    if ( config.reflect !== false )
			this.setAttribute( key, value );
		},
	    });
	});
    }
}

export default HTMLElementTemplate;
