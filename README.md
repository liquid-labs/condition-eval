# condition-eval

## Design notes

- Parameter names are limited to all uppercase letters. This is by design. The use case is you have some results and you want to sneak in some additional data. Since all the parameters are uppercase, it's possible to sneak in and distinguish programatically set values such as `key` which won't interfere with the standard parameters. (It also makes it easier to deal with special terms, `true`, `false`, and `undefined`.)