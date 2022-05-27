const StyleType = {
    Default:    0,
    Background: 1,
    String:     2,
    Comment:    3,
    Number:     4,
    Keyword:    5,
    Type:       6,
    Function:   7,
    Variable:   8
};

class StyleWidget
{
    constructor(color, labelString = "")
    {
        this.style.color = color;
        this.labelString = labelString;
    }

    labelString = "";
    style = {
        color:  "#000000",
        bold:   false,
        italic: false
    };
    div = null;
    pickr = null;
};

const Palette = {
    htmlElements: {
        div: null,
        enableCheckBoxDiv: null
    },
    styleWidgets: [
        new StyleWidget(DefinedValues.colors[StyleType.Default],    "По умолчанию"),
        new StyleWidget(DefinedValues.colors[StyleType.Background], "Фон"),
        new StyleWidget(DefinedValues.colors[StyleType.String],     "Строки"),
        new StyleWidget(DefinedValues.colors[StyleType.Comment],    "Комментарии"),
        new StyleWidget(DefinedValues.colors[StyleType.Number],     "Числа"),
        new StyleWidget(DefinedValues.colors[StyleType.Keyword],    "Ключевые слова"),
        new StyleWidget(DefinedValues.colors[StyleType.Type],       "Типы"),
        new StyleWidget(DefinedValues.colors[StyleType.Function],   "Функции"),
        new StyleWidget(DefinedValues.colors[StyleType.Variable],   "Переменные")
    ],

    init: function() {
        this.htmlElements.div = document.getElementById('palette');
        this.htmlElements.enableCheckBoxDiv = document.getElementById('enablePaletteCheckBox');

        for (let i = 0; i < this.styleWidgets.length; ++i) {
            [this.styleWidgets[i].div, this.styleWidgets[i].pickr] = createColorInputWithLabel({
                fieldClassName: 'ColorWidget', 
                labelText:      this.styleWidgets[i].labelString, 
                fieldValue:     this.styleWidgets[i].style.color
            });
            let _this = this;
            this.styleWidgets[i].pickr.on('save', function() {
                _this.styleWidgets[i].style.color = colorInputValue(_this.styleWidgets[i].div);
                MathJaxConverter.render();
            });
            this.htmlElements.div.appendChild(this.styleWidgets[i].div);
        }
    },

    toggle: function() {
        if (enablePaletteCheckBox.checked) {
            this.htmlElements.div.classList.remove("disabled");
        } else {
            this.htmlElements.div.classList.add("disabled");
        }
        MathJaxConverter.render();
    },

    style: function(styleType) {
        return this.styleWidgets[styleType].style;
    },

    color: function(styleType) {
        return this.style(styleType).color;
    },

    defaultStyle: function() {
        return this.style(StyleType.Default);
    },

    defaultColor: function() {
        return this.color(StyleType.Default);
    },

    backgroundColor: function() {
        return this.color(StyleType.Background);
    },

    copyColorsToClipboard: function() {
        let _this = this;
        onActionButtonActivated(document.getElementById("copyPaletteColorsButton"), "Скопировано!", function() {
            let spaces = ""; //"                ";
            let colors = 
                spaces + '"' + _this.color(StyleType.Default)   + '", //По умолчанию\n' +
                spaces + '"' + _this.color(StyleType.Background) + '", //Фон\n' +
                spaces + '"' + _this.color(StyleType.String)     + '", //Строки\n' +
                spaces + '"' + _this.color(StyleType.Comment)    + '", //Комментарии\n' +
                spaces + '"' + _this.color(StyleType.Number)     + '", //Числа\n' +
                spaces + '"' + _this.color(StyleType.Keyword)    + '", //Ключевые слова\n' +
                spaces + '"' + _this.color(StyleType.Type)       + '", //Типы\n' +
                spaces + '"' + _this.color(StyleType.Function)   + '", //Функции\n' +
                spaces + '"' + _this.color(StyleType.Variable)   + '", //Переменные';
            navigator.clipboard.writeText(colors);
        });
    },

    sourceCodeElementStyle: function(sourceCodeElement) {
        if (sourceCodeElement.length == 0) {
            return this.defaultStyle();
        }

        if (sourceCodeElement[0] == '\"' || sourceCodeElement[0] == '\'' || 
            (sourceCodeElement[0] == '\<' && sourceCodeElement.length > 2)) {   //for include <>
            return this.style(StyleType.String);
        } else if (sourceCodeElement.startsWith("//")){
            return this.style(StyleType.Comment);
        } else if (sourceCodeElement.match(/^[0-9\.]+f?$/)){
            return this.style(StyleType.Number);
        } else if (DefinedValues.keywords.includes(sourceCodeElement)) {
            return this.style(StyleType.Keyword);
        } else if (DefinedValues.types.includes(sourceCodeElement)) {
            return this.style(StyleType.Type);
        } else if (DefinedValues.functions.includes(sourceCodeElement)) {
            return this.style(StyleType.Function);
        } else if (DefinedValues.variables.includes(sourceCodeElement)) {
            return this.style(StyleType.Variable);
        }
        
        return this.defaultStyle();
    }
};