// @vitest-environment node

import { describe, it, expect } from 'vitest'
import { middleware } from '../../middleware'
import { NextRequest, NextResponse } from 'next/server'

function makeRequest(pathname: string, token?: string): NextRequest {
  const url = `https://example.com${pathname}`
  const req = new NextRequest(url)
  if (token) {
    req.cookies.set('linkededu-access-token', token)
  }
  return req
}

describe('middleware', () => {
  it('allows /login without token', () => {
    const res = middleware(makeRequest('/login'))
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
  })

  it('allows /register without token', () => {
    const res = middleware(makeRequest('/register'))
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(200)
  })

  it('redirects to login when no token on protected route', () => {
    const res = middleware(makeRequest('/learners'))
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/login')
    expect(res.headers.get('location')).toContain('redirect=%2Flearners')
  })

  it('passes through when token present on protected route', () => {
    const res = middleware(makeRequest('/learners', 'valid-token'))
    expect(res.status).toBe(200)
  })

  it('allows /_next paths', () => {
    const res = middleware(makeRequest('/_next/static/chunk.js'))
    expect(res.status).toBe(200)
  })

  it('allows /favicon.ico', () => {
    const res = middleware(makeRequest('/favicon.ico'))
    expect(res.status).toBe(200)
  })
})