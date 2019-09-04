// Constructors
if (document.gibado === undefined) {
    document.gibado = {};
}

if (document.gibado.Mint === undefined) {
    document.gibado.Mint = {};
}

/**
 * Checks if the page is still connecting to resources
 * @returns {boolean} Returns true if the page is done loading
 */
document.gibado.Mint.isDoneLoading = function() {
    return !document.getElementsByClassName('status connecting').length > 0;
};