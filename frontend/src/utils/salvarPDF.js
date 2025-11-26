export const salvarDFC = () => {
    const dreContainer = document.querySelector(".box_resultados_dre");

    if (!dreContainer) return;

    const novaAba = window.open("", "_blank");

    // Pega todas as folhas de estilo da página atual
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
                    ${dreContainer.outerHTML}
                </body>
            </html>
        `);

    novaAba.document.close();
    novaAba.focus();

    setTimeout(() => {
        novaAba.print();
    }, 500);
};