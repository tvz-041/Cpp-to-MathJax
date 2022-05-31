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
    SingleQuotes: [ 
        '\'', '\‘', '\’', '\‚', '\‛'//, '\`', '\´'
    ],
    DoubleQuotes: [ 
        '\"', '\“', '\”', '\„', '\‟'
    ],
    Whitespaces: [
        ' ', '\t'
    ],
    TexSpecialSymbols: [
        '_', '#', '{', '}'
    ],
    All: [],
    AllExceptParenthesis: [],
    AllExceptQuotes: [],
    AllExceptWhitespaces: [],
    AllExceptWhitespacesAndSingleQuotes: [],

    RegExps: {
        AllExceptQuotes: null,
        AllExceptWhitespaces: null,
        AllExceptWhitespacesAndSingleQuotes: null,
        TexSpecialSymbols: null
    },

    init: function() {
        Array.prototype.push.apply(this.All, this.Parenthesis);
        Array.prototype.push.apply(this.All, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.All, this.OneSymbolOperators);
        Array.prototype.push.apply(this.All, this.DoubleQuotes);
        Array.prototype.push.apply(this.All, this.SingleQuotes);
        Array.prototype.push.apply(this.All, this.Whitespaces);
        Array.prototype.push.apply(this.All, this.TexSpecialSymbols);
        
        Array.prototype.push.apply(this.AllExceptParenthesis, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.DoubleQuotes);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.SingleQuotes);
        Array.prototype.push.apply(this.AllExceptParenthesis, this.Whitespaces);

        Array.prototype.push.apply(this.AllExceptQuotes, this.Parenthesis);
        Array.prototype.push.apply(this.AllExceptQuotes, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptQuotes, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptQuotes, this.Whitespaces);

        Array.prototype.push.apply(this.AllExceptWhitespaces, this.Parenthesis);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.DoubleQuotes);
        Array.prototype.push.apply(this.AllExceptWhitespaces, this.SingleQuotes);

        Array.prototype.push.apply(this.AllExceptWhitespacesAndSingleQuotes, this.Parenthesis);
        Array.prototype.push.apply(this.AllExceptWhitespacesAndSingleQuotes, this.TwoSymbolOperators);
        Array.prototype.push.apply(this.AllExceptWhitespacesAndSingleQuotes, this.OneSymbolOperators);
        Array.prototype.push.apply(this.AllExceptWhitespacesAndSingleQuotes, this.DoubleQuotes);

        this.RegExps.TexSpecialSymbols = new RegExp(
            "(" + 
                regexPatternWithEscapedSymbols(this.TexSpecialSymbols) + 
            ")",
        'g');

        this.RegExps.AllExceptQuotes = new RegExp(
            "(" + 
                "\t|" + 
                " +|" + 
                regexPatternWithEscapedSymbols(this.AllExceptQuotes) + 
            ")"
        );

        this.RegExps.AllExceptWhitespaces = 
            regExpForSetExceptWhitespaces__(this.AllExceptWhitespaces);


        this.RegExps.AllExceptWhitespacesAndSingleQuotes = 
            regExpForSetExceptWhitespaces__(this.AllExceptWhitespacesAndSingleQuotes);

        function regExpForSetExceptWhitespaces__(set)
        {
            return new RegExp(
                "(" +
                    "(" + 
                        "\\\\" + 
                        "(" + 
                            "\\\\|" + 
                            "\\d|" + 
                            "\\w|" + 
                            regexPatternWithEscapedSymbols(set) + 
                        ")" + 
                    ")|" + 
                    regexPatternWithEscapedSymbols(set) + 
                ")",
            'g');
        }
    }
};