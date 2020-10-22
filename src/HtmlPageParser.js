export default class HtmlPageParser {
  parse(html) {
    var el = document.createElement("html");
    el.innerHTML = html;

    return el;
  }

  getSituations(htmlDom) {
    let situations = [];

    if (htmlDom) {
      let situationsElements = htmlDom.getElementsByClassName("situation");
      let explanationsElements = htmlDom.getElementsByClassName("explanation");

      if (situationsElements && situationsElements.length > 0) {
        for (let i = 0; i < situationsElements.length; i++) {
          let explanation = null;
          const identifierAttr = situationsElements[i].attributes["identifier"];
          const identifier = identifierAttr ? identifierAttr.value : null;

          if (identifier) {
            explanation = this.findExplanationByIdentifier(
              explanationsElements,
              identifier
            );
          }

          if (situationsElements[i].innerHTML) {
            situations.push({
              identifier: identifier,
              situation: `<div identifier='${identifier}'>${situationsElements[i].innerHTML}</div>`,
              explanation: explanation,
            });
          }
        }
      }
    }

    return situations;
  }

  findExplanationByIdentifier(explanations, identifier) {
    if (explanations && explanations.length > 0) {
      for (let i = 0; i < explanations.length; i++) {
        const identifierAttr = explanations[i].attributes["identifier"];
        const _identifier = identifierAttr ? identifierAttr.value : null;
        if (_identifier === identifier) {
          return `<div identifier='${identifier}'>${explanations[i].innerHTML}</div>`;
        }
      }
    }

    return null;
  }
}
