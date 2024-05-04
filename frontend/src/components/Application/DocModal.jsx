import React from "react";
import PdfComp from "./PdfComp";

const DocModel = ({ pdfUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <PdfComp pdffile={pdfUrl} className="pdf-comp" />
      </div>
    </div>
  );
};

export default DocModel;
