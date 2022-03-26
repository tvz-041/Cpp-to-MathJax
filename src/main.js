const EditMode = {
    Default:  0,
    Keywords: 1,
    Direct:   2
};

var CurrentEditMode = EditMode.Default;

var autoRenderCheckBox = null;
var inlineMathJaxCodeCheckBox = null;
var copyHtmlCodeCheckBox = null;

var useSmallCommandCheckBox = null;
var monospaceFontCheckBox = null;
var lineNumbersCheckBox = null;

var sourceCodeEditor = null;

var keywordsEditor = {
    div:       null,
    keywords:  null,
    types:     null,
    functions: null,
    variables: null
};

function init()
{
    autoRenderCheckBox = document.getElementById('autoRenderCheckBox');
    inlineMathJaxCodeCheckBox = document.getElementById('inlineMathJaxCodeCheckBox');
    copyHtmlCodeCheckBox = document.getElementById('copyHtmlCodeCheckBox');

    useSmallCommandCheckBox = document.getElementById("useSmallCommandCheckBox");
    monospaceFontCheckBox = document.getElementById("monospaceFontCheckBox");
    lineNumbersCheckBox = document.getElementById("lineNumbersCheckBox");

    sourceCodeEditor = document.getElementById('sourceCodeEditor');

    keywordsEditor.div       =  document.getElementById('keywordsEditor');
    keywordsEditor.keywords  =  document.getElementById('keywordsListEditor');
    keywordsEditor.types     =  document.getElementById('typesListEditor');
    keywordsEditor.functions =  document.getElementById('functionsListEditor');
    keywordsEditor.variables =  document.getElementById('variablesListEditor');

    ServiceSymbols.init();
    Palette.init();
    MathJaxConverter.init();
    initListeners();

    if (DefinedValues.code) {
        sourceCodeEditor.value = DefinedValues.code;
        MathJaxConverter.render();
    }
}

