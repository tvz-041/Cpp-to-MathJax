const MathJaxConverter = {
    data: {
        /**@type {HTMLElement} */
        previewDiv: null,
        /**@type {HTMLElement} */
        previewDivContainer: null,
        lastConvertedCode: "",
        sourceCodeFromPreviousSwitch: "",
        convertedCodeFromPreviousSwitch: "",
        eraseConvertedCodeFromPreviousSwitch: false
    },

    init: function() {
        this.data.previewDiv = document.getElementById('mathjaxPreview');
        this.data.previewDivContainer = document.getElementById('mathjaxPreviewContainer');
    },
    render: function() {
        this.data.previewDivContainer.style.backgroundColor = Palette.backgroundColor();
        this.data.previewDiv.innerText = this.convert(sourceCodeEditor.value);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.previewDiv]);
    },
    copyCodeToClipboard: function() {
        let code = "";
        if (copyHtmlCodeCheckBox.checked) {
            code = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%">' + 
                '\n\t<tbody>\n\t\t<tr>\n\t\t\t<td style="background-color:' + Palette.backgroundColor() + '">';
            let mathjaxCodeLines = this.data.lastConvertedCode.split('\n').filter(Boolean);
            if (mathjaxCodeLines.length) {
                code += escapeHtml(mathjaxCodeLines[0]);

                for (let lineIndex = 1; lineIndex < mathjaxCodeLines.length; ++lineIndex) {
                    code += "<br />\n\t\t\t" + escapeHtml(mathjaxCodeLines[lineIndex]);
                }
            }
            code += "</td>\n\t\t</tr>\n\t</tbody>\n</table>";
        } else {
            code = inlineMathJaxCodeCheckBox.checked ? this.data.lastConvertedCode.replaceAll('\n', ' ') : this.data.lastConvertedCode;
        }

        onActionButtonActivated(document.getElementById("copyMathjaxCodeButton"), "Скопировано!", function() {
            navigator.clipboard.writeText(code);
        });
    },
    copyCodeImageToClipboard: function() {
        html2canvas(this.data.previewDiv.children[1], {
            scale: 4
        }).then(canvas => {
            canvas.toBlob(function(blob) {
                saveAs(blob, "MathJax.png"); 
            });
        });
    },
    convert: function(sourceCodeString) {
        if (CurrentEditMode == EditMode.Direct) {
            this.data.lastConvertedCode = "";
            sourceCodeString.split(/(\\\((?:[^\\]|(?:\\[^\)]))*\\\))/).filter(Boolean).forEach(mathjaxEquation => {
                if (mathjaxEquation == "" || mathjaxEquation == " " || mathjaxEquation == "\n") {
                    this.data.lastConvertedCode += mathjaxEquation;
                    return;
                }

                let hasParenthesis = mathjaxEquation.startsWith("\\(") && mathjaxEquation.endsWith("\\)");
                if (useSmallCommandCheckBox.checked || monospaceFontCheckBox.checked || enablePaletteCheckBox.checked) {
    
                    if (hasParenthesis) {
                        mathjaxEquation = mathjaxEquation.substring(2, mathjaxEquation.length - 2);
                        hasParenthesis = false;
                    }
    
                    if (enablePaletteCheckBox.checked && (Palette.defaultColor() != "#000000FF" || Palette.backgroundColor() != "#FFFFFFFF")) {
                        mathjaxEquation = this.wrappedCode(mathjaxEquation, "color", Palette.defaultColor());
                    }
    
                    if (monospaceFontCheckBox.checked && !new RegExp(/^.*\\tt[^\}]/).test(mathjaxEquation)) {
                        mathjaxEquation = "\\tt" + mathjaxEquation;
                    }
                    
                    if (useSmallCommandCheckBox.checked && !new RegExp(/^.*\\small[^\}]/).test(mathjaxEquation)) {
                        mathjaxEquation = this.wrappedCode(mathjaxEquation, "small");
                    }
                }
    
                if (!hasParenthesis) {
                    mathjaxEquation = "\\(" + mathjaxEquation + " \\)"
                }
    
                this.data.lastConvertedCode += mathjaxEquation;
            });
        } else { //CurrentEditMode == EditMode.Default
            if (this.data.convertedCodeFromPreviousSwitch) {
                if (this.data.eraseConvertedCodeFromPreviousSwitch) {
                    this.data.convertedCodeFromPreviousSwitch = null;
                } else {
                    this.data.eraseConvertedCodeFromPreviousSwitch = true;
                }
            }
            let rowBegin;
            if (splitCodeByRowsCheckBox.checked) {
                this.data.lastConvertedCode = "";
                rowBegin = (lineNumbersCheckBox.checked ? "\\begin{array}{r | l}" : "");
            } else {
                this.data.lastConvertedCode = (lineNumbersCheckBox.checked ? "\\begin{array}{r | l}" : "") + '\n';
                rowBegin = "";
            }
    
            let rowNumber = 1;
            let sourceCodeRows = sourceCodeString.split('\n');
            let sourceCodeRowsCount = sourceCodeRows.length;
            let convertedRow;
            sourceCodeRows.forEach(sourceCodeRow => {
                convertedRow = rowBegin;
                if (lineNumbersCheckBox.checked) {
                    convertedRow += (monospaceFontCheckBox.checked ? "\\tt" : "") + 
                        (rowNumber < 10 ? " \\ ": " ") + rowNumber + " & " +
                        (monospaceFontCheckBox.checked ? "\\tt " : "");
                }
    
                if (sourceCodeRow.length > 0) {
                    let elements = this.sourceCodeRowElements(sourceCodeRow);
                    elements.forEach(sourceCodeRowElement => {
                        convertedRow += this.convertElement(sourceCodeRowElement);
                    });
                    let textRepeatRegExp = new RegExp(/\\text\{((?:\\.|[^\}])+)\}\\text\{((?:\\.|[^\}])+)\}/);
                    while (textRepeatRegExp.test(convertedRow)) {
                        convertedRow = convertedRow.replace(textRepeatRegExp, "\\text{$1$2}");
                    }
                } else {
                    convertedRow += "\\"; //needed to create an empty line in MathJax (with code below "\\ \\\\")
                }
    
                if (rowNumber < sourceCodeRowsCount) {
                    convertedRow += " \\\\";   //double backslash - a new line
                }
                ++rowNumber;
                
                if (splitCodeByRowsCheckBox.checked) {
                    if (lineNumbersCheckBox.checked) {
                        convertedRow += "\\end{array}";
                    }
    
                    convertedRow = applyFormattingAndFinalize__(convertedRow);
                }

                this.data.lastConvertedCode += convertedRow + "\n";
            });
    
            if (!splitCodeByRowsCheckBox.checked) {
                if (lineNumbersCheckBox.checked) {
                    this.data.lastConvertedCode += "\\end{array}";
                }

                this.data.lastConvertedCode = applyFormattingAndFinalize__(this.data.lastConvertedCode);
            }
    
            function applyFormattingAndFinalize__(code) {
                if (enablePaletteCheckBox.checked && (Palette.defaultColor() != "#000000FF" || Palette.backgroundColor() != "#FFFFFFFF")) {
                    code = MathJaxConverter.wrappedCode(code, "color", Palette.defaultColor());
                }
        
                if (monospaceFontCheckBox.checked && !lineNumbersCheckBox.checked) {
                    code = "\\tt " + code;
                }
        
                if (useSmallCommandCheckBox.checked) {
                    code = MathJaxConverter.wrappedCode(code, "small");
                }

                return ("\\(" + code + "\\)");
            }
        }
    
        return this.data.lastConvertedCode;
    },

    wrappedCode: function(mathjaxCode, wrapCommand, commandArgument = null) {
        return "\\" + wrapCommand + (commandArgument ? "{" + commandArgument + "}" : "") +"{" + mathjaxCode + "}";
    },
    
    convertElement: function(sourceCodeRowElement) {
        let mathjaxElement;

        if (sourceCodeRowElement == "\t") {
            mathjaxElement = "\\ \\ \\ \\ ";
        } else if (sourceCodeRowElement.match(/^ +$/)) {
            mathjaxElement = " " + "\\ ".repeat(sourceCodeRowElement.length);
        } else {
            let style = Palette.sourceCodeElementStyle(sourceCodeRowElement, autoAddVariablesCheckBox.checked);
            mathjaxElement = sourceCodeRowElement.
                replaceAll(ServiceSymbols.RegExps.TexSpecialSymbols, "\\$1").
                replaceAll(ServiceSymbols.RegExps.AllExceptWhitespacesAndSingleQuotes, "\\text{$1}");
    
            if (style == Palette.style(StyleType.Comment) || style == Palette.style(StyleType.String)) {
                mathjaxElement = mathjaxElement.replaceAll(/ +/g, function(match) {
                    return " " + "\\ ".repeat(match.length);
                });

                mathjaxElement = mathjaxElement.replaceAll('\'', "\\unicode\[Consolas\]\{x27\}");
            }
    
            if (enablePaletteCheckBox.checked) {
                if (style.color != Palette.defaultColor()) {
                    mathjaxElement = this.wrappedCode(mathjaxElement, "color", style.color);
                }
            }
        }

        return mathjaxElement;
    },
    
    sourceCodeRowElements: function(sourceCodeRow) {
        let elements = [];
        let elementsSequence = "";
        let isProcessString = false;
        let stringQuotationMark = "";
        let currentChar;

        sourceCodeRow = sourceCodeRow.replaceAll('\∗', '\*');

        let preprocessorDirectiveRegExp = new RegExp(/^((?:\t| )*)(\#[^ ]+)( )*(.*)$/);
        let preprocessorDirectiveParseResult = preprocessorDirectiveRegExp.exec(sourceCodeRow);
        if (preprocessorDirectiveParseResult) {
            preprocessorDirectiveParseResult.splice(0, 1);
            preprocessorDirectiveParseResult = preprocessorDirectiveParseResult.filter(Boolean);
            elements.push(...preprocessorDirectiveParseResult);
            return elements;
        }
    
        for (let i = 0; i < sourceCodeRow.length; ++i) {
            currentChar = sourceCodeRow[i];
            
            if (!isProcessString && currentChar == '/' && (i + 1) < sourceCodeRow.length && sourceCodeRow[i + 1] == '/') {
                //comment
                if (elementsSequence.length > 0) {
                    elements.push.apply(elements, elementsSequence.split(ServiceSymbols.RegExps.AllExceptQuotes).filter(Boolean));
                    elementsSequence = "";
                }
                elements.push(sourceCodeRow.substring(i));
                i = sourceCodeRow.length;
            } else if (ServiceSymbols.SingleQuotes.includes(currentChar) || ServiceSymbols.DoubleQuotes.includes(currentChar)) {
                if (ServiceSymbols.DoubleQuotes.includes(currentChar)) {
                    currentChar = '\"';
                } else {
                    currentChar = '\'';
                }

                //possible begin/end of the string
                if (isProcessString) {
                    elementsSequence += currentChar;
    
                    if (currentChar == stringQuotationMark) {
                        //end of the string
                        isProcessString = false;
                        elements.push(elementsSequence);
                        elementsSequence = "";
                    }
                } else {
                    //begin of the string
                    if (elementsSequence.length > 0) {
                        elements.push.apply(elements, elementsSequence.split(ServiceSymbols.RegExps.AllExceptQuotes).filter(Boolean));
                    }
    
                    isProcessString = true;
                    stringQuotationMark = currentChar;
                    elementsSequence = stringQuotationMark;
                }
            } else {
                elementsSequence += currentChar;
    
                if (currentChar == '\\') {
                    i++;
                    elementsSequence += sourceCodeRow[i];
                }
            }
        }
    
        if (elementsSequence.length > 0) {
            if (isProcessString) {
                elements.push(elementsSequence);
            } else {
                elements.push.apply(elements, elementsSequence.split(ServiceSymbols.RegExps.AllExceptQuotes).filter(Boolean));
            }
        }
    
        return elements;
    }
};
