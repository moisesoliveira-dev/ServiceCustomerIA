
import React from 'react';

export const INTEGRATIONS_LIST = [
  {
    id: 'google-drive',
    name: 'Google Drive Asset',
    type: 'STORAGE_NODE',
    icon: '📂',
    configFields: [
      { label: 'Client ID', key: 'clientId', type: 'text', placeholder: 'OAuth Client ID' },
      { label: 'Client Secret', key: 'clientSecret', type: 'password', placeholder: '••••••••' },
      { label: 'Node Path', key: 'folderId', type: 'text', placeholder: 'Root Directory ID' }
    ]
  },
  {
    id: 'pontta',
    name: 'Pontta Core',
    type: 'CRM_NODE',
    icon: '⚡',
    configFields: [
      { label: 'Security Token', key: 'apiKey', type: 'password', placeholder: 'Bearer API Token' },
      { label: 'Endpoint Cluster', key: 'baseUrl', type: 'text', placeholder: 'https://api.pontta.cloud/v2' }
    ]
  },
  {
    id: 'slack',
    name: 'Slack Internal',
    type: 'NOTIF_NODE',
    icon: '💬',
    configFields: [
      { label: 'Hook URI', key: 'webhookUrl', type: 'text', placeholder: 'https://hooks.slack.com/services/...' }
    ]
  }
];

export const MOCK_INPUT_JSON = {
  header: {
    source: "EXTERNAL_CRM_01",
    timestamp: 1715632000
  },
  payload: {
    subject_id: "USER_88291",
    label: "John Doe",
    contact_point: "john.d@enterprise.com",
    body: "Authentication failure on Node-4"
  }
};

export const MOCK_INTERNAL_SCHEMA = [
  "nexus_uid",
  "client_label",
  "client_origin",
  "intent_class",
  "severity_index",
  "normalized_body"
];
