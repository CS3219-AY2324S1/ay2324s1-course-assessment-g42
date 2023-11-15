//export const INGRESS_UR = 'http://34.117.214.12';
export const USER_API_URL = process.env.INGRESS_URL ? process.env.INGRESS_URL : 'http://localhost:5000';
export const QUESTION_API_URL = process.env.INGRESS_URL ? process.env.INGRESS_URL : 'http://localhost:8030';
export const MATCH_API_URL = process.env.INGRESS_URL ? process.env.INGRESS_URL : 'http://localhost:5001';
export const COLLAB_API_URL = process.env.INGRESS_URL ? process.env.INGRESS_URL : 'http://localhost:5002';
export const HISTORY_API_URL = process.env.INGRESS_URL ? process.env.INGRESS_URL : 'http://localhost:5004';
export const CHAT_API_URL = process.env.INGRESS_URL ? process.env.INGRESS_URL : 'http://localhost:5003';
