
/**
 * @param {string} unescapedText 
 * @returns {string} text with escape HTML special symbols
 */
const escapeHtml = (unescapedText) => {
    return unescapedText.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

/**
 * @param {string} rgba 
 * @returns {string} HEX color
 */
const rgbaToHex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => 
    (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`

function globalRegexWithEscapedSymbols(regexPartsList, escapeSequence = "\\")
{
    return new RegExp(regexPatternWithEscapedSymbols(regexPartsList, escapeSequence), 'g');
}

function regexWithEscapedSymbols(regexPartsList, escapeSequence = "\\")
{
    return new RegExp(regexPatternWithEscapedSymbols(regexPartsList, escapeSequence));
}

function regexPatternWithEscapedSymbols(regexPartsList, escapeSequence = "\\")
{
    let pattern = "";
    for (let i = 0; i < regexPartsList.length; i++) {
        for (let j = 0; j < regexPartsList[i].length; j++) {
            pattern += escapeSequence + regexPartsList[i][j];
        }

        if (i < regexPartsList.length - 1) {
            pattern += '|';
        }
    }
    return pattern;
}

function onActionButtonActivated(button, activatedText, actionCallback, 
    waitBeforeCallbackTimeout = 25, waitAfterCallbackTimeout = 2500)
{
    if (!button || !activatedText) {
        console.error("onActionButtonActivated: button or activatedText is null");
        return;
    }

    if (button.dataset.text) {
        button.innerText = button.dataset.text;
    } else {
        button.dataset.text = button.innerText;
    }

    clearTimeout(button.dataset.timerid);
    button.dataset.timerid = setTimeout(function() {
        if (actionCallback) {
            actionCallback();
        }

        clearTimeout(button.dataset.timerid);
        button.innerText = activatedText;
        button.dataset.timerid = setTimeout(function() {
            button.innerText = button.dataset.text;
        }, waitAfterCallbackTimeout);
    }, waitBeforeCallbackTimeout);
}

function colorInputValue(colorInput)
{
    let button = colorInput.querySelector('.pcr-button');
    let buttonColor = button.style.getPropertyValue("--pcr-color");
    return rgbaToHex(buttonColor).toUpperCase();
}

function createColorInput(properties)
{
    if (properties == null) {
        properties = {};
    }

    let colorInput = document.createElement('div');
    colorInput.style.display = 'inline-block';
    colorInput.appendChild(document.createElement('div'));

    if (properties.fieldClassName != null) {
        colorInput.className = properties.fieldClassName;
    }

    let initialColor;

    if (properties.fieldValue != null) {
        initialColor = properties.fieldValue;
    } else {
        initialColor = 'rgb(0,0,0)';
    }

    let pickr = new Pickr({
        el: colorInput.lastChild,
        default: initialColor,
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsva: true,
                input: true,
                cancel: true,
                save: true
            }
        },
        i18n: {
            'ui:dialog': 'Диалог выбора цвета',
            'btn:toggle': 'Переключить диалог выбора цвета',
            'btn:swatch': 'Образец цвета',
            'btn:last-color': 'Использовать предыдущиё цвет',
            'btn:save': 'Сохранить',
            'btn:cancel': 'Отмена',
            'btn:clear': 'Очистить',

            'aria:btn:save': 'Сохранить и закрыть',
            'aria:btn:cancel': 'Отменить и закрыть',
            'aria:btn:clear': 'Очистить и закрыть',
            'aria:input': 'Поле ввода цвета',
            'aria:palette': 'Область выбора цвета',
            'aria:hue': 'Ползунок выбора оттенка',
            'aria:opacity': 'Ползунок выбора прозрачности'
        }
    });

    pickr.on('save', function() {
        pickr.hide();
    }).on('cancel', function() {
        pickr.hide();
    });
    
    if (properties.fieldWidth != null) {
        colorInput.style.width = properties.fieldWidth;
    }

    if (properties.fieldAttributeName != null) {
        colorInput.setAttribute(properties.fieldAttributeName, properties.fieldAttributeValue);
    }

    return [colorInput, pickr];
}

function createColorInputWithLabel(properties)
{
    if (properties == null) {
        properties = {};
    }

    let colorInput = createColorInput(properties);

    let colorInputDiv = colorInput[0];
    let label = document.createElement('label');

    let button = colorInputDiv.querySelector(".pcr-button");

    button.style.outlineColor = 'black';
    button.style.outlineWidth = '1px';
    button.style.outlineStyle = 'solid';
    button.style.top = '-5px';
    button.style.width = '20px';
    button.style.height = '20px';

    if (properties.layoutDirection == 'column') {
        label.style.flexDirection = 'column';

        if (properties.spacing != null) {
            colorInputDiv.style.marginTop = properties.spacing;
        } else {
            colorInputDiv.style.marginTop = '5px';
        }
    } else {
        label.style.flexDirection = 'row';

        if (properties.spacing != null) {
            colorInputDiv.style.marginRight = properties.spacing;
        } else {
            colorInputDiv.style.marginRight = '5px';
        }
    }
    
    if (properties.labelText != null) {
        label.innerText = properties.labelText;
    }

    label.prepend(colorInputDiv);

    if (properties.margin != null) {
        label.style.margin = properties.margin;
    }

    if (properties.totalWidth != null) {
        label.style.width = properties.totalWidth;
    }
    
    return [label, colorInput[1]];
}