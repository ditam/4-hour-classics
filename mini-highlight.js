// A minimal js code snipppet highlighter, adding spans to recognized parts of <code> blocks
// NB: uses a naive approach, so it does not support any complicated (ie. nested) use-cases
$(function() {
  function getWrapper(className) {
    return function wrap(match) {
      return `<span class=${className}>${match}</span>`;
    };
  }

  // NB: the trailing places are there to make it slightly more resilient to nesting without having to parse anything
  const replacements = [
    { marker: 'function', wrapper: getWrapper('keyword-function') },
    { marker: 'return', wrapper: getWrapper('keyword-return') },
    { marker: 'if ', wrapper: getWrapper('keyword-if') },
    { marker: 'else ', wrapper: getWrapper('keyword-else') },
    { marker: 'var ', wrapper: getWrapper('keyword-var') },
    { marker: 'let ', wrapper: getWrapper('keyword-var') },
    { marker: 'const ', wrapper: getWrapper('keyword-var') }
  ];

  $('code.block').each(function(_index, _block) {
    const block = $(_block);
    let text = block.text();

    // strings - this first, because after the first HTML insertion everything will have quotes...
    text = text.replace(/'.*?'/g, getWrapper('string'));

    // standard replacements
    replacements.forEach(o => {
      text = text.replace(new RegExp(o.marker, 'g'), o.wrapper);
    });

    // inline comments (the regexp is an escaped //.* with a global flag)
    text = text.replace(/\/\/.*/g, getWrapper('comment'));

    // function invocations (the regexp is w+\( with a ?! negative lookahead for the function keyword)
    text = text.replace(/\b(?!(?:function)\b)\w+\(/g, function(match) {
      return `<span class='function-name'>${match.substr(0, match.length-1)}</span>(`;
    });

    block.html(text);
  });
});
