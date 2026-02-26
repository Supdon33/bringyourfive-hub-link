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

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

const LOGO_URL = 'https://zqltgkoytraczfpedzvr.supabase.co/storage/v1/object/public/email-assets/logo.jpeg'

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your new email for Bring Your 🖐🏿</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Bring Your Five" width="60" height="60" style={logo} />
        <Heading style={h1}>Confirm your new email</Heading>
        <Text style={text}>
          You requested to change your email from{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>
          {' '}to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
        </Text>
        <Text style={text}>
          Hit the button below to make it official:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          Didn't request this? Secure your account immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const logo = { borderRadius: '50%', marginBottom: '20px' }
const h1 = {
  fontFamily: "'Oswald', Arial, sans-serif",
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0f1218',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#848891',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#f97316', textDecoration: 'underline' }
const button = {
  backgroundColor: '#f97316',
  color: '#0f1218',
  fontFamily: "'Oswald', Arial, sans-serif",
  fontSize: '14px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  borderRadius: '0.75rem',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
