function Calculator ( form, summary ) {
 this.prices = {
  products: 0.5,
  orders: 0.25,
  package: {
   basic: 0,
   professional: 25,
   premium: 60,
  },
  accounting: 35,
  terminal: 5,
 };

 this.form = {
  products: form.querySelector( "#products" ),
  orders: form.querySelector( "#orders" ),
  package: form.querySelector( "#package" ),
  accounting: form.querySelector( "#accounting" ),
  terminal: form.querySelector( "#terminal" ),
 };

 this.summary = {
  list: summary.querySelector( "ul" ),
  items: summary.querySelector( "ul" ).children,
  total: {
   container: summary.querySelector( "#total-price" ),
   price: summary.querySelector( ".t-com__final-price" ),
  },
 };
 this.addEvents();
};

//6.Dodanie wydarzeń - bardzo ważny element 
Calculator.prototype.addEvents = function () {
 this.form.products.addEventListener( "change", this.inputEvent.bind( this ) );
 this.form.products.addEventListener( "keyup", this.inputEvent.bind( this ) );
 this.form.orders.addEventListener( "change", this.inputEvent.bind( this ) );
 this.form.orders.addEventListener( "keyup", this.inputEvent.bind( this ) );

 this.form.package.addEventListener( "click", this.selectEvent.bind( this ) );

 this.form.accounting.addEventListener( "change", this.checkboxEvent.bind( this ) );
 this.form.terminal.addEventListener( "change", this.checkboxEvent.bind( this ) );
}

//7.Aktualizacja sumy
Calculator.prototype.updateTotal = function() {
 const show = this.summary.list.querySelectorAll( ".open" ).length > 0;

 if ( show ) {
  const productsSum = this.form.products.value < 0
  ? 0
  : this.form.products.value * this.prices.products;

  const ordersSum = this.form.orders.value < 0
  ? 0
  : this.form.orders.value * this.prices.orders;

  const packagePrice = this.form.package.dataset.value.length === 0
  ? 0
  : this.prices.package[ this.form.package.dataset.value ];

  const accounting = this.form.accounting.checked
  ? this.prices.accounting
  : 0;

  const terminal = this.form.terminal.checked
  ? this.prices.terminal
  : 0;

  this.summary.total.price.innerText = `\$${ productsSum + ordersSum + packagePrice + accounting + terminal }`;

  this.summary.total.container.classList.add( "open" );
 } else {
  this.summary.total.container.classList.remove( "open" );
 }
}

//3. Aktualizacja
Calculator.prototype.updateSummary = function ( id, calc, total, callback ) {
 const summary = this.summary.list.querySelector( "[data-id="+id+"]" );
 const summaryCalc = summary.querySelector( ".multi" );
 const summaryTotal = summary.querySelector( ".price" );

 summary.classList.add( "open" );

 if ( summaryCalc !== null ) {
  summaryCalc.innerText = calc;
 }

 summaryTotal.innerText = `\$${ total }`;

 if ( typeof callback === "function" ) {
  callback( summary, summaryCalc, summaryTotal )
 }
}

//2. Obsługa pól tekstowych
Calculator.prototype.inputEvent = function ( el ) {
 const id = el.currentTarget.id;
 const value = el.currentTarget.value;
 const singlePrice = this.prices[ id ];
 const totalPrice = value * singlePrice;

 this.updateSummary( id, `${ value } * \$${ singlePrice }`, totalPrice, function( item, calc, total ) {
  if ( value < 0 ) {
   calc.innerHTML = null;
   total.innerText = "Value should be greater than 0";
  };

  if ( value.length === 0 ) {
   item.classList.remove( "open" );
  }
 } );
 this.updateTotal();
}


//4. Obsługa niestandardowego selecta
Calculator.prototype.selectEvent = function ( el ) {
 this.form.package.classList.toggle( "open" );

 const value = typeof el.target.dataset.value !== "undefined"
 ? el.target.dataset.value
 : "";

 const text = typeof el.target.dataset.text !== "undefined"
 ? ""
 : el.target.innerText;

 if ( value.length > 0 ) {
  this.form.package.dataset.value = value;
  this.form.package.querySelector( ".select" ).innerText = text + " - Selection";
  this.updateSummary( "package", text, this.prices.package[ value ] );
  this.updateTotal();
 };
}

//5. Obsługa checkboxow
Calculator.prototype.checkboxEvent = function ( el ) {
 const checkbox = el.currentTarget;
 const id = checkbox.id;
 const checked = el.currentTarget.checked;

 this.updateSummary( id, undefined, this.prices[ id ], function ( item ) {
  if ( !checked ) {
   item.classList.remove( "open" );
  }
 } );

 this.updateTotal();
};

// Wywołanie
document.addEventListener("DOMContentLoaded", function () {
 const form = document.querySelector(".t-com__construct");
 const summary = document.querySelector(".t-com__compute");

 new Calculator(form, summary);
})
