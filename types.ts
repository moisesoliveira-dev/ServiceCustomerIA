
export enum NodeType {
  INPUT_TRANSFORMER = 'INPUT_TRANSFORMER',
  STATE_MANAGER = 'STATE_MANAGER',
  STATE_ROUTER = 'STATE_ROUTER',
  AGENT_WORKER = 'AGENT_WORKER',
  OUTPUT_GENERATOR = 'OUTPUT_GENERATOR'
}

export enum IntegrationStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  ERROR = 'ERROR'
}

export type CRMType = 'salesforce' | 'hubspot' | 'custom' | 'none';

export interface Company {
  id: string;
  name: string;
  color: string;
  crmType: CRMType;
  internalSchema?: any;
  crmConfig?: {
    webhookUrl?: string;
    aiInstructions?: string;
    sourceJson?: string;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  icon: string;
  status?: IntegrationStatus;
  configFields: ConfigField[];
}

export interface ConfigField {
  label: string;
  key: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface FlowNodeData {
  label: string;
  icon: string;
  nodeType: NodeType;
  connected?: boolean;
  integrationId?: string;
  description?: string;
}

export interface MappingPair {
  source: string;
  target: string;
  transformation?: string;
}
