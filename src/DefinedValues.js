const AutoAddedValues = {
    keywords:   [],
    types:      [],
    functions:  [],
    variables:  []
};

const DefinedValues = {
code: "#include <stdio.h>\n#include <iostream>\n\nint main()\n{\n    int number = 0 + (5 - 6) * 7 / 8 % 9; //Some \"comment\";\n    int arr[10] = {0};\n    \n    if (true)\n    {\n        std::cout << \"\\\"test\\\" 'str//ing'\\0\";\n    }\n    else\n    {\n        printf(\"\\\"test\\\" 'str//ing'\\n\");\n    }\n    \n    float floatingNumber = 3.14f;\n    return 0;\n}",
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

"new",
"delete",

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
"signed",
"unsigned",
"std",
"string",
"FILE",
"istream",
"ostream",
"fstream",
"ifstream",
"ofstream",
"int8_t",
"uint8_t",
"int16_t",
"uint16_t",
"int32_t",
"uint32_t",
"int64_t",
"uint64_t",
"clock_t",
"size_t",
"time_t",
"wchar_t",
"wint_t",
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
"fopen",
"fclose",
"fcloseall",
"fprintf",
"fscanf",
"fread",
"fwrite",
"fputs",
"fgets",
"fputc",
"fgetc",
],

variables:
[
"cin",
"cout",
]
};