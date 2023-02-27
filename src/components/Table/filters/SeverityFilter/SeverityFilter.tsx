import classNames from "classnames";
import React from "react";

import { Severities, SEVERITIES, SEVERITIES_ICONS } from "../../../../consts";
import "./severityFilter.scss";

interface SeverityFilterProps {
  setFilter: (value: Severities) => void;
}

function SeverityFilter({ setFilter }: SeverityFilterProps) {
  return (
    <div className="severity-filter">
      <span className="heading-4">Min. Severity</span>
      {SEVERITIES.map((severity) => {
        const Icon = SEVERITIES_ICONS[severity];
        const classes = classNames({
          "severity-wrapper": true,
          [severity.toLowerCase()]: true,
        });
        return (
          <div
            key={severity}
            onClick={() => setFilter(severity)}
            className={classes}
          >
            <span>
              <Icon />
            </span>
            {severity}
          </div>
        );
      })}
    </div>
  );
}

export default SeverityFilter;
