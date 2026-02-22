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

interface NewChallengeEmailProps {
  recipientName: string
  challengeTitle: string
  challengeDescription: string
  endDate: string
  reward: string
  appUrl: string
}

export function NewChallengeEmail({
  recipientName,
  challengeTitle,
  challengeDescription,
  endDate,
  reward,
  appUrl,
}: NewChallengeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nouveau challenge</Heading>
          <Text style={text}>
            Bonjour {recipientName},
          </Text>
          <Text style={text}>
            Un nouveau challenge vient d&apos;être lancé !
          </Text>
          <Section style={challengeBox}>
            <Text style={challengeTitle_style}>{challengeTitle}</Text>
            <Text style={challengeDesc}>{challengeDescription}</Text>
            <Hr style={{ borderColor: '#e0e7ff', margin: '12px 0' }} />
            <Text style={detailText}>
              Date limite : {endDate}
            </Text>
            <Text style={detailText}>
              Récompense : <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>{reward}</span>
            </Text>
          </Section>
          <Button style={button} href={`${appUrl}/challenges`}>
            Voir le challenge
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
const challengeBox = { background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', borderRadius: '8px', padding: '20px', margin: '20px 0', border: '1px solid #e0e7ff' }
const challengeTitle_style = { color: '#4f46e5', fontSize: '20px', fontWeight: 'bold' as const, margin: '0 0 8px' }
const challengeDesc = { color: '#4a4a68', fontSize: '14px', margin: '0' }
const detailText = { color: '#6b7280', fontSize: '14px', margin: '4px 0' }
const button = { backgroundColor: '#7c3aed', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 'bold' as const, textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '12px 20px', margin: '24px 0' }
const hr = { borderColor: '#e6ebf1', margin: '24px 0' }
const footer = { color: '#8898aa', fontSize: '12px' }
