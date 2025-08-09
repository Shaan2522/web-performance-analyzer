import React, { useState, useEffect } from 'react';
import { filterRequests, sortRequests, formatTime, analyzeResource } from '../../utils/networkUtils';

function ResourceTable({ resources }) {
  const [filteredResources, setFilteredResources] = useState(resources);
  // const [filterType, setFilterType] = useState(''); // Removed filterType
  const [filterUrl, setFilterUrl] = useState('');
  const [sortBy, setSortBy] = useState('startTime');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    let currentResources = [...resources];
    // currentResources = filterRequests(currentResources, filterType, filterUrl); // Removed filterType
    currentResources = filterRequests(currentResources, '', filterUrl); // Pass empty string for filterType
    currentResources = sortRequests(currentResources, sortBy, sortOrder);
    setFilteredResources(currentResources);
  }, [resources, filterUrl, sortBy, sortOrder]); // Removed filterType from dependencies

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="resource-table">
      <h3>Resource Loading Details</h3>
      <div className="filters">
        {/* Removed Filter by type input */}
        <input
          type="text"
          placeholder="Filter by URL (substring)"
          value={filterUrl}
          onChange={(e) => setFilterUrl(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSort('initiatorType')}>Type {sortBy === 'initiatorType' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSort('duration')}>Duration {sortBy === 'duration' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSort('startTime')}>Start Time {sortBy === 'startTime' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            <th>Bottleneck</th>
          </tr>
        </thead>
        <tbody>
          {filteredResources.map((resource, index) => {
            const analysis = analyzeResource(resource);
            return (
              <tr key={index}>
                <td>{resource.name.substring(0, 80)}...</td>
                <td>{resource.initiatorType}</td>
                <td>{formatTime(resource.duration)}</td>
                <td>{formatTime(resource.startTime)}</td>
                <td>{analysis.bottleneck}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceTable;