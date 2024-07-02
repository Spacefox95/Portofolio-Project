// UploadDoc.jsx
// Page qui intègre le composant de gestion de l'import de documents PDF

import React from "react";
import Index from "../components/Index";
import UploadDocuments from "../components/UploadDocuments";

const UploadDoc = () => {
  return (
    <Index>
      <div className="profile-container">
        <h1>Documents</h1>
        <div className="document-container">
          <UploadDocuments />
        </div>
      </div>
    </Index>
  );
};

export default UploadDoc;
