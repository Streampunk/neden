# Neden

Bare bones empirical modelling support for Node.JS, allowing any Javascript value to be established as an observable and Javascript functions to be used to establish a dependency.

## Installation

To use neden, add it to your package using npm in the normal way:

    npm install --save neden

The package has one function that you require in your code:

    var eden = require('neden');

This code is intended to be used in the Node.JS REPL for interactive and iterative experimentation.

## Usage

### Declare observables

Declare observables as follows:

```javascript
var a = eden(1);
var b = eden(true);
var c = eden('hello');
var d = eden([1, 2, 3]);
```

Each declaration returns a function.

### Read values

To read the values of observables, call the associated function with no arguments:

```javascript
a();
# 1
b();
# true
c();
# hello
d();
# [1, 2, 3]
```

### Change observables

To change the value of an observable, call the association function with a
single argument containing the replacement value:

```javascript
a(2);
# 2
b(false);
# false
c(7);
# 7 - note that the observable changes type
d({ key: 'value'});
# { key : 'value' } - also changes type
```

Do not declare the variables again as this will orphan the observable and not trigger any changes of dependent values.

### Create a dependency

Create a new dependency using a function and the observables that it depends upon.

```javascript
var s = eden((x, y) => x + y, a, c);
```

Note that you could also do the same assuming with an unbounded argument list:

```javascript
var s = eden(...x => x.reduce((y, z) => y + z), a, c);
```

In both cases, the value returned is a function.

### Read the value of an evaluated dependency

To read the value of an evaluated dependency, call the associated function with no arguments:

```javascript
s();
# 9
```

### Redefine a dependency

Call the associated function with a replacement function and dependencies:

```javascript
s(x => x - 1, a);
s();
# 1
```

To break all dependencies, change `s` into an observable, perhaps setting the value to `null`:

```javascript
s(null);
```

### Inspect the dependency tree

Observables and definitions have a property called `deps` which is an object containing a map from the unique internal identifier of any value that depends on this value and the function to call to update the dependent value.

Definitions have a value called `dpnd` which is an array of all the observables that are depended on. They also have a value called `fn` which is the function to call to update the values.

These values can be inspected in the REPL by typing the function name without calling the function, for example:

```javascript
a;
#
s;
#
```

## Status and next steps

This is an experimental prototype for research purposes only with no commitment to further development.

The definition function should be extended to support a concept such as promises so that asynchronous behaviours can be defined.