function initListeners()
{
    __initKeywordsListEditor(DefinedValues.keywords,  keywordsEditor.keywords);
    __initKeywordsListEditor(DefinedValues.types,     keywordsEditor.types);
    __initKeywordsListEditor(DefinedValues.functions, keywordsEditor.functions);
    __initKeywordsListEditor(DefinedValues.variables, keywordsEditor.variables);

    __addTextEditorListener(sourceCodeEditor, function() {
        if (this.value.includes('\t')) {
            let end = this.selectionEnd;
            this.value = this.value.replaceAll('\t', "    ");
            this.selectionStart = this.selectionEnd = end + 3;
        }
        
        if (autoRenderCheckBox.checked) {
            MathJaxConverter.render();
        }
    });

    sourceCodeEditor.addEventListener('keydown', function(e) {
        let isOverriden = false;

        if (e.key == "Tab") {
            e.preventDefault();
            isOverriden = true;
            let start = this.selectionStart;
            let end = this.selectionEnd;
            let whitespacesCount = 0;
            let previousLineEndIndex = this.value.substring(0, start).lastIndexOf('\n');

            if (e.getModifierState("Shift")) {
                let maxWhitespacesCount = (start - (previousLineEndIndex >= 0 ? previousLineEndIndex + 1 : 0)) % 4;
                maxWhitespacesCount = maxWhitespacesCount ? maxWhitespacesCount : 4;
                while (whitespacesCount < maxWhitespacesCount && this.value[start - whitespacesCount - 1] == " ") {
                    ++whitespacesCount;
                }

                if (whitespacesCount > 0) {
                    this.selectionStart = start - whitespacesCount;
                    document.execCommand("delete", false);
                }
            } else {
                whitespacesCount = 4 - (start - (previousLineEndIndex >= 0 ? previousLineEndIndex + 1 : 0)) % 4;
                document.execCommand("insertText", false, " ".repeat(whitespacesCount));
            }
        } else if (e.key == "Enter") {
            e.preventDefault();
            isOverriden = true;
            let start = this.selectionStart;
            let end = this.selectionEnd;
            let previousLineEndIndex = this.value.substring(0, start).lastIndexOf('\n');
            let whitespacesCount = 0;
            while (this.value[previousLineEndIndex + whitespacesCount + 1] == " ") {
                ++whitespacesCount;
            }

            document.execCommand("insertText", false, "\n" + " ".repeat(whitespacesCount));
        }

        if (isOverriden) {
            this.dispatchEvent(new CustomEvent("input", {}));
        }
    });
    
    let switchBetweenSourceAndKeywordEditorsButton = document.getElementById("switchBetweenSourceAndKeywordEditorsButton");
    let directConvertingButton = document.getElementById("directConvertingButton");
    let buttonsContainer = directConvertingButton.parentNode;

    switchBetweenSourceAndKeywordEditorsButton.onclick = function() {
        if (CurrentEditMode == EditMode.Default) {
            CurrentEditMode = EditMode.Keywords;
            
            switchBetweenSourceAndKeywordEditorsButton.style.width = __buttonsContainerWidth();
            buttonsContainer.style.gridTemplateColumns = "repeat(2, auto) 1fr auto";
            directConvertingButton.style.display = "none";
            switchBetweenSourceAndKeywordEditorsButton.innerText = "Редактор кода";
            
            sourceCodeEditor.style.display = "none";
            keywordsEditor.div.style.display = "grid";
        } else {
            CurrentEditMode = EditMode.Default;

            directConvertingButton.style.display = "block";
            switchBetweenSourceAndKeywordEditorsButton.innerText = "Редактор зарезервированных слов";
            switchBetweenSourceAndKeywordEditorsButton.style.width = "";
            buttonsContainer.style.gridTemplateColumns = "repeat(3, auto) 1fr auto";

            sourceCodeEditor.style.display = "block";
            keywordsEditor.div.style.display = "none";
        }
    }

    directConvertingButton.onclick = function() {
        if (CurrentEditMode == EditMode.Default) {
            CurrentEditMode = EditMode.Direct;

            directConvertingButton.style.width = __buttonsContainerWidth();
            buttonsContainer.style.gridTemplateColumns = "repeat(2, auto) 1fr auto";
            switchBetweenSourceAndKeywordEditorsButton.style.display = "none";
            directConvertingButton.innerText = "Редактор кода";

            lineNumbersCheckBox.parentNode.style.display = "none";
            for (let i = StyleType.Background + 1; i < StyleWidgets.length; ++i) {
                StyleWidgets[i].div.classList.add("disabled");
            }

            MathJaxConverter.data.sourceCodeFromPreviousSwitch = sourceCodeEditor.value;
            if (MathJaxConverter.data.convertedCodeFromPreviousSwitch) {
                sourceCodeEditor.value = MathJaxConverter.data.convertedCodeFromPreviousSwitch;
            } else {
                sourceCodeEditor.value = MathJaxConverter.data.lastConvertedCode;
            }
            MathJaxConverter.data.eraseMathjaxCodeFromPreviousSwitch = false;
            

            if (enablePaletteCheckBox.checked) {
                enablePaletteCheckBox.checked = false;
                togglePalette();
            }
        } else {
            CurrentEditMode = EditMode.Default;

            switchBetweenSourceAndKeywordEditorsButton.style.display = "block";
            directConvertingButton.innerText = "Режим прямого преобразования кода";
            directConvertingButton.style.width = "";
            buttonsContainer.style.gridTemplateColumns = "repeat(3, auto) 1fr auto";

            lineNumbersCheckBox.parentNode.style.display = "block";
            for (let i = StyleType.Background + 1; i < StyleWidgets.length; ++i) {
                StyleWidgets[i].div.classList.remove("disabled");
            }

            MathJaxConverter.data.convertedCodeFromPreviousSwitch = sourceCodeEditor.value;
            if (MathJaxConverter.data.sourceCodeFromPreviousSwitch) {
                sourceCodeEditor.value = MathJaxConverter.data.sourceCodeFromPreviousSwitch;
            }

            if (!enablePaletteCheckBox.checked) {
                enablePaletteCheckBox.checked = true;
                Palette.toggle();
            }
        }
    }

    function __buttonsContainerWidth()
    {
        return parseInt(window.getComputedStyle(directConvertingButton).width) + 10.5 +
               parseInt(window.getComputedStyle(switchBetweenSourceAndKeywordEditorsButton).width) + "px";
    }

    function __initKeywordsListEditor(keywordsList, keywordsListEditor)
    {
        keywordsList.sort();
        keywordsList.forEach(element => {
            keywordsListEditor.value += element + "\n";
        })

        __addTextEditorListener(keywordsListEditor, function() {
            if (keywordsListEditor.value.slice(-1) != "\n") {
                return;
            }

            let newList = [...new Set(keywordsListEditor.value.split("\n").filter(Boolean))];
            if (!newList.equals(keywordsList)) {
                keywordsList.clear();
                keywordsList.push.apply(keywordsList, newList);
                if (autoRenderCheckBox.checked) {
                    MathJaxConverter.render();
                }
            }
        });
    }

    function __addTextEditorListener(textEditor, listener)
    {
        if (textEditor.addEventListener) {
            textEditor.addEventListener('input', listener, false);
        } else if (textEditor.attachEvent) {
            textEditor.attachEvent('onpropertychange', listener);
        }
    }
}