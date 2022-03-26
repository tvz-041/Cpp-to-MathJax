const MathJaxConverter = {
    data: {
        previewDiv: null,
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
        this.data.previewDivContainer.style.backgroundColor = Palette.styleWidgets[StyleType.Background].style.color;
        this.data.previewDiv.innerText = this.convert(sourceCodeEditor.value);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.previewDiv]);
    },
    copyCodeToClipboard: function() {
        let code = "";
        if (copyHtmlCodeCheckBox.checked) {
            code = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%">' + 
                '\n\t<tbody>\n\t\t<tr>\n\t\t\t<td style="background-color:' + 
                Palette.styleWidgets[StyleType.Background].style.color + '">';
            let mathjaxCodeLines = this.data.lastConvertedCode.split('\n').filter(Boolean);
            if (mathjaxCodeLines.length) {
                code += escapeHtml(mathjaxCodeLines[0]);

                for (let lineIndex = 1; lineIndex < mathjaxCodeLines.length; ++lineIndex) {
                    code += "<br />\n\t\t\t" + escapeHtml(mathjaxCodeLines[lineIndex]);
                }
            }
            code += "</td>\n\t\t</tr>\n\t</tbody>\n</table>";
        } else {
            code = inlineMathJaxCodeCheckBox.checked ? this.data.lastConvertedCode.replaceAll('\n', '') : this.data.lastConvertedCode;
        }

        onActionButtonActivated(document.getElementById("copyMathjaxCodeButton"), "Скопировано!", function() {
            navigator.clipboard.writeText(code);
        });
    },
    convert: function(sourceCodeString) {
        if (CurrentEditMode == EditMode.Direct) {
            this.data.lastConvertedCode = "";
            sourceCodeString.split(/(\\\((?:[^\\]|(?:\\[^\)]))*\\\))/).filter(Boolean).forEach(mathjaxEquation => {
                let hasParenthesis = mathjaxEquation.startsWith("\\(") && mathjaxEquation.endsWith("\\)");
                if (useSmallCommandCheckBox.checked || monospaceFontCheckBox.checked || enablePaletteCheckBox.checked) {
    
                    if (hasParenthesis) {
                        mathjaxEquation = mathjaxEquation.substring(2, mathjaxEquation.length - 2);
                        hasParenthesis = false;
                    }
    
                    if (enablePaletteCheckBox.checked) {
                        mathjaxEquation = this.wrappedCode(mathjaxEquation, "color", Palette.styleWidgets[StyleType.Default].style.color);
                    }
    
                    if (monospaceFontCheckBox.checked && !new RegExp(/^.*\\tt[^\}]/).test(mathjaxEquation)) {
                        mathjaxEquation = "\\tt" + mathjaxEquation;
                    }
                    
                    if (useSmallCommandCheckBox.checked && !new RegExp(/^.*\\small[^\}]/).test(mathjaxEquation)) {
                        mathjaxEquation = "\\small" + mathjaxEquation;
                    }
                }
    
                if (!hasParenthesis) {
                    mathjaxEquation = "\\(" + mathjaxEquation + " \\)"
                }
    
                this.data.lastConvertedCode += mathjaxEquation;
            });
        } else {
            if (this.data.convertedCodeFromPreviousSwitch) {
                if (this.data.eraseConvertedCodeFromPreviousSwitch) {
                    this.data.convertedCodeFromPreviousSwitch = null;
                } else {
                    this.data.eraseConvertedCodeFromPreviousSwitch = true;
                }
            }
            this.data.lastConvertedCode = (lineNumbersCheckBox.checked ? "\\begin{array}{r | l}" : "") + '\n';
    
            let rowNumber = 1;
            let sourceCodeRows = sourceCodeString.split('\n');
            let sourceCodeRowsCount = sourceCodeRows.length;
            sourceCodeRows.forEach(sourceCodeRow => {
                if (lineNumbersCheckBox.checked) {
                    this.data.lastConvertedCode += (monospaceFontCheckBox.checked ? "\\tt" : "") + 
                        (rowNumber < 10 ? " \\ ": " ") + rowNumber + " & " +
                        (monospaceFontCheckBox.checked ? "\\tt " : "");
                }
    
                if (sourceCodeRow.length > 0) {
                    let elements = this.sourceCodeRowElements(sourceCodeRow);
                    elements.forEach(sourceCodeRowElement => {
                        this.data.lastConvertedCode += this.convertElement(sourceCodeRowElement);
                    });
                }
    
                if (rowNumber < sourceCodeRowsCount) {
                    this.data.lastConvertedCode += " \\\\";   //double backslash - a new line
                }
                ++rowNumber;
                
                this.data.lastConvertedCode += "\n";
            });
    
            if (lineNumbersCheckBox.checked) {
                this.data.lastConvertedCode += "\\end{array}";
            }
    
            if (enablePaletteCheckBox.checked) {
                this.data.lastConvertedCode = this.wrappedCode(
                    this.data.lastConvertedCode, 
                    "color", 
                    Palette.styleWidgets[StyleType.Default].style.color
                );
            }
    
            if (monospaceFontCheckBox.checked && !lineNumbersCheckBox.checked) {
                this.data.lastConvertedCode = "\\tt " + this.data.lastConvertedCode;
            }
    
            if (useSmallCommandCheckBox.checked) {
                this.data.lastConvertedCode = "\\small " + this.data.lastConvertedCode;
            }
    
            this.data.lastConvertedCode = "\\(" + this.data.lastConvertedCode + "\\)";
        }
    
        return this.data.lastConvertedCode;
    },

    wrappedCode: function(mathjaxCode, wrapCommand, commandArgument = null) {
        return "\\" + wrapCommand + (commandArgument ? "{" + commandArgument + "}" : "") +"{" + mathjaxCode + "}";
    },
    
    convertElement: function(sourceCodeRowElement) {
        if (sourceCodeRowElement == "\t") {
            return "\\ \\ \\ \\ ";
        } else if (sourceCodeRowElement.match(/^ +$/)) {
            return " " + new String("\\ ").repeat(sourceCodeRowElement.length);
        } else {
            let style = Palette.sourceCodeElementStyle(sourceCodeRowElement);
            let mathjaxElement = sourceCodeRowElement.replaceAll(/(\{|\})/g, "\\$1").replaceAll(
                ServiceSymbols.RegExps.AllExceptWhitespaces, "\\text{$1}");
    
            if (style == Palette.styleWidgets[StyleType.Comment].style || style == Palette.styleWidgets[StyleType.String].style) {
                mathjaxElement = mathjaxElement.replaceAll(/ +/g, function(match) {
                    return " " + new String("\\ ").repeat(match.length);
                });
            }
    
            if (enablePaletteCheckBox.checked) {
                if (style.color != Palette.styleWidgets[StyleType.Default].style.color) {
                    mathjaxElement = this.wrappedCode(mathjaxElement, "color", style.color);
                }
            }
    
            return mathjaxElement;
        }
    },
    
    sourceCodeRowElements: function(sourceCodeRow) {
        let elements = [];
        let elementsSequence = "";
        let isString = false;
        let stringQuotationMark = "";
    
        for (let i = 0; i < sourceCodeRow.length; ++i) {
            if (!isString && sourceCodeRow[i] == '/' && (i + 1) < sourceCodeRow.length && sourceCodeRow[i + 1] == '/') {
                if (elementsSequence.length > 0) {
                    elements.push.apply(elements, elementsSequence.split(ServiceSymbols.RegExps.AllExceptQuotes).filter(Boolean));
                    elementsSequence = "";
                }
                elements.push(sourceCodeRow.substring(i));
                i = sourceCodeRow.length;
            } else if (sourceCodeRow[i] == '\'' || sourceCodeRow[i] == '\"') {
                if (isString) {
                    elementsSequence += sourceCodeRow[i];
    
                    if (sourceCodeRow[i] == stringQuotationMark) {
                        isString = false;
                        elements.push(elementsSequence);
                        elementsSequence = "";
                    }
                } else {
                    if (elementsSequence.length > 0) {
                        elements.push.apply(elements, elementsSequence.split(ServiceSymbols.RegExps.AllExceptQuotes).filter(Boolean));
                    }
    
                    isString = true;
                    stringQuotationMark = sourceCodeRow[i];
                    elementsSequence = stringQuotationMark;
                }
            } else {
                elementsSequence += sourceCodeRow[i];
    
                if (sourceCodeRow[i] == '\\') {
                    i++;
                    elementsSequence += sourceCodeRow[i];
                }
            }
        }
    
        if (elementsSequence.length > 0) {
            if (isString) {
                elements.push(elementsSequence);
            } else {
                elements.push.apply(elements, elementsSequence.split(ServiceSymbols.RegExps.AllExceptQuotes).filter(Boolean));
            }
        }
    
        return elements;
    }
};
