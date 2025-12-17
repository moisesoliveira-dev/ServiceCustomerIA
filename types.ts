
export enum NodeType {
  INPUT_TRANSFORMER = 'INPUT_TRANSFORMER',
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

export interface Integration {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: IntegrationStatus;
  configFields: ConfigField[];
}

export interface ConfigField {
  label: string;
  key: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface FlowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: any;
}

export interface MappingPair {
  source: string;
  target: string;
  transformation?: string;
}
