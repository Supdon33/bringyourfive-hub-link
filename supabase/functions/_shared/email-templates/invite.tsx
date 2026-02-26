/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to Bring Your 🖐🏿!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://zqltgkoytraczfpedzvr.supabase.co/storage/v1/object/public/email-assets/bring-your-five-logo.jpeg"
          alt="Bring Your 5 Logo"
          width="120"
          height="120"
          style={logo}
        />
        <Heading style={h1}>You're invited! 🏀</Heading>
        <Text style={text}>
          Someone wants you on the court. You've been invited to join{' '}
          <Link href={siteUrl} style={link}>
            <strong>Bring Your 🖐🏿</strong>
          </Link>
          . Accept below to create your account and start running.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          Wasn't expecting this? You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const logo = { marginBottom: '24px', borderRadius: '12px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  fontFamily: "'Oswald', Arial, sans-serif",
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
  color: '#1a1a1a',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#f97316', textDecoration: 'underline' }
const button = {
  backgroundColor: '#f97316',
  color: '#0f1114',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  fontFamily: "'Oswald', Arial, sans-serif",
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0' }
