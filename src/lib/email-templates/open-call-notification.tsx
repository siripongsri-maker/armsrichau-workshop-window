import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  organisation?: string
  link?: string
  about?: string
  workType?: string
  problem?: string
  oneMonthChange?: string
  contactName?: string
  email?: string
  channel?: string
  channelDetail?: string
  agreeTerms?: string
  budget?: string
  language?: string
  submittedAt?: string
}

function Row({ label, value }: { label: string; value?: string | undefined }) {
  if (!value) return null
  return (
    <Text style={row}>
      <span style={rowLabel}>{label}</span>
      <br />
      {value}
    </Text>
  )
}

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New open call application: {p.organisation ?? 'Unknown organisation'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New open call application</Heading>
        <Text style={meta}>
          {p.organisation ?? 'Unknown organisation'} · {p.submittedAt ?? ''} · language:{' '}
          {p.language ?? 'en'}
        </Text>
        <Hr style={hr} />
        <Section>
          <Row label="Organisation or brand" value={p.organisation} />
          <Row label="Page or website" value={p.link} />
          <Row label="What they do and for whom" value={p.about} />
          <Row label="Piece of work" value={p.workType} />
          <Row label="Biggest problem right now" value={p.problem} />
          <Row label="What they want to see change in one month" value={p.oneMonthChange} />
        </Section>
        <Hr style={hr} />
        <Section>
          <Row label="Main contact" value={p.contactName} />
          <Row label="Email" value={p.email} />
          <Row
            label="Preferred channel"
            value={p.channel ? p.channel + (p.channelDetail ? ` — ${p.channelDetail}` : '') : undefined}
          />
          <Row label="Agrees to portfolio, review and one-month numbers" value={p.agreeTerms} />
          <Row label="Can pay" value={p.budget} />
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Reply directly to {p.email ?? 'the applicant'} — the three picked hear back by 15 November.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) => `New open call application: ${data['organisation'] ?? 'Unknown'}`,
  displayName: 'Open call application notification',
  to: 'srichausiripong@gmail.com',
  previewData: {
    organisation: 'Example Foundation',
    link: 'https://example.org',
    about: 'We run community health workshops for young people in Bangkok.',
    workType: 'Content set: 4 posts with captions (usually about THB 8,000)',
    problem: 'Nobody knows our programmes exist outside our current network.',
    oneMonthChange: 'More signups for our monthly workshop series.',
    contactName: 'Jane Doe',
    email: 'jane@example.org',
    channel: 'LINE',
    channelDetail: 'janedoe',
    agreeTerms: 'Yes',
    budget: 'Up to 2,000',
    language: 'en',
    submittedAt: '27 Oct 2026, 10:30',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 25px', maxWidth: '560px' }
const heading = { color: '#0E2233', fontSize: '22px', margin: '0 0 4px' }
const meta = { color: '#596D7E', fontSize: '13px', margin: '0' }
const hr = { borderColor: '#E9F0F4', margin: '18px 0' }
const row = { color: '#0E2233', fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px' }
const rowLabel = { color: '#0A6F6A', fontSize: '12px', fontWeight: 600 as const, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }
const footer = { color: '#596D7E', fontSize: '13px' }
