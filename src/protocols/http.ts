export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  query: { shortRef: any; targetRef: any }
  body?: any
}
