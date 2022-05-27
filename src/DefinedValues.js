const DefinedValues = {
code: "#include <cstdio>\n#include <iostream>\n\nint main()\n{\n    int number = 0 + (5 - 6) * 7 / 8 % 9; //Some \"comment\";\n    int arr[10] = {0};\n    \n    if (true) {\n        std::cout << \"\\\"test\\\" 'str//ing'\";\n    } else {\n        printf(\"\\\"test\\\" 'str//ing'\");\n    }\n    \n    float floatingNumber = 3.14f;\n    return 0;\n}",
colors:
[
"#000000FF", //По умолчанию
"#FFFFFFFF", //Фон
"#8B0000FF", //Строки
"#006400FF", //Комментарии
"#0000FFFF", //Числа
"#00008BFF", //Ключевые слова
"#DAA520FF", //Типы
"#009B94FF", //Функции
"#BA55D3FF", //Переменные
],

keywords:
[
"return",
"if",
"else",
"switch",
"case",
"break",
"continue",
"const",
"enum",
"throw",
"try",
"catch",
"using",
"namespace",
"for",
"while",
"do",

"true",
"false",

"#include",

// "struct",
// "class",
// "public",
// "protected",
// "private",
// "virtual",
// "override",
],

types:
[
"int",
"bool",
"char",
"float",
"double",
"long",
"short",
"void",
"std",
"string",
],

functions:
[
"main",
"scanf",
"scanf_s",
"printf",
"printf_s",
"round",
"floor",
"ceil",
"abs",
"fabs",
"pow",
"sqrt",
"exp",
"log",
"sin",
"cos",
"tan",
],

variables:
[
"arr",
"number",
"str",
"floatingNumber",
"cin",
"cout",
]
};