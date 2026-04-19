import type { QueryExecuteResult } from '../../../types/queries';
import { QUERIES_LABELS } from '../consts';

interface QueryResultsProps {
  result: QueryExecuteResult | null;
}

export default function QueryResults({ result }: QueryResultsProps) {
  if (!result) return null;

  if (result.rowCount === 0) {
    return <div className="empty-state">{QUERIES_LABELS.NO_RESULTS}</div>;
  }

  return (
    <div className="query-results">
      <div className="query-results-header">
        <h3>{QUERIES_LABELS.RESULTS_TITLE}</h3>
        <span className="row-count-badge">
          {result.rowCount} {QUERIES_LABELS.ROW_COUNT}
        </span>
      </div>
      <div className="query-results-table-wrapper">
        <table className="query-results-table">
          <thead>
            <tr>
              {result.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell == null ? 'NULL' : String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
