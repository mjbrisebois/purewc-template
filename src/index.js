
export class HTMLElementTemplate extends HTMLElement {
    constructor () {
	super();

	const child_observer			= new MutationObserver( () => {
	    this.mutationCallback && this.mutationCallback();
	});
	child_observer.observe( this, {
	    "childList": true,
	    "subtree": true,
	});

	if ( this.constructor.template === undefined )
	    throw new TypeError(`Missing template for ${this.constructor.name}`);

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
	const __props				= {};

	const attr_observer			= new MutationObserver( (mutationList) => {
	    for ( let mutation of mutationList ) {
		const name			= mutation.attributeName;
		__props[ name ]			= this.getAttribute( name );
	    }
	});
	attr_observer.observe( this, {
	    "attributes": true,
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
	    Object.defineProperty( __props, key, {
		get () {
		    return __props_store[ key ] || config.default;
		},
		set ( value ) {
		    const before		= __props_store[ key ];
		    __props_store[ key ]	= value;

		    if ( before !== value && config.updateDOM )
			config.updateDOM.call( $this, before, before !== value );
		},
	    });

	    Object.defineProperty( this, key, {
		get () {
		    return __props[ key ];
		},
		set ( value ) {
		    const before		= __props[ key ];
		    __props[ key ]		= config.set
			? config.set.call( $this, value ) || value
			: value;
		    const after			= __props[ key ];

		    if ( before === after )
			return;

		    if ( config.reflect !== false )
			this.setAttribute( key, value );
		},
	    });
	});
    }
}

export default HTMLElementTemplate;
