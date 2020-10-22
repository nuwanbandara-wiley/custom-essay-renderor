import React, { useState, useEffect } from "react";
import HtmlPageParser from "./HtmlPageParser";

export default function EssayRenderer(props) {
  const htmlParser = new HtmlPageParser();
  let [essaySituations, setessaySituations] = useState([]);
  let [selectedSituation, setSelectedSituation] = useState({});

  useEffect(() => {
    const loadTemplate = async () => {
      const response = await fetch("/data/template.html");

      if (response && response.ok) {
        const html = await response.text();
        const dom = htmlParser.parse(html);
        const situations = htmlParser.getSituations(dom);

        setessaySituations([
          ...situations.map((situation) => {
            return { ...situation, answer: "", score: 0 };
          }),
        ]);

        if (situations && situations.length > 0) {
          setSelectedSituation({ ...situations[0] });
        }
      }
    };

    loadTemplate();
  }, []);

  const renderGreenButtons = () => {
    if (essaySituations.length > 0) {
      return (
        <ul>
          {essaySituations.map((situation, index) => {
            return (
              <li
                onClick={() => onGreenButtonClick(index, situation)}
                key={index}
                className={
                  situation.identifier === selectedSituation.identifier
                    ? "active"
                    : ""
                }
              >
                {index + 1}
              </li>
            );
          })}
        </ul>
      );
    }

    return "";
  };

  const onGreenButtonClick = (index, situation) => {
    setSelectedSituation({ ...situation });
  };

  const onUpdateAnswer = (answer) => {
    setSelectedSituation({ ...selectedSituation, answer: answer });

    setessaySituations([
      ...essaySituations.map((es) => {
        if (selectedSituation.identifier === es.identifier) {
          es.answer = answer;
        }

        return es;
      }),
    ]);
  };

  return (
    <React.Fragment>
      <div className="essay-container">
        <div className="essay-left-panel">{renderGreenButtons()}</div>
        <div className="essay-right-panel">
          <p>
            <strong>Question</strong>
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: selectedSituation.situation }}
          ></div>
          <p>
            <strong>Answer</strong>
          </p>
          <div className="answer-textbox-container">
            <textarea
              rows="5"
              value={selectedSituation.answer}
              onChange={(e) => {
                onUpdateAnswer(e.target.value);
              }}
            />
            <div
              className="explanation"
              dangerouslySetInnerHTML={{
                __html: selectedSituation.explanation,
              }}
            ></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
