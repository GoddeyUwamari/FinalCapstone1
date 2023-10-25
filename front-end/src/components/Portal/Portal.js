import React from "react";
import { createPortal } from "react-dom";

const Portal = ({ className, onClick, children, portalId }) => {
  const portalRef = React.useRef(document.createElement("div"));
  const portalRootRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    let currentPortal = portalRootRef.current;
    currentPortal.setAttribute("id", "portal-root");
    currentPortal.addEventListener("click", (e) => {
      if (portalRef.current.childNodes[0]?.contains(e.target)) return;
      if (onClick) return onClick(e);
    });
    document.body.appendChild(currentPortal);

    return () => {
      document.body.removeChild(currentPortal);
    };
  }, [onClick]);

  React.useEffect(() => {
    let currentPortal = portalRef.current;
    let currentRootPortal = portalRootRef.current;

    currentPortal.setAttribute("id", portalId);
    currentPortal.setAttribute("data-testid", "portal");
    currentPortal.setAttribute("class", `${className}`);

    portalRootRef.current.appendChild(currentPortal);

    return () => {
      window.requestAnimationFrame(() => {
        if (currentPortal.childNodes.length === 0) {
          currentRootPortal.removeChild(currentPortal);
        }
      });
    };
  }, [portalId, className]);

  return createPortal(children, portalRef.current);
};

Portal.defaultProps = {
  className: "",
  onClick: () => null,
};

export default Portal;
