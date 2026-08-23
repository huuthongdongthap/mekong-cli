import { describe, it, expect } from 'vitest'
import {
  ROLE_ACCESS,
  NAV,
  ROLE_LABELS,
  visibleNavFor,
  type Role,
} from '@/components/layout/nav.config'

describe('nav.config', () => {
  it('exports every route the platform exposes', () => {
    expect(NAV.length).toBeGreaterThan(10)
    expect(NAV.map((n) => n.href)).toEqual(
      expect.arrayContaining([
        '/', '/schools', '/enterprises', '/learners', '/programs',
        '/enrollments', '/placements', '/certificates', '/academic-records',
        '/invoices', '/moas', '/evaluations', '/practice-records',
        '/scholarship', '/audit-logs', '/geographic', '/chat',
        '/documents', '/learner-profile', '/pricing', '/unit-economics',
      ])
    )
  })

  it('gives every role a label', () => {
    for (const role of Object.keys(ROLE_ACCESS) as Role[]) {
      expect(ROLE_LABELS[role]).toBeTruthy()
    }
  })

  it('learners never see the admin directory', () => {
    const learnerNav = visibleNavFor('learner')
    expect(learnerNav.map((n) => n.href)).not.toContain('/learners')
    // But they still see their own record.
    expect(learnerNav.map((n) => n.href)).toEqual(
      expect.arrayContaining([
        '/', '/enrollments', '/certificates', '/academic-records',
        '/placements', '/scholarship', '/chat', '/learner-profile',
      ])
    )
  })

  it('super admins see the full surface', () => {
    const adminNav = visibleNavFor('super_admin')
    expect(adminNav.map((n) => n.href)).toContain('/learners')
    expect(adminNav.map((n) => n.href)).toContain('/audit-logs')
    expect(adminNav.map((n) => n.href)).toContain('/unit-economics')
  })

  it('preserves NAV order in visibleNavFor', () => {
    const nav = visibleNavFor('super_admin')
    const hrefs = nav.map((n) => n.href)
    const sorted = [...hrefs].sort()
    // NAV order is preserved (not sorted alphabetically).
    expect(hrefs).not.toEqual(sorted)
    expect(hrefs).toEqual([...new Set(hrefs)])
  })

  it('returns an empty array for an unknown role', () => {
    expect(visibleNavFor(null)).toEqual([])
    expect(visibleNavFor(undefined)).toEqual([])
  })

  it('every visible item carries a label and an icon', () => {
    for (const item of visibleNavFor('super_admin')) {
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(item.icon).toBeTruthy()
    }
  })
})