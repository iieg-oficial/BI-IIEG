import { useMemo, useState } from 'react';
import type { Connection } from '../../../types/connections';
import type { SavedQuery } from '../../../types/queries';
import { QUERIES_LABELS } from '../consts';

interface SavedQueriesListProps {
  savedQueries: SavedQuery[];
  connections: Connection[];
  onLoad: (query: SavedQuery) => void;
  onDelete: (id: number) => void;
}

interface QueryGroup {
  connectionId: number;
  connectionName: string;
  queries: SavedQuery[];
}

function groupQueriesByConnection(
  savedQueries: SavedQuery[],
  connections: Connection[],
): QueryGroup[] {
  const connectionNameById = new Map<number, string>();
  connections.forEach((connection) => {
    connectionNameById.set(connection.id, connection.name);
  });

  const groupsById = new Map<number, QueryGroup>();
  savedQueries.forEach((query) => {
    const existing = groupsById.get(query.connectionId);
    if (existing) {
      existing.queries.push(query);
      return;
    }
    groupsById.set(query.connectionId, {
      connectionId: query.connectionId,
      connectionName:
        connectionNameById.get(query.connectionId) ?? QUERIES_LABELS.UNKNOWN_CONNECTION,
      queries: [query],
    });
  });

  return Array.from(groupsById.values()).sort((a, b) =>
    a.connectionName.localeCompare(b.connectionName),
  );
}

export default function SavedQueriesList({
  savedQueries,
  connections,
  onLoad,
  onDelete,
}: SavedQueriesListProps) {
  const groups = useMemo(
    () => groupQueriesByConnection(savedQueries, connections),
    [savedQueries, connections],
  );

  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(() => new Set());
  const [expandedQueries, setExpandedQueries] = useState<Set<number>>(() => new Set());

  if (savedQueries.length === 0) {
    return <div className="empty-state">{QUERIES_LABELS.NO_SAVED_QUERIES}</div>;
  }

  function toggleGroup(connectionId: number) {
    setCollapsedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(connectionId)) {
        next.delete(connectionId);
      } else {
        next.add(connectionId);
      }
      return next;
    });
  }

  function toggleQuery(queryId: number) {
    setExpandedQueries((previous) => {
      const next = new Set(previous);
      if (next.has(queryId)) {
        next.delete(queryId);
      } else {
        next.add(queryId);
      }
      return next;
    });
  }

  function handleDelete(id: number) {
    if (window.confirm(QUERIES_LABELS.CONFIRM_DELETE)) {
      onDelete(id);
    }
  }

  return (
    <div className="saved-queries-list">
      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.connectionId);
        const toggleLabel = isCollapsed
          ? QUERIES_LABELS.EXPAND_GROUP
          : QUERIES_LABELS.COLLAPSE_GROUP;

        return (
          <section key={group.connectionId} className="saved-queries-group">
            <button
              type="button"
              className="saved-queries-group-header"
              onClick={() => toggleGroup(group.connectionId)}
              aria-expanded={!isCollapsed}
              aria-label={toggleLabel}
            >
              <span className="saved-queries-group-caret" aria-hidden="true">
                {isCollapsed ? '▸' : '▾'}
              </span>
              <span className="saved-queries-group-name">
                {group.connectionName} ({group.queries.length})
              </span>
            </button>

            {!isCollapsed && (
              <ul className="saved-queries-group-items">
                {group.queries.map((query) => {
                  const isExpanded = expandedQueries.has(query.id);
                  const detailsLabel = isExpanded
                    ? QUERIES_LABELS.COLLAPSE_QUERY
                    : QUERIES_LABELS.EXPAND_QUERY;

                  return (
                    <li key={query.id} className="saved-query-item">
                      <div className="saved-query-item-row">
                        <button
                          type="button"
                          className="saved-query-item-toggle"
                          onClick={() => toggleQuery(query.id)}
                          aria-expanded={isExpanded}
                          aria-label={detailsLabel}
                        >
                          {isExpanded ? '▾' : '▸'}
                        </button>
                        <span className="saved-query-item-name" title={query.name}>
                          {query.name}
                        </span>
                        <div className="saved-query-item-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => onLoad(query)}
                          >
                            {QUERIES_LABELS.LOAD_BUTTON}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(query.id)}
                          >
                            {QUERIES_LABELS.DELETE_BUTTON}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="saved-query-item-details">
                          {query.description && (
                            <p className="saved-query-item-description">
                              {query.description}
                            </p>
                          )}
                          <pre className="saved-query-item-sql">{query.sqlText}</pre>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

