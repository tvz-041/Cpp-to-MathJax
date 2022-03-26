const ServiceSymbols = {
    OneSymbolOperators: [
        '!', '<', '>', '+', '-', '*', '/', '%', '=', 
        '&', '|', '~', '^', ',', ';', ':'
    ],
    TwoSymbolOperators: [
        '+=', '-=', '*=', '/=', '++', '--', '<<', '>>',
        '==', '!=', '<=', '>=', '&&', '||', '::', '//'
    ],
    Parenthesis: [
        '()', '{}', '[]', '(', ')', '{', '}', '[', ']'
    ],
    //\unicode{x27} - '
    Quotes: [ 
        '\'', '\"', '\‘', '\’'
    ],
    Whitespaces: [
        ' ', '\t'
    ],
    All: [],
    AllExceptParenthesis: [],
    AllExceptQuotes: [],
    AllExceptWhitespaces: [],

    RegExps: {
        AllExceptQuotes: null,
        AllExceptWhitespaces: null
    },

    init: function() {
        Array.prototype.push.apply(this.All, this.Parenthesis);
        Array.prototype.push.apply(this.All, this.OneSymbolOperators);
        Array.prototype.push.apply(this.All, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.All, this.Quotes);
        Array.prototype.push.apply(this.All, this.Whitespaces);

        Array.prototype.push.apply(this.AllExceptParenthesis, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.Quotes);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.Whitespaces);

        Array.prototype.push.apply(this.AllExceptQuotes, this.Parenthesis);
        Array.prototype.push.apply(this.AllExceptQuotes, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptQuotes, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptQuotes, this.Whitespaces);

        Array.prototype.push.apply(this.AllExceptWhitespaces, this.Parenthesis);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.Quotes);

        this.RegExps.AllExceptQuotes = new RegExp(
            "(\t| +|" + regexPatternWithEscapedSymbols(this.AllExceptQuotes) + ")"
        );

        this.RegExps.AllExceptWhitespaces = new RegExp(
            "(\\\\.|" + regexPatternWithEscapedSymbols(ServiceSymbols.AllExceptWhitespaces) + ")",
            'g'
        );
    }
};