import { Response } from 'express';

let clients: Response[] = [];

export const sseHandler = (req: any, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });
  
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(res);
  
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
};

export const broadcast = (event: string, payload: any) => {
  clients.forEach(client => {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  });
};