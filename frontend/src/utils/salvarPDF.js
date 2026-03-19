export const salvarDFC = () => {
    const wrapperDFC = document.querySelector(".wrapper_dfc");

    if (!wrapperDFC) return;

    const novaAba = window.open("", "_blank");

    const styles = Array.from(document.styleSheets)
        .map((sheet) => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join("\n");
            } catch (e) {
                return "";
            }
        })
        .join("\n");

    novaAba.document.write(`
            <html>
                <head>
                    <title>DFC</title>
                    <style>${styles}</style>
                </head>
                <body>
                    ${wrapperDFC.outerHTML}
                </body>
            </html>
        `);

    novaAba.document.close();
    novaAba.focus();

    setTimeout(() => {
        novaAba.print();
    }, 500);
};

export const salvarRelatorio = () => {
    const relatorioContainer = document.querySelector(".box_gerar_relatorio");

    if (!relatorioContainer) return;

    const novaAba = window.open("", "_blank");

    const styles = Array.from(document.styleSheets)
        .map((sheet) => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join("\n");
            } catch (e) {
                return "";
            }
        })
        .join("\n");

    novaAba.document.write(`
            <html>
                <head>
                    <title>Relatório</title>
                    <style>${styles}</style>
                </head>
                <body>
                    ${relatorioContainer.outerHTML}
                </body>
            </html>
        `);

    novaAba.document.close();
    novaAba.focus();

    setTimeout(() => {
        novaAba.print();
    }, 500);
};