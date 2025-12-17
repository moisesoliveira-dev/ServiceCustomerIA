
import React from 'react';

export const INTEGRATIONS_LIST = [
  {
    id: 'google-drive',
    name: 'Google Drive Agent',
    type: 'Storage',
    icon: '📂',
    configFields: [
      { label: 'Client ID', key: 'clientId', type: 'text', placeholder: 'Enter OAuth Client ID' },
      { label: 'Client Secret', key: 'clientSecret', type: 'password', placeholder: '••••••••' },
      { label: 'Root Folder ID', key: 'folderId', type: 'text', placeholder: 'Optional specific folder' }
    ]
  },
  {
    id: 'pontta',
    name: 'Pontta CRM',
    type: 'CRM',
    icon: '📊',
    configFields: [
      { label: 'API Key', key: 'apiKey', type: 'password', placeholder: 'Pontta API Token' },
      { label: 'Base URL', key: 'baseUrl', type: 'text', placeholder: 'https://api.pontta.com/v1' }
    ]
  },
  {
    id: 'slack',
    name: 'Slack Worker',
    type: 'Messaging',
    icon: '💬',
    configFields: [
      { label: 'Webhook URL', key: 'webhookUrl', type: 'text', placeholder: 'https://hooks.slack.com/...' }
    ]
  }
];

export const MOCK_INPUT_JSON = {
  customer: {
    id: "CUST-12345",
    fullName: "John Doe",
    email: "john@example.com"
  },
  ticket: {
    subject: "Problem with login",
    priority: "high",
    content: "I can't access my dashboard since last night."
  }
};

export const MOCK_INTERNAL_SCHEMA = [
  "user_id",
  "user_name",
  "user_contact",
  "issue_title",
  "issue_urgency",
  "message_body"
];
