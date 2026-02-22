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

interface SaleValidatedEmailProps {
  commercialName: string
  vehicleName: string
  clientName: string
  margin: number
  commission: number
  appUrl: string
}

export function SaleValidatedEmail({
  commercialName,
  vehicleName,
  clientName,
  margin,
  commission,
  appUrl,
}: SaleValidatedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vente validée</Heading>
          <Text style={text}>
            Bonjour {commercialName},
          </Text>
          <Text style={text}>
            Votre vente a été validée par votre direction.
          </Text>
          <Section style={detailsBox}>
            <Text style={detailLabel}>Véhicule</Text>
            <Text style={detailValue}>{vehicleName}</Text>
            <Text style={detailLabel}>Client</Text>
            <Text style={detailValue}>{clientName}</Text>
            <Text style={detailLabel}>Marge</Text>
            <Text style={detailValue}>{margin.toLocaleString('fr-FR')} €</Text>
            <Text style={detailLabel}>Commission</Text>
            <Text style={{ ...detailValue, color: '#059669', fontWeight: 'bold' }}>
              +{commission.toLocaleString('fr-FR')} €
            </Text>
          </Section>
          <Button style={button} href={`${appUrl}/dashboard`}>
            Voir mon tableau de bord
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
const detailsBox = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '20px', margin: '20px 0' }
const detailLabel = { color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' as const, margin: '8px 0 2px', letterSpacing: '0.5px' }
const detailValue = { color: '#1a1a2e', fontSize: '16px', fontWeight: '600' as const, margin: '0 0 8px' }
const button = { backgroundColor: '#4f46e5', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 'bold' as const, textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '12px 20px', margin: '24px 0' }
const hr = { borderColor: '#e6ebf1', margin: '24px 0' }
const footer = { color: '#8898aa', fontSize: '12px' }
