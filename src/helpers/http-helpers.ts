import { type HttpResponse } from '../protocols/http'
import { ServerError as ServerErrorClass } from '../errors/server-error'

export const badRequest = (error: Error | { [key: string]: any }): HttpResponse => ({
  statusCode: 400,
  body: error instanceof Error ? { error: error.message } : error
})

export const notFound = (error: Error | { [key: string]: any }): HttpResponse => ({
  statusCode: 404,
  body: error instanceof Error ? { error: error.message } : error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: { error: new ServerErrorClass().message }
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
