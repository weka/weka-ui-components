/// <reference types="react" />
import { Severities } from "../../../../consts";
import "./severityFilter.scss";
interface SeverityFilterProps {
    setFilter: (value: Severities) => void;
}
declare function SeverityFilter({ setFilter }: SeverityFilterProps): JSX.Element;
export default SeverityFilter;
