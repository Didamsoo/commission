import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
} from '@react-email/components'

interface BadgeEarnedEmailProps {
  recipientName: string
  badgeName: string
  badgeDescription: string
  appUrl: string
}

export function BadgeEarnedEmail({
  recipientName,
  badgeName,
  badgeDescription,
  appUrl,
}: BadgeEarnedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Badge obtenu !</Heading>
          <Text style={text}>
            Bonjour {recipientName},
          </Text>
          <Text style={text}>
            Félicitations ! Vous avez obtenu un nouveau badge.
          </Text>
          <Section style={badgeBox}>
            <Text style={badgeIcon}>🏆</Text>
            <Text style={badgeName_style}>{badgeName}</Text>
            <Text style={badgeDesc}>{badgeDescription}</Text>
          </Section>
          <Button style={button} href={`${appUrl}/profile`}>
            Voir mes badges
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            AutoPerf — Votre plateforme de performance automobile
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' }
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '40px 20px', maxWidth: '560px', borderRadius: '8px' }
const h1 = { color: '#1a1a2e', fontSize: '24px', fontWeight: 'bold' as const, margin: '0 0 20px' }
const text = { color: '#4a4a68', fontSize: '16px', lineHeight: '26px' }
const badgeBox = { background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: '12px', padding: '24px', margin: '20px 0', border: '1px solid #fde68a', textAlign: 'center' as const }
const badgeIcon = { fontSize: '48px', margin: '0 0 12px' }
const badgeName_style = { color: '#92400e', fontSize: '22px', fontWeight: 'bold' as const, margin: '0 0 8px' }
const badgeDesc = { color: '#78716c', fontSize: '14px', margin: '0' }
const button = { backgroundColor: '#d97706', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 'bold' as const, textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '12px 20px', margin: '24px 0' }
const hr = { borderColor: '#e6ebf1', margin: '24px 0' }
const footer = { color: '#8898aa', fontSize: '12px' }
