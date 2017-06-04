/**
 * Helper function showFeedback
 * Append a p element to the feedback html element
 * with the given text as its text node.
 *
 * @param {string} text Text to be placed in the p element.
 */
 
 //word toegevoegd als een helperfunctie om te kunnen Debuggen.
 //De feedback wordt getoond onderaan de index pagina, daar kunnen we de fouten zien.
 //deze methode creert dus een div als die er nog niets is.
function showFeedback(text) {
    var feedback = document.getElementById('feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        document.body.appendChild(feedback);
    }
    var p = document.createElement('p');
    var textContent = document.createTextNode(text);
    p.appendChild(textContent);
    feedback.appendChild(p);
}
