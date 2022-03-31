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

    copyColorsToClipboard: function() {
        let _this = this;
        onActionButtonActivated(document.getElementById("copyPaletteColorsButton"), "Скопировано!", function() {
            let spaces = ""; //"                ";
            let colors = 
                spaces + '"' + _this.styleWidgets[StyleType.Default].style.color    + '", //По умолчанию\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Background].style.color + '", //Фон\n' +
                spaces + '"' + _this.styleWidgets[StyleType.String].style.color     + '", //Строки\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Comment].style.color    + '", //Комментарии\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Number].style.color     + '", //Числа\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Keyword].style.color    + '", //Ключевые слова\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Type].style.color       + '", //Типы\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Function].style.color   + '", //Функции\n' +
                spaces + '"' + _this.styleWidgets[StyleType.Variable].style.color   + '", //Переменные';
            navigator.clipboard.writeText(colors);
        });
    },

    sourceCodeElementStyle: function(sourceCodeElement) {
        if (sourceCodeElement.length == 0) {
            return this.styleWidgets[StyleType.Default].style;
        }

        if (sourceCodeElement[0] == '\"' || sourceCodeElement[0] == '\'') {
            return this.styleWidgets[StyleType.String].style;
        } else if (sourceCodeElement.startsWith("//")){
            return this.styleWidgets[StyleType.Comment].style;
        } else if (sourceCodeElement.match(/^[0-9\.]+f?$/)){
            return this.styleWidgets[StyleType.Number].style;
        } else if (DefinedValues.keywords.includes(sourceCodeElement)) {
            return this.styleWidgets[StyleType.Keyword].style;
        } else if (DefinedValues.types.includes(sourceCodeElement)) {
            return this.styleWidgets[StyleType.Type].style;
        } else if (DefinedValues.functions.includes(sourceCodeElement)) {
            return this.styleWidgets[StyleType.Function].style;
        } else if (DefinedValues.variables.includes(sourceCodeElement)) {
            return this.styleWidgets[StyleType.Variable].style;
        }
        
        return this.styleWidgets[StyleType.Default].style;
    }
};