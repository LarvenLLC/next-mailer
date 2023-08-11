type MailConfig = {
  [key: string]: any // Replace with more specific types as needed
}

type MailResponse = any // Replace with more specific types as needed

export type mail = (config: MailConfig) => Promise<MailResponse>

export interface Logger {
  info: (message: string, ...meta: any[]) => void;
  error: (message: string, error: Error) => void;
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: any[]; // Define specific type if known
}

export interface NextMailerSettings {
  logger?: Logger;
  [key: string]: any; // Include other properties as required
}

export interface Request {
  method: string;
  body: {
    attachments?: any[]; // Define specific type if known
    html: string;
    receivers: string;
    sender?: string;
    subject?: string;
    text: string;
  };
}

export interface Response {
  setHeader: (name: string, value: string | string[]) => void;
  status: (statusCode: number) => Response;
  json: (body: any) => Response; // Define specific type if known
  end: (text?: string) => void;
}

export type NextMailerFunction = (
  settings?: NextMailerSettings
) => (req: Request, res: Response) => Promise<void>
