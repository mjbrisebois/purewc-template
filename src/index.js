function assertType ( name, type, value ) {
    if ( type === String
	 && (
	     typeof value === "string"
		 || type instanceof String
	 ))
	return;
    if ( type === Number
	 && (
	     typeof value === "number"
		 || type instanceof Number
	 ))
	return;
    if ( type === Boolean
	 && (
	     typeof value === "boolean"
		 || type instanceof Boolean
	 ))
	return;
    if ( type === Array
	 && (
	     Array.isArray(value)
	 ))
	return;
    if ( type === Object
	 && value !== null && typeof value === "object"
	 && value.constructor.name === "Object"
       )
	return;
    if ( value instanceof type
	 && value.constructor.name === type.name
       )
	return;
    throw new TypeError(`'${name}' cannot be type ${typeof value}; expected type '${type.name}'`);
}

export class HTMLElementTemplate extends HTMLElement {
    slots = {};

    constructor () {
	super();

	const child_observer			= new MutationObserver( () => {
	    for ( let $el of this.querySelectorAll("[slot]") )
		this.slots[ $el.slot ]		= $el;

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

	// Attributes can already exist and will trigger the "attributes" observer before the
	// "props" are defined.
	const attr_entries			= [ ...this.attributes ]
	      .map( attr => [attr.name, attr.value] );
	const existing_attrs			= Object.fromEntries( attr_entries );


	// Attribute watcher
	const attr_observer			= new MutationObserver( (mutationList) => {
	    for ( let mutation of mutationList ) {
		const name			= mutation.attributeName;
		const before			= __props[ name ];
		__props[ name ]			= this.getAttribute( name );
		this.attributeCallback && this.attributeCallback( name, before, __props[name] );
	    }
	});
	attr_observer.observe( this, {
	    "attributes": true,
	});

	// Template element selectors
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

	for ( let $el of this.shadowRoot.querySelectorAll("slot") ) {
	    const name			= $el.getAttribute("name");
	    if ( name )
		this.slots[ name ]	= null;
	}

	// Define handlers for known properties
	Object.entries( this.constructor.properties ).forEach( ([key, config]) => {
	    Object.defineProperty( __props, key, {
		get () {
		    return __props_store[ key ];
		},
		set ( value ) {
		    if ( config.type )
			assertType( key, config.type, value );
		    const before		= __props_store[ key ];

		    __props_store[ key ]	= value;

		    if ( before !== value && config.updateDOM )
			config.updateDOM.call( $this, before, before !== value );
		},
	    });

	    Object.defineProperty( this, key, {
		get () {
		    // Handle special 'Boolean Attribute' case where the property must already be
		    // set to a boolean to prevent a TypeError.
		    return __props[ key ] === undefined
			? (config.type === Boolean ? false : config.default)
			: __props[ key ];;
		},
		set ( value ) {
		    const before		= __props[ key ];
		    __props[ key ]		= value;
		    const after			= this[ key ];

		    if ( before === after )
			return;

		    if ( config.reflect !== false ) {
			if ( after === false )
			    this.removeAttribute( key );
			else if ( after === true )
			    // If it was undefined before, do not set the attribute.  Special
			    // handling for weird behavior where property was set by "Boolean
			    // Attribute" before attribute exists or any callbacks are triggered.
			    before === undefined || this.setAttribute( key, "" );
			else
			    this.setAttribute( key, after );
		    }
		},
	    });
	});

	// TODO: verify that this wont cause an infinite loop because the only thing preventing that
	// is the basic before/after check in the props setter
	for ( let key in existing_attrs ) {
	    this[ key ]				= existing_attrs[ key ];
	}
    }
}

export default HTMLElementTemplate;
