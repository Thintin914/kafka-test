export  interface EventData {
    email?: string;
    subject?: string;
    req?: any; // Optional request object
    data?: Record<string, any>; // Optional additional data
    message: string; // Message related to the event
  }

 export interface PriorityEvent {
  name: string;
  data?: EventData;
  priority?: number | 0;
  retries?: number | 0;
}
  

export interface WorkerConfig {
  redisHost: string;
  redisPort: number;
  queueName: string;
}